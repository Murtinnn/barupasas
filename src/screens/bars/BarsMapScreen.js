import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Supercluster from 'supercluster';
import locationService from '../../services/locationService';
import useAuthStore from '../../store/authStore';
import { API_URL } from '../../services/apiConfig';
import TopHeader from '../../components/TopHeader';
import BottomTabBar from '../../components/BottomTabBar';

const BarsMapScreen = ({ navigation }) => {
  const { token } = useAuthStore();
  const [bars, setBars] = useState([]);
  	// const [loading, setLoading] = useState(true); // No loading state for seamless navigation
  const [userLoc, setUserLoc] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const location = await locationService.getCurrentLocation();
        if (location) {
          setUserLoc(location);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        let page = 1; const perPage = 300; let all = []; let last = 1;
        while (true) {
          const params = new URLSearchParams();
          params.set('per_page', String(perPage));
          params.set('page', String(page));
          params.set('all', '1');
          const res = await fetch(`${API_URL}/bars?${params.toString()}`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } });
          const data = await res.json();
          if (!res.ok || !data?.success) throw new Error();
          const items = data.data?.items || [];
          all = all.concat(items);
          last = data.data?.pagination?.last_page || 1;
          page += 1;
          if (!items.length || page > last || page > 1000) break;
        }
        const byId = new Map();
        for (const b of all) { if (b && b.id != null) byId.set(b.id, b); }
        setBars(Array.from(byId.values()));
      } catch {}
      // No loading state for seamless navigation
    })();
  }, [token]);

  const initialRegion = useMemo(() => {
    if (userLoc) {
      return {
        latitude: Number(userLoc.coords.latitude),
        longitude: Number(userLoc.coords.longitude),
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    return { latitude: 55.1694, longitude: 23.8813, latitudeDelta: 2.5, longitudeDelta: 2.5 };
  }, [userLoc]);

  useEffect(() => {
    if (!region && initialRegion) setRegion(initialRegion);
  }, [initialRegion, region]);

  const clusterIndex = useMemo(() => {
    const points = bars
      .map(b => {
        if (!b) return null;
        const lat = parseFloat(String(b.latitude).replace(',', '.'));
        const lng = parseFloat(String(b.longitude).replace(',', '.'));
        if (!isFinite(lat) || !isFinite(lng)) return null;
        return {
        type: 'Feature',
        properties: {
          cluster: false,
          barId: b.id,
          isOpen: !!b.today_status?.is_open_now,
        },
        geometry: { type: 'Point', coordinates: [lng, lat] },
      };
      })
      .filter(Boolean);
    const idx = new Supercluster({ radius: 240, maxZoom: 16, minPoints: 2 });
    idx.load(points);
    return idx;
  }, [bars]);

  const zoomFromDelta = (lngDelta, latitude) => {
    if (!lngDelta) return 2;
    const { width } = Dimensions.get('window');
    const worldTileSize = 256;
    const scale = width / worldTileSize;
    // approximate Google tile zoom from longitude span
    const z = Math.log2((360 * scale) / lngDelta);
    return Math.max(0, Math.min(20, Math.round(z)));
  };

  const clusters = useMemo(() => {
    if (!region) return { items: [], zoom: 2 };
    const zoom = zoomFromDelta(region.longitudeDelta, region.latitude);
    // Get clusters for entire world at this zoom, then filter to viewport
    const world = [-180, -85, 180, 85];
    const all = clusterIndex.getClusters(world, zoom);
    const halfLng = region.longitudeDelta / 2;
    const halfLat = region.latitudeDelta / 2;
    const west = region.longitude - halfLng;
    const south = region.latitude - halfLat;
    const east = region.longitude + halfLng;
    const north = region.latitude + halfLat;
    const padLng = region.longitudeDelta * 0.15;
    const padLat = region.latitudeDelta * 0.15;
    const items = all.filter((c) => {
      const [lng, lat] = c.geometry.coordinates;
      return lng >= (west - padLng) && lng <= (east + padLng) && lat >= (south - padLat) && lat <= (north + padLat);
    });
    return { items, zoom };
  }, [clusterIndex, region]);

  const showNames = useMemo(() => {
    if (!region) return false;
    const zoom = clusters?.zoom ?? 0;
    return zoom >= 15 || region.longitudeDelta < 0.03;
  }, [region, clusters]);

  const recenter = () => {
    if (mapRef.current && userLoc) {
      const next = {
        latitude: Number(userLoc.coords.latitude),
        longitude: Number(userLoc.coords.longitude),
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
      setRegion(next);
      mapRef.current.animateToRegion(next, 500);
    }
  };

  const openDetails = async (barId) => {
    try {
      const res = await fetch(`${API_URL}/bars/${barId}`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && data?.success) { setSelected(data.data.bar); }
    } catch {}
  };

  const todayStatus = useMemo(() => {
    if (!selected) return null;
    if (selected.today_status) return selected.today_status;
    try {
      const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const today = days[new Date().getDay()];
      const hours = Array.isArray(selected.working_hours) ? selected.working_hours.find(h => h.day_of_week === today) : null;
      if (!hours) return null;
      if (hours.is_closed) return { is_open_now: false };
      const now = new Date();
      const [openH, openM] = String(hours.opening_time || '00:00').split(':').map(Number);
      let [closeH, closeM] = String(hours.closing_time || '00:00').split(':').map(Number);
      if (closeH === 0 && closeM === 0) { closeH = 23; closeM = 59; }
      const open = new Date(now.getFullYear(), now.getMonth(), now.getDate(), openH, openM);
      let close = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closeH, closeM);
      if (close <= open) { close.setDate(close.getDate() + 1); }
      const isOpen = now >= open && now <= close;
      return { is_open_now: isOpen, opening_time: hours.opening_time, closing_time: hours.closing_time };
    } catch { return null; }
  }, [selected]);

  const onClusterPress = (cluster, markers) => {
    try {
      if (mapRef.current && markers && markers.length) {
        const coords = markers.map((m) => ({ latitude: m.coordinate.latitude, longitude: m.coordinate.longitude }));
        mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 80, right: 80, bottom: 120, left: 80 }, animated: true });
      }
    } catch {}
  };

  // Remove blocking loading screen for seamless navigation

  return (
    <View style={{ flex: 1, backgroundColor: '#0a3848' }}>
      <TopHeader title="Barų žemėlapis" />
      <View style={{ flex: 1, paddingBottom: 80 }}>
      {/* No loading indicator for seamless navigation */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        customMapStyle={googleDarkStyle}
        showsUserLocation
        showsMyLocationButton={false}
        moveOnMarkerPress={false}
        onRegionChangeComplete={(r) => setRegion(r)}
        onMapReady={() => setMapReady(true)}
      >
        {clusters.items.map((c, idx) => {
          const [lng, lat] = c.geometry.coordinates;
          const coord = { latitude: lat, longitude: lng };
          if (c.properties.cluster) {
            const countValue = c.properties.point_count;
            const countStr = String(countValue);
            const digits = countStr.length;
            return (
              <Marker key={`cl-${c.id ?? idx}`} coordinate={coord} tracksViewChanges={true} onPress={() => {
                try {
                  // Greitai išskaidome naudodami vaikų ribas
                  const children = clusterIndex.getChildren(c.id) || [];
                  const coords = children
                    .map(ch => ch?.geometry?.coordinates)
                    .filter(Boolean)
                    .map(([lng2, lat2]) => ({ latitude: lat2, longitude: lng2 }));
                  if (coords.length >= 2 && mapRef.current) {
                    mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 60, right: 60, bottom: 160, left: 60 }, animated: true });
                  } else {
                    const exp = clusterIndex.getClusterExpansionZoom(c.id);
                    const { width, height } = Dimensions.get('window');
                    const aspect = height / width || 1.8;
                    const lonDelta = 360 / Math.pow(2, exp);
                    const latDelta = lonDelta * aspect;
                    if (mapRef.current) mapRef.current.animateToRegion({
                      latitude: coord.latitude,
                      longitude: coord.longitude,
                      latitudeDelta: latDelta,
                      longitudeDelta: lonDelta,
                    }, 250);
                  }
                } catch {}
              }}>
                <View style={[
                  styles.clusterPill,
                  digits >= 3 && styles.clusterPillWide,
                  digits >= 4 && styles.clusterPillWider,
                ]}>
                  <Text style={styles.clusterText}>{countStr}</Text>
                </View>
              </Marker>
            );
          }
          const barId = c.properties.barId;
          const bar = bars.find(b => b.id === barId);
          const isOpen = bar?.today_status?.is_open_now;
          return (
            <Marker key={`m-${barId}`} coordinate={coord} onPress={() => openDetails(barId)} tracksViewChanges={true}>
              <View style={styles.nameMarkerWrap}>
                <View style={[styles.dot, { backgroundColor: isOpen ? '#10b981' : '#ef4444' }]} />
                <Text style={styles.nameMarkerText}>{bar?.name || 'Baras'}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.topBar} pointerEvents="box-none">
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Atgal</Text>
        </TouchableOpacity>
        {/* No loading indicator for seamless navigation */}
      </View>
      <TouchableOpacity style={styles.fab} onPress={recenter}>
        <Text style={styles.fabText}>Mano vieta</Text>
      </TouchableOpacity>

      {selected ? (
        <View style={styles.bottomSheet}>
          {selected.image_url ? (
            <Image source={{ uri: selected.image_url }} style={styles.sheetImage} />
          ) : null}
          <View style={[styles.sheetContent, { alignItems: 'center' }]}>
            <Text style={[styles.cardTitle, { textAlign: 'center' }]}>{selected.name}</Text>
            {selected.address ? <Text style={[styles.cardAddress, { textAlign: 'center', marginTop: 6 }]}>{selected.address}</Text> : null}
            {todayStatus ? (
              <View style={styles.statusRow}>
                <View style={[styles.dot, { backgroundColor: todayStatus.is_open_now ? '#10b981' : '#ef4444' }]} />
                <Text style={styles.cardMeta}>
                  {todayStatus.is_open_now ? `Atidaryta ${todayStatus.opening_time}–${todayStatus.closing_time}` : 'Uždaryta'}
                </Text>
              </View>
            ) : null}
            <TouchableOpacity style={styles.cardBtn} onPress={()=>{ setSelected(null); navigation.navigate('BarDetails', { id: selected.id }); }}>
              <Text style={styles.cardBtnText}>Plačiau →</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeX} onPress={()=>setSelected(null)}><Text style={{ color: '#fff' }}>✕</Text></TouchableOpacity>
        </View>
      ) : null}
      </View>
      <BottomTabBar />
    </View>
  );
};

const googleDarkStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }, { weight: 2 }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a3848', overflow: 'hidden' },
  topBar: { position: 'absolute', top: 14, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { backgroundColor: 'rgba(10,56,72,0.9)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  backText: { color: '#ffffff', fontWeight: '700' },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#0b3d2c', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12 },
  fabText: { color: '#ffffff', fontWeight: '800' },
  bottomCard: { position: 'absolute', left: 14, right: 14, bottom: 20, backgroundColor: '#0f4a60', borderRadius: 12, padding: 12 },
  cardThumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#123e51' },
  cardTitle: { color: '#ffffff', fontWeight: '800', fontSize: 20 },
  cardMeta: { color: '#ffffff', marginLeft: 8 },
  cardBtn: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, alignSelf: 'stretch', marginTop: 16, width: '100%', alignItems: 'center' },
  cardBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  closeX: { position: 'absolute', right: 8, top: 8, padding: 6 },
  dot: { width: 8, height: 8, borderRadius: 999 },
  clusterPill: { minWidth: 50, height: 50, paddingHorizontal: 12, borderRadius: 25, backgroundColor: '#004259', borderWidth: 2, borderColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  clusterPillWide: { paddingHorizontal: 16 },
  clusterPillWider: { paddingHorizontal: 20 },
  clusterText: { color: '#ffffff', fontWeight: '800', fontSize: 18, textAlign: 'center' },
  nameMarkerWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 2, borderColor: '#111827' },
  nameMarkerText: { color: '#111827', fontWeight: '700', marginLeft: 6 },
  // Bottom sheet styles
  bottomSheet: { position: 'absolute', left: 10, right: 10, bottom: 10, backgroundColor: '#0f4a60', borderRadius: 16, overflow: 'hidden', paddingBottom: 16 },
  sheetImage: { width: '100%', height: 220, resizeMode: 'cover' },
  sheetContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  cardAddress: { color: '#d1d5db' },
});

export default BarsMapScreen;


