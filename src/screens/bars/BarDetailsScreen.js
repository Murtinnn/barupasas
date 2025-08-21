import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Modal, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import useAuthStore from '../../store/authStore';
import { API_URL, WEB_URL } from '../../services/apiConfig';
import CenteredAvatar from '../../components/CenteredAvatar';
import { Image as ExpoImage } from 'expo-image';
import TopHeader from '../../components/TopHeader';
import BottomTabBar from '../../components/BottomTabBar';

const LT_WEEKDAYS_FULL = {
  1: 'Pirmadienis',
  2: 'Antradienis',
  3: 'Trečiadienis',
  4: 'Ketvirtadienis',
  5: 'Penktadienis',
  6: 'Šeštadienis',
  7: 'Sekmadienis',
  monday: 'Pirmadienis',
  tuesday: 'Antradienis',
  wednesday: 'Trečiadienis',
  thursday: 'Ketvirtadienis',
  friday: 'Penktadienis',
  saturday: 'Šeštadienis',
  sunday: 'Sekmadienis',
};

function getLtWeekdayFull(day) {
  if (typeof day === 'number') return LT_WEEKDAYS_FULL[day] || String(day);
  const asNum = parseInt(day, 10);
  if (!Number.isNaN(asNum)) return LT_WEEKDAYS_FULL[asNum] || String(day);
  const key = String(day || '').toLowerCase();
  return LT_WEEKDAYS_FULL[key] || String(day);
}

