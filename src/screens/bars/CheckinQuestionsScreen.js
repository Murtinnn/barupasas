import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, Image, ActivityIndicator, Modal, StatusBar, SafeAreaView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import CenteredAvatar from '../../components/CenteredAvatar';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import useAuthStore from '../../store/authStore';
import { API_URL } from '../../services/apiConfig';

const CheckinQuestionsScreen = ({ route, navigation }) => {
  const { barId, questions = [], isSocialCheckin = false } = route.params || {};
  const { token } = useAuthStore();
  const [answers, setAnswers] = useState(() => {
    const init = {}; (questions || []).forEach(q => { init[q.id] = 5; });
    return init;
  });
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null); // { uri, base64, mime }
  const [submitting, setSubmitting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const canSubmit = useMemo(() => Object.keys(answers).length === (questions || []).length, [answers, questions]);

  // Fetch friends when component mounts
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API_URL}/friends/frequent`, {
          headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success && data.data) {
          // Backend already sorts by frequency (most frequent first)
          setFriends(data.data);
          return; // Success, no need for fallback
        }
      } catch (e) {
        // Fallback to regular friends list
        try {
          const fallbackRes = await fetch(`${API_URL}/passport/full`, {
            headers: { 
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success && fallbackData.data.friends) {
            setFriends(fallbackData.data.friends);
          }
        } catch (fallbackE) {
          // Silent fail
        }
      }
    };
    
    if (token) {
      fetchFriends();
    }
  }, [token]);

  const handleChange = (id, val) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const toggleFriend = (friendId) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const openFriendsModal = () => {
    setShowFriendsModal(true);
  };

  const closeFriendsModal = () => {
    setShowFriendsModal(false);
  };

  const pickImage = async () => {
    const permLib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permLib.status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.9, exif: true });
    if (!res.canceled && res.assets?.length) {
      const a = res.assets[0];
      setPhoto({ uri: a.uri, base64: a.base64, mime: a.mimeType || 'image/jpeg' });
    }
  };

  const takePhoto = async () => {
    const permCam = await ImagePicker.requestCameraPermissionsAsync();
    if (permCam.status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.9, exif: true });
    if (!res.canceled && res.assets?.length) {
      const a = res.assets[0];
      setPhoto({ uri: a.uri, base64: a.base64, mime: a.mimeType || 'image/jpeg' });
    }
  };

  const submit = async () => {
    if (!token || !barId || !canSubmit || submitting) return;
    setSubmitting(true);
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/checkins/${barId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          answers, 
          comment, 
          photo_base64: photo?.base64 || null, 
          photo_mime: photo?.mime || null,
          friend_ids: selectedFriends
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        const message = isSocialCheckin ? 'Social check-in atliktas!' : 'Check‑in atliktas!';
        alert(data?.data?.message || message);
        // Force refresh of bars list to show green border
        if (navigation.getParent()) {
          navigation.getParent().setParams({ refresh: Date.now() });
        }
        navigation.goBack();
        return;
      }
      alert(data?.message || 'Nepavyko pateikti atsakymų');
    } catch (e) {
      alert('Klaida pateikiant atsakymus');
    } finally { setSubmitting(false); setBusy(false); }
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        {(questions || []).map(q => (
          <View key={`q-${q.id}`} style={styles.card}>
            <Text style={styles.q}>{q.text}</Text>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>1</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={answers[q.id]}
                minimumTrackTintColor="#16a34a"
                maximumTrackTintColor="#123e51"
                thumbTintColor="#16a34a"
                onValueChange={(v) => handleChange(q.id, v)}
              />
              <Text style={styles.sliderLabel}>10</Text>
            </View>
            <Text style={styles.currentVal}>Įvertinimas: {answers[q.id]}</Text>
          </View>
        ))}
        <View style={styles.card}>
          <Text style={styles.q}>Komentaras (neprivaloma)</Text>
          <TextInput value={comment} onChangeText={setComment} placeholder="Įrašykite komentarą" placeholderTextColor="#9ca3af" style={styles.input} multiline />
          <View style={styles.photoRow}>
            {photo?.uri ? <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" /> : null}
            <TouchableOpacity style={styles.photoBtn} onPress={pickImage}><Text style={styles.photoBtnText}>{photo ? 'Keisti nuotrauką' : 'Pridėti iš galerijos'}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}><Text style={styles.photoBtnText}>Nufotografuoti</Text></TouchableOpacity>
          </View>
        </View>
        
        {/* Draugų pasirinkimas tik social check-in'ui */}
        {isSocialCheckin && (
          <View style={styles.card}>
            <Text style={styles.q}>Buvau ne vienas</Text>
            <TouchableOpacity style={styles.friendsButton} onPress={openFriendsModal}>
              <Text style={styles.friendsButtonText}>
                {selectedFriends.length > 0 
                  ? `Pasirinkta draugų: ${selectedFriends.length}` 
                  : 'Pasirinkti draugus'
                }
              </Text>
              <Text style={styles.friendsButtonIcon}>👥</Text>
            </TouchableOpacity>
            {selectedFriends.length > 0 && (
              <View style={styles.selectedFriendsList}>
                {friends
                  .filter(f => selectedFriends.includes(f.id))
                  .map(friend => (
                    <View key={friend.id} style={styles.selectedFriendTag}>
                      <Text style={styles.selectedFriendName}>{friend.name}</Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.submitBtn, (!canSubmit || submitting) && styles.submitBtnDisabled]} onPress={submit} disabled={!canSubmit || submitting}>
          <Text style={styles.submitText}>
            {submitting ? 'Siunčiama...' : (isSocialCheckin ? 'Atlikti check-in' : 'Pateikti atsakymus')}
          </Text>
        </TouchableOpacity>
      </View>
      {busy ? (
        <View style={styles.overlay}> 
          <ActivityIndicator color="#ffffff" size="large" />
          <Text style={{ color: '#ffffff', marginTop: 8 }}>Įkeliama...</Text>
        </View>
      ) : null}
      
      <Modal
        visible={showFriendsModal}
        transparent={false}
        animationType="slide"
        onRequestClose={closeFriendsModal}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0a3848" />
        <View style={styles.fullScreenModal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Su kuo buvote?</Text>
              <TouchableOpacity onPress={closeFriendsModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalFriendsList}>
              <Text style={styles.modalHint}>
                {friends.length > 0 ? `Dažniausiai kartu žymimi draugai (${friends.length}):` : 'Draugų sąrašas tuščias'}
              </Text>
              {friends.map((friend, index) => (
                <TouchableOpacity 
                  key={friend.id} 
                  style={[
                    styles.modalFriendItem, 
                    selectedFriends.includes(friend.id) && styles.modalFriendItemSelected
                  ]}
                  onPress={() => toggleFriend(friend.id)}
                >
                  <View style={styles.modalFriendAvatar}>
                    <CenteredAvatar
                      uri={friend.profile_photo_url}
                      name={friend.name}
                      size={50}
                      backgroundColor="#4f46e5"
                      textColor="#ffffff"
                    />
                  </View>
                  <View style={styles.modalFriendInfo}>
                    <Text style={[
                      styles.modalFriendName,
                      selectedFriends.includes(friend.id) && styles.modalFriendNameSelected
                    ]}>
                      {friend.name}
                    </Text>
                    {friend.checkin_count > 0 && (
                      <Text style={styles.modalFriendCount}>
                        {friend.checkin_count} kartu
                      </Text>
                    )}
                  </View>
                  {selectedFriends.includes(friend.id) && (
                    <Text style={styles.modalCheckmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalDoneButton} onPress={closeFriendsModal}>
                <Text style={styles.modalDoneText}>
                  Atlikta {selectedFriends.length > 0 ? `(${selectedFriends.length})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0a3848' },
  content: { padding: 16, paddingBottom: 80 },
  card: { backgroundColor: '#0f4a60', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#0f4a60' },
  q: { color: '#ffffff', fontWeight: '700', marginBottom: 10 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  slider: { flex: 1, height: 40 },
  sliderLabel: { color: '#cbd5e1', width: 24, textAlign: 'center' },
  currentVal: { color: '#ffffff', marginTop: 6 },
  input: { backgroundColor: '#0a3848', color: '#ffffff', borderWidth: 1, borderColor: '#0f4a60', borderRadius: 8, padding: 10, minHeight: 80, textAlignVertical: 'top' },
  photoRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 120, height: 120, borderRadius: 8, backgroundColor: '#123e51' },
  photoBtn: { backgroundColor: '#123e51', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  photoBtnText: { color: '#ffffff', fontWeight: '700' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#0a3848', borderTopWidth: 1, borderTopColor: '#0f4a60' },
  submitBtn: { backgroundColor: '#16a34a', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: '#ffffff', fontWeight: '800' },
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  
  // Friends button styles
  friendsButton: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#123e51', 
    borderRadius: 8, 
    padding: 16, 
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#0f4a60'
  },
  friendsButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  friendsButtonIcon: { fontSize: 20 },
  selectedFriendsList: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 12, 
    gap: 8 
  },
  selectedFriendTag: { 
    backgroundColor: '#16a34a', 
    borderRadius: 16, 
    paddingHorizontal: 12, 
    paddingVertical: 6 
  },
  selectedFriendName: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  
  // Modal styles
  fullScreenModal: { 
    flex: 1, 
    backgroundColor: '#0a3848' 
  },
  modalContent: { 
    flex: 1,
    backgroundColor: '#0a3848'
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 60, // Extra padding to avoid status bar
    borderBottomWidth: 1, 
    borderBottomColor: '#0f4a60' 
  },
  modalTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  closeButton: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#374151', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  closeButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  modalFriendsList: { 
    flex: 1, 
    padding: 20, 
    marginBottom: 80, // Reduced margin for better footer display
  },
  modalHint: { color: '#9ca3af', fontSize: 14, marginBottom: 16, textAlign: 'center' },
  modalFriendItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#123e51', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0f4a60'
  },
  modalFriendItemSelected: { 
    backgroundColor: '#16a34a', 
    borderColor: '#22c55e' 
  },
  modalFriendAvatar: {
    marginRight: 12,
  },
  modalFriendInfo: { flex: 1 },
  modalFriendName: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  modalFriendNameSelected: { color: '#ffffff', fontWeight: '700' },
  modalFriendCount: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  modalCheckmark: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  modalFooter: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 20, 
    paddingBottom: 20, // Normal bottom padding
    backgroundColor: '#0a3848', 
    borderTopWidth: 1, 
    borderTopColor: '#0f4a60',
    justifyContent: 'center', // Center the button vertically
  },
  modalDoneButton: { 
    backgroundColor: '#16a34a', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center' 
  },
  modalDoneText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default CheckinQuestionsScreen;


