import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import useAuthStore from '../store/authStore';
import { API_URL } from '../services/apiConfig';
import CenteredAvatar from '../components/CenteredAvatar';

const ProfileEditScreen = ({ navigation }) => {
  const { token, user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    description: user?.description || '',
    facebook_url: user?.facebook_url || '',
    instagram_url: user?.instagram_url || '',
    privacy_status: user?.privacy_status || 'public',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Try to get full profile data first
        const res = await fetch(`${API_URL}/passport/full`, { 
          headers: { 
            Accept: 'application/json', 
            Authorization: `Bearer ${token}` 
          } 
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data.data?.profile) {
            const profileData = data.data.profile;
            setProfile({
              name: profileData.name || user?.name || '',
              email: profileData.email || user?.email || '',
              description: profileData.description || user?.description || '',
              facebook_url: profileData.facebook_url || user?.facebook_url || '',
              instagram_url: profileData.instagram_url || user?.instagram_url || '',
              privacy_status: profileData.privacy_status || user?.privacy_status || 'public',
            });
            setImageUri(profileData.avatar || profileData.profile_photo_url || user?.profile_photo_url);
            return;
          }
        }
        
        // Fallback to user data from auth store
        if (user) {
          setProfile({
            name: user.name || '',
            email: user.email || '',
            description: user.description || '',
            facebook_url: user.facebook_url || '',
            instagram_url: user.instagram_url || '',
            privacy_status: user.privacy_status || 'public',
          });
          setImageUri(user.profile_photo_url);
        }
      } catch (error) {
        console.log('Error loading profile data:', error);
        // Fallback to user data from auth store
        if (user) {
          setProfile({
            name: user.name || '',
            email: user.email || '',
            description: user.description || '',
            facebook_url: user.facebook_url || '',
            instagram_url: user.instagram_url || '',
            privacy_status: user.privacy_status || 'public',
          });
          setImageUri(user.profile_photo_url);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfileData();
  }, [user, token]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('description', profile.description);
      formData.append('facebook_url', profile.facebook_url);
      formData.append('instagram_url', profile.instagram_url);
      formData.append('privacy_status', profile.privacy_status);
      formData.append('_method', 'PATCH');

      if (imageUri && imageUri !== user.profile_photo_url) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('profile_photo', blob, 'profile.jpg');
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          updateUser(data.data.user);
          Alert.alert('Sėkmė', 'Profilis atnaujintas sėkmingai!');
        }
      } else {
        Alert.alert('Klaida', 'Nepavyko atnaujinti profilio');
      }
    } catch (error) {
      Alert.alert('Klaida', 'Įvyko klaida atnaujinant profilį');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwordData.password !== passwordData.password_confirmation) {
      Alert.alert('Klaida', 'Slaptažodžiai nesutampa');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/password`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          password: passwordData.password,
          password_confirmation: passwordData.password_confirmation,
        }),
      });

      if (response.ok) {
        Alert.alert('Sėkmė', 'Slaptažodis atnaujintas sėkmingai!');
        setPasswordData({
          current_password: '',
          password: '',
          password_confirmation: '',
        });
      } else {
        Alert.alert('Klaida', 'Nepavyko atnaujinti slaptažodžio');
      }
    } catch (error) {
      Alert.alert('Klaida', 'Įvyko klaida atnaujinant slaptažodį');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert('Klaida', 'Įveskite slaptažodį');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      if (response.ok) {
        Alert.alert('Paskyra ištrinta', 'Jūsų paskyra buvo sėkmingai ištrinta');
        // Logout user after account deletion
        // This would need to be implemented in the auth store
      } else {
        Alert.alert('Klaida', 'Nepavyko ištrinti paskyros');
      }
    } catch (error) {
      Alert.alert('Klaida', 'Įvyko klaida trinant paskyrą');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#4f46e5" size="large" />
        <Text style={styles.loadingText}>Kraunama...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Profile Photo Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Profilio nuotrauka</Text>
        <View style={styles.photoSection}>
          <CenteredAvatar 
            uri={imageUri} 
            name={profile.name} 
            size={100} 
            backgroundColor="#4f46e5" 
            textColor="#ffffff" 
          />
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>Keisti nuotrauką</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Information Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Profilio informacija</Text>
        <Text style={styles.sectionDescription}>
          Atnaujinkite savo paskyros profilio informaciją ir el. pašto adresą.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Vartotojo vardas</Text>
          <TextInput
            style={styles.textInput}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Jūsų vardas"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>El. paštas</Text>
          <TextInput
            style={styles.textInput}
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
            placeholder="jūsų@email.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Apie mane</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={profile.description}
            onChangeText={(text) => setProfile({ ...profile, description: text })}
            placeholder="Parašykite trumpą apie save aprašymą..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.inputHelp}>
            Parašykite trumpą apie save aprašymą, kuris bus matomas jūsų draugams.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Facebook URL</Text>
          <TextInput
            style={styles.textInput}
            value={profile.facebook_url}
            onChangeText={(text) => setProfile({ ...profile, facebook_url: text })}
            placeholder="https://facebook.com/yourusername"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />
          <Text style={styles.inputHelp}>Facebook URL (neprivaloma)</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Instagram URL</Text>
          <TextInput
            style={styles.textInput}
            value={profile.instagram_url}
            onChangeText={(text) => setProfile({ ...profile, instagram_url: text })}
            placeholder="https://instagram.com/yourusername"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />
          <Text style={styles.inputHelp}>Instagram URL (neprivaloma)</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Privatumo lygis</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                profile.privacy_status === 'public' && styles.pickerOptionSelected
              ]}
              onPress={() => setProfile({ ...profile, privacy_status: 'public' })}
            >
              <Text style={[
                styles.pickerOptionText,
                profile.privacy_status === 'public' && styles.pickerOptionTextSelected
              ]}>Viešas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                profile.privacy_status === 'private' && styles.pickerOptionSelected
              ]}
              onPress={() => setProfile({ ...profile, privacy_status: 'private' })}
            >
              <Text style={[
                styles.pickerOptionText,
                profile.privacy_status === 'private' && styles.pickerOptionTextSelected
              ]}>Privatus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                profile.privacy_status === 'very_private' && styles.pickerOptionSelected
              ]}
              onPress={() => setProfile({ ...profile, privacy_status: 'very_private' })}
            >
              <Text style={[
                styles.pickerOptionText,
                profile.privacy_status === 'very_private' && styles.pickerOptionTextSelected
              ]}>Labai privatus</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHelp}>
            Viešas – viskas matoma visiems.{'\n'}
            Privatus – profilį mato tik draugai, bet checkin/apsilankymai matomi visiems.{'\n'}
            Labai privatus – profilį mato tik draugai, bet be apsilankymų ir ženkliukų.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={updateProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Išsaugoti profilį</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Password Update Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Atnaujinti slaptažodį</Text>
        <Text style={styles.sectionDescription}>
          Įsitikinkite, kad jūsų paskyra naudoja ilgą, atsitiktinį slaptažodį, kad būtų saugiai.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Dabartinis slaptažodis</Text>
          <TextInput
            style={styles.textInput}
            value={passwordData.current_password}
            onChangeText={(text) => setPasswordData({ ...passwordData, current_password: text })}
            placeholder="Dabartinis slaptažodis"
            placeholderTextColor="#9ca3af"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Naujas slaptažodis</Text>
          <TextInput
            style={styles.textInput}
            value={passwordData.password}
            onChangeText={(text) => setPasswordData({ ...passwordData, password: text })}
            placeholder="Naujas slaptažodis"
            placeholderTextColor="#9ca3af"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Patvirtinti slaptažodį</Text>
          <TextInput
            style={styles.textInput}
            value={passwordData.password_confirmation}
            onChangeText={(text) => setPasswordData({ ...passwordData, password_confirmation: text })}
            placeholder="Patvirtinti slaptažodį"
            placeholderTextColor="#9ca3af"
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={updatePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Atnaujinti slaptažodį</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Delete Account Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ištrinti paskyrą</Text>
        <Text style={styles.sectionDescription}>
          Kai paskyra bus ištrinta, visi jos ištekliai ir duomenys bus ištrinti. 
          Prieš ištrinant paskyrą, atsargiai įkelti bet kokius duomenis ar informaciją, 
          kuriuos norite išsaugoti.
        </Text>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={styles.deleteButtonText}>Ištrinti paskyrą</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ar tikrai norite ištrinti savo paskyrą?</Text>
            <Text style={styles.modalDescription}>
              Kai paskyra bus ištrinta, visi jos ištekliai ir duomenys bus ištrinti. 
              Įveskite savo slaptažodį, kad patvirtintumėte, kad norite ištrinti paskyrą.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Slaptažodis</Text>
              <TextInput
                style={styles.textInput}
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder="Jūsų slaptažodis"
                placeholderTextColor="#9ca3af"
                secureTextEntry
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Atšaukti</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmDeleteButton} 
                onPress={deleteAccount}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>Ištrinti paskyrą</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0a3848',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a3848',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
  },
  sectionCard: {
    backgroundColor: '#004259',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  photoButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#0a3848',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputHelp: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pickerOption: {
    flex: 1,
    backgroundColor: '#0a3848',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  pickerOptionText: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#004259',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmDeleteButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileEditScreen;