const BarDetailsScreen = ({ route }) => {
  const { id } = route.params || {};
  const { token } = useAuthStore();
  const navigation = useNavigation();
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString('lt-LT', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return String(iso);
    }
  };

  const fetchBar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/bars/${id}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Nepavyko gauti baro');
      setBar(data.data.bar);
    } catch (e) {
      setError(e.message || 'Klaida');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBar(); }, [id, token]);

  // No actions on details screen per new requirements

  // Remove blocking loading screen for seamless navigation

  // Remove blocking error screen for seamless navigation

  if (!bar) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#0a3848' }}>
      <TopHeader title={bar.name} />
      <View style={{ flex: 1, paddingBottom: 80 }}>
                <ScrollView contentContainerStyle={styles.container}>
        {loading && !bar && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator color="#ffffff" size="large" />
            <Text style={{ color: '#ffffff', marginTop: 10 }}>Kraunama...</Text>
          </View>
        )}
        {error && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#ef4444', textAlign: 'center' }}>{error}</Text>
          </View>
        )}
        {bar.image_url ? (
        <ExpoImage source={{ uri: bar.image_url }} style={styles.cover} contentFit="cover" />
      ) : null}
      {bar.latitude && bar.longitude ? (
        <View style={styles.mapWrap}>
          <MapView
            style={styles.map}
            pointerEvents="none"
            initialRegion={{
              latitude: Number(bar.latitude),
              longitude: Number(bar.longitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude: Number(bar.latitude), longitude: Number(bar.longitude) }} title={bar.name} />
          </MapView>
        </View>
      ) : null}
      <View style={styles.rowBetween}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.title}>{bar.name}</Text>
          {bar.address ? <Text style={styles.sub}>{bar.address}</Text> : null}
        </View>
        <TouchableOpacity 
          style={styles.inviteButton}
          onPress={() => navigation.navigate('BarInvite', { barId: bar.id, barName: bar.name })}
        >
          <Text style={styles.inviteButtonText}>Pakviesti draugus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}> 
        <Text style={styles.badge}>{bar.checkins_count} check‑in</Text>
        {Array.isArray(bar.categories) && bar.categories.length > 0 ? (
          <View style={styles.row}>
            {bar.categories.map((c, idx) => (
              <Text key={`c-${c.id || idx}`} style={[styles.badge, { marginRight: 6 }]}>{c.name}</Text>
            ))}
          </View>
        ) : null}
      </View>
      {Array.isArray(bar.tags) && bar.tags.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
          {bar.tags.map((t) => (
            <Text key={`t-${t.id}`} style={[styles.badge, t.color ? { backgroundColor: t.color, color: '#ffffff' } : null, { marginRight: 6 }]}>{t.name}</Text>
          ))}
        </ScrollView>
      ) : null}
      {bar.description ? <Text style={styles.p}>{bar.description}</Text> : null}

      {Array.isArray(bar.working_hours) && bar.working_hours.length > 0 ? (
        <View style={styles.blockDark}> 
          <Text style={styles.sectionTitle}>Darbo laikas</Text>
          {bar.working_hours.map((wh, idx) => (
            <View key={`wh-${idx}`} style={styles.whRow}>
              <Text style={styles.whDay}>{getLtWeekdayFull(wh.day_of_week)}</Text>
              <Text style={styles.whTime}>
                {wh.is_closed ? 'Nedirba' : `${wh.opening_time ?? '--:--'} – ${wh.closing_time ?? '--:--'}`}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {Array.isArray(bar.photos) && bar.photos.length > 0 ? (
        <View style={styles.blockDark}>
          <Text style={styles.sectionTitle}>Vartotojų nuotraukos</Text>
          <View style={{ gap: 10 }}>
            {(() => {
              const rows = [];
              for (let i = 0; i < bar.photos.length; i += 2) {
                rows.push(bar.photos.slice(i, i + 2));
              }
              return rows.map((row, idx) => (
                <View key={`pr-${idx}`} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {row.map((item) => {
                    const uri = `${WEB_URL.replace(/\/$/, '')}/storage/${item.photo_path}`;
                    return (
                      <TouchableOpacity
                        key={`ph-${item.id}`}
                        activeOpacity={0.9}
                        onPress={() => { setCurrentPhotoIndex(bar.photos.findIndex(p => p.id === item.id)); setPhotoModalVisible(true); }}
                        style={styles.photoCell}
                      >
                        <ExpoImage source={{ uri }} style={styles.photoSquare} contentFit="cover" />
                      </TouchableOpacity>
                    );
                  })}
                  {row.length === 1 ? <View style={[styles.photoCell, { opacity: 0 }]} /> : null}
                </View>
              ));
            })()}
          </View>
        </View>
      ) : null}

      {Array.isArray(bar.checkin_comments) && bar.checkin_comments.length > 0 ? (
        <View style={styles.blockDark}>
          <Text style={styles.sectionTitle}>Komentarai</Text>
          {bar.checkin_comments.map((cm) => (
            <View key={`cm-${cm.id}`} style={styles.commentCard}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <CenteredAvatar uri={cm.user?.avatar} name={cm.user?.name} size={40} backgroundColor="#4f46e5" textColor="#ffffff" borderWidth={2} borderColor="#134e61" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <View style={styles.commentHeaderRow}>
                    <Text style={styles.commentAuthor}>{cm.user?.name || 'Vartotojas'}</Text>
                    <Text style={styles.commentDate}>{formatDate(cm.created_at)}</Text>
                  </View>
                  <Text style={styles.commentText}>{cm.comment}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {/* Social check‑in button is shown only on list card, not on details */}

      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setPhotoModalVisible(false)} />
          {Array.isArray(bar.photos) && bar.photos.length > 0 ? (() => {
            const photo = bar.photos[currentPhotoIndex] || bar.photos[0];
            const uri = `${WEB_URL.replace(/\/$/, '')}/storage/${photo.photo_path}`;
            const goPrev = () => setCurrentPhotoIndex((i) => Math.max(0, i - 1));
            const goNext = () => setCurrentPhotoIndex((i) => Math.min(bar.photos.length - 1, i + 1));
            let touchX = 0;
            return (
              <View style={{ width: '100%', alignItems: 'center' }}
                onStartShouldSetResponder={() => true}
                onResponderGrant={(e) => { touchX = e.nativeEvent.pageX; }}
                onResponderRelease={(e) => {
                  const dx = e.nativeEvent.pageX - touchX;
                  const threshold = 40;
                  if (dx > threshold) goPrev();
                  if (dx < -threshold) goNext();
                }}
              >
                <ExpoImage source={{ uri }} style={styles.modalImage} contentFit="contain" />
                <View style={styles.modalInfoRow}>
                  <CenteredAvatar uri={photo.user?.avatar} name={photo.user?.name} size={32} backgroundColor="#4f46e5" textColor="#ffffff" />
                  <Text style={styles.modalInfoText}>{photo.user?.name || 'Vartotojas'}</Text>
                </View>
                {currentPhotoIndex > 0 ? (
                  <TouchableOpacity style={[styles.navArrow, { left: 12 }]} onPress={goPrev}>
                    <Text style={styles.navArrowText}>‹</Text>
                  </TouchableOpacity>
                ) : null}
                {currentPhotoIndex < bar.photos.length - 1 ? (
                  <TouchableOpacity style={[styles.navArrow, { right: 12 }]} onPress={goNext}>
                    <Text style={styles.navArrowText}>›</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          })() : null}
          <TouchableOpacity style={styles.modalClose} onPress={() => setPhotoModalVisible(false)}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
        </ScrollView>
      </View>
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16 },
  cover: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16, backgroundColor: '#0a3848' },
  mapWrap: { width: '100%', height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 16, backgroundColor: '#0a3848' },
  map: { width: '100%', height: '100%' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff' },
  sub: { color: '#ffffff', marginTop: 2 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  badge: { backgroundColor: '#123e51', color: '#ffffff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, overflow: 'hidden' },
  statusText: { color: '#ffffff', marginLeft: 6 },
  dot: { width: 8, height: 8, borderRadius: 999 },
  p: { fontSize: 16, color: '#ffffff', lineHeight: 22 },
  section: { marginTop: 20 },
  blockDark: { marginTop: 20, backgroundColor: '#0f4a60', borderRadius: 12, padding: 12 },
  sectionTitle: { fontWeight: '800', color: '#ffffff', marginBottom: 10 },
  whRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  whDay: { color: '#ffffff' },
  whTime: { color: '#ffffff', fontWeight: '600' },
  error: { color: '#ffffff' },
  photoThumb: { width: 140, height: 100, borderRadius: 8, marginRight: 8, backgroundColor: '#123e51' },
  photoCell: { width: '49%' },
  photoSquare: { width: '100%', aspectRatio: 1, borderRadius: 8, backgroundColor: '#123e51' },
  commentRow: { marginBottom: 8 },
  commentCard: { backgroundColor: '#0a3b4d', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#0f4a60' },
  commentHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  commentAuthor: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  commentDate: { color: '#9ca3af', fontSize: 12 },
  commentText: { color: '#ffffff', marginTop: 6, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: '90%', height: '80%' },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modalClose: { position: 'absolute', top: 40, right: 20, backgroundColor: '#00000088', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4 },
  modalCloseText: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  modalInfoRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalInfoText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  navArrow: { position: 'absolute', top: '50%', transform: [{ translateY: -20 }], backgroundColor: '#00000088', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  navArrowText: { color: '#ffffff', fontSize: 24, fontWeight: '800', lineHeight: 24 },
  socialBtn: { backgroundColor: '#6d28d9', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16 },
  socialBtnDisabled: { backgroundColor: '#6b7280' },
  socialBtnText: { color: '#ffffff', fontWeight: '800' },
  inviteButton: { backgroundColor: '#4f46e5', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12},
  inviteButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
});

export default BarDetailsScreen;
