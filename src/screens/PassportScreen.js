import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import CenteredAvatar from '../components/CenteredAvatar';
import useAuthStore from '../store/authStore';
import { API_URL } from '../services/apiConfig';
import TopHeader from '../components/TopHeader';
import BottomTabBar from '../components/BottomTabBar';

const PassportScreen = ({ navigation }) => {
  const { token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [friends, setFriends] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Try full endpoint first - no timeout for faster loading
        const res = await fetch(`${API_URL}/passport/full`, { 
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
        });
        let usedFull = false;
        if (res.ok) {
          const data = await res.json();
          if (data?.success) {
            usedFull = true;
            setProfile(data.data.profile);
            setBadges(data.data.badges || []);
            setWishlist(data.data.wishlist_bars || []);
            setCheckins(data.data.checkins || []);
            setFriends(data.data.friends || []);
          }
        }
        // Complement or fallback from legacy endpoints
        const [userRes, passRes] = await Promise.all([
          fetch(`${API_URL}/auth/user`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/passport`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }),
        ]);
        const userJson = userRes.ok ? await userRes.json().catch(()=>({})) : {};
        const passJson = passRes.ok ? await passRes.json().catch(()=>({})) : {};
        if (!profile && userJson?.success && userJson?.data?.user) {
          const u = userJson.data.user;
          setProfile(p => p || ({
            id: u.id,
            name: u.name,
            created_at: '',
            avatar: u.profile_photo_url,
            description: u.description,
            facebook_url: u.facebook_url,
            instagram_url: u.instagram_url,
            bar_streak: 0,
            beer_count: 0,
          }));
        }
        if ((usedFull && (!Array.isArray(checkins) || checkins.length === 0)) || !usedFull) {
          if (passJson?.success) {
            const list = passJson.data.items || [];
            setCheckins(list.map(it => ({
              id: it.id,
              bar_id: it.bar_id,
              bar_name: it.bar_name,
              address: '',
              image_url: it.image_url,
              visited_at: it.visit_date,
            })));
          }
        }
      } catch {
        // ignore
      }
      setLoading(false);
    })();
  }, [token]);

  // Remove blocking loading screen for seamless navigation

  return (
    <View style={{ flex: 1, backgroundColor: '#0a3848' }}>
      <TopHeader title="Mano pasas" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 104 }}>
      {loading && !profile && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator color="#ffffff" size="large" />
          <Text style={{ color: '#ffffff', marginTop: 10 }}>Kraunama...</Text>
        </View>
      )}
      {/* Profile header */}
      <View style={styles.profileCard}>
        <View style={{ alignItems: 'center' }}>
          <CenteredAvatar uri={profile?.avatar} name={profile?.name} size={80} backgroundColor="#4f46e5" textColor="#ffffff" />
          <Text style={styles.profileOwner}>Paso savininkas</Text>
          <Text style={styles.profileName}>{profile?.name}</Text>
          <Text style={styles.profileCreated}>Paskyra sukurta: {profile?.created_at}</Text>
          {profile?.description ? <Text style={styles.profileAbout}>{profile.description}</Text> : null}
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statLabel}>Barų streakas:</Text><Text style={styles.statValue}>{profile?.bar_streak ?? 0}</Text></View>
          <View style={styles.statBox}><Text style={styles.statLabel}>Išgerta alaus:</Text><Text style={styles.statValue}>{profile?.beer_count ?? 0}</Text></View>
        </View>
      </View>

      {/* Friends */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Mano draugai ({friends.length})</Text>
        <View style={styles.innerScrollBox}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
            {friends.map(fr => (
              <TouchableOpacity key={`fr-${fr.id}`} style={styles.listItem} onPress={()=>navigation.navigate('FriendPassport', { userId: fr.id })}>
                <CenteredAvatar uri={fr.avatar} name={fr.name} size={48} backgroundColor="#4f46e5" textColor="#ffffff" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle} numberOfLines={1}>  {fr.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View pointerEvents="none" style={styles.fadeTop} />
          <View pointerEvents="none" style={styles.fadeBottom} />
        </View>
      </View>

      {/* Badges */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Surinkti ženkliukai ({badges.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
          {badges.map(b => (
            <View key={`b-${b.id}`} style={styles.badgeItem}>
              {b.icon_url ? <Image source={{ uri: b.icon_url }} style={{ width: 48, height: 48, marginBottom: 6 }} /> : <View style={{ width:48, height:48, marginBottom:6 }} />}
              <Text style={styles.badgeName} numberOfLines={1}>{b.name}</Text>
              <Text style={styles.badgeDate}>{(b.awarded_at || '').slice(0,10)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Wishlist */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Mėgstamiausi barai ({wishlist.length})</Text>
        <View style={styles.innerScrollBox}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
            {wishlist.map(w => (
              <TouchableOpacity key={`w-${w.id}`} style={styles.listItem} onPress={()=>navigation.navigate('BarDetails', { id: w.id })}>
                <Image source={{ uri: w.image_url }} style={styles.itemThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{w.name}</Text>
                  <Text style={styles.itemMeta} numberOfLines={1}>{w.address || ''}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View pointerEvents="none" style={styles.fadeTop} />
          <View pointerEvents="none" style={styles.fadeBottom} />
        </View>
      </View>

      {/* Recent checkins */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Paskutiniai apsilankymai ({checkins.length})</Text>
        <View style={styles.innerScrollBox}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
            {checkins.map(c => (
              <TouchableOpacity key={`c-${c.id}`} style={styles.listItem} onPress={()=>navigation.navigate('BarDetails', { id: c.bar_id })}>
                <Image source={{ uri: c.image_url }} style={styles.itemThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{c.bar_name}</Text>
                  <Text style={styles.itemMeta} numberOfLines={1}>{c.address}</Text>
                  <Text style={styles.itemMetaSub}>{c.visited_at}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View pointerEvents="none" style={styles.fadeTop} />
          <View pointerEvents="none" style={styles.fadeBottom} />
        </View>
      </View>
      </ScrollView>
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0a3848', padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerText: { color: '#ffffff', marginTop: 12 },
  profileCard: { backgroundColor: '#004259', borderRadius: 16, padding: 24, marginBottom: 20 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  profileOwner: { color: '#ffffff', fontWeight: '700', marginTop: 8 },
  profileName: { color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 8 },
  profileCreated: { color: '#d1d5db', marginTop: 8 },
  profileAbout: { color: '#e5e7eb', marginTop: 16, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  statBox: { backgroundColor: '#0a3848', borderRadius: 10, padding: 16, flex: 1, marginHorizontal: 6, alignItems: 'center' },
  statLabel: { color: '#9ca3af', fontWeight: '700', marginBottom: 4 },
  statValue: { color: '#a5b4fc', fontSize: 32, fontWeight: '900', marginTop: 4 },
  sectionCard: { backgroundColor: '#004259', borderRadius: 12, padding: 20, marginBottom: 20 },
  sectionTitle: { color: '#ffffff', fontWeight: '800', marginBottom: 16, fontSize: 18 },
  badgeItem: { backgroundColor: '#0a3848', alignItems: 'center', padding: 12, borderRadius: 8, marginRight: 12, minWidth: 110 },
  badgeName: { color: '#e5e7eb', fontWeight: '600', marginTop: 4 },
  badgeDate: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  innerScrollBox: { position: 'relative', maxHeight: 280 },
  fadeTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 16, backgroundColor: 'rgba(10,56,72,0)', },
  fadeBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 16, backgroundColor: 'rgba(10,56,72,0)', },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a3848', padding: 16, borderRadius: 10, marginBottom: 12 },
  itemThumb: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  itemTitle: { color: '#93c5fd', fontWeight: '700', marginBottom: 4 },
  itemMeta: { color: '#cbd5e1', marginBottom: 2 },
  itemMetaSub: { color: '#9ca3af', marginTop: 4 },
});

export default PassportScreen;


