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
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';

import useAuthStore from '../../store/authStore';
import { API_URL } from '../../services/apiConfig';
import CenteredAvatar from '../../components/CenteredAvatar';
import TopHeader from '../../components/TopHeader';
import BottomTabBar from '../../components/BottomTabBar';

const BarInviteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { barId, barName } = route.params;
  const { token } = useAuthStore();
  
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Mėnesio keitimo funkcijos
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Generuoja kalendoriaus dienas
  const generateCalendarDays = () => {
    // Pirmoji mėnesio diena
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Paskutinė mėnesio diena
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Savaitės dienos (0 = sekmadienis, 1 = pirmadienis)
    const firstDayOfWeek = firstDay.getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Lietuvoje savaitė prasideda pirmadienį
    
    const days = [];
    
    // Pridedame ankstesnio mėnesio dienas
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth, -i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({
        dayNumber: date.getDate(),
        date: date,
        isCurrentMonth: false,
        isSelected: meetingDate === dateString
      });
    }
    
    // Pridedame dabartinio mėnesio dienas
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({
        dayNumber: day,
        date: date,
        isCurrentMonth: true,
        isSelected: meetingDate === dateString
      });
    }
    
    // Pridedame kito mėnesio dienas, kad užpildytume 6 eilutes
    const remainingDays = 42 - days.length; // 6 eilutės * 7 dienos = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({
        dayNumber: day,
        date: date,
        isCurrentMonth: false,
        isSelected: meetingDate === dateString
      });
    }
    
    return days;
  };

  useEffect(() => {
    if (token) {
      fetchFriends();
    }
    
    // Nustatome tik dabartinį laiką
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    setMeetingTime(`${hours}:${minutes}`);
  }, []);

  // Automatiškai keičia kalendoriaus mėnesį, kai pasirenkama data
  useEffect(() => {
    if (meetingDate) {
      const selectedDate = new Date(meetingDate);
      const selectedMonth = selectedDate.getMonth();
      const selectedYear = selectedDate.getFullYear();
      
      // Jei pasirinkta data yra iš kito mėnesio, keičiame kalendoriaus mėnesį
      if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
        setCurrentMonth(selectedMonth);
        setCurrentYear(selectedYear);
      }
    }
  }, [meetingDate]);

  // Automatiškai atnaujina meetingTime, kai keičiasi valandos ar minutės
  useEffect(() => {
    const hourStr = String(selectedHour).padStart(2, '0');
    const minuteStr = String(selectedMinute).padStart(2, '0');
    setMeetingTime(`${hourStr}:${minuteStr}`);
  }, [selectedHour, selectedMinute]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${API_URL}/friends/frequent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setFriends(data.data);
      } else {
        Alert.alert('Klaida', 'Nepavyko gauti draugų sąrašo');
      }
    } catch (error) {
      Alert.alert('Klaida', 'Nepavyko prisijungti prie serverio');
    } finally {
      setLoading(false);
    }
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => {
      const newSelection = prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId];
      return newSelection;
    });
  };





  const submitInvitation = async () => {
    if (selectedFriends.length === 0) {
      Alert.alert('Klaida', 'Pasirinkite bent vieną draugą');
      return;
    }

    if (!meetingDate) {
      Alert.alert('Klaida', 'Pasirinkite susitikimo datą');
      return;
    }

    if (!meetingTime) {
      Alert.alert('Klaida', 'Nurodykite susitikimo laiką');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/bar-invitations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bar_id: barId,
          friend_ids: selectedFriends,
          meeting_time: `${meetingDate}T${meetingTime}:00`,
          title: title || null,
          description: description || null,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        Alert.alert(
          'Sėkmė!',
          'Kvietimai sėkmingai išsiųsti!',
          [
            {
              text: 'Gerai',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Klaida', data.message || 'Nepavyko išsiųsti kvietimų');
      }
    } catch (error) {
      Alert.alert('Klaida', 'Nepavyko prisijungti prie serverio');
    } finally {
      setSubmitting(false);
    }
  };



  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0b3d2c" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0a3848' }}>
      <TopHeader title={`Kvietimas į ${barName}`} />
      <View style={{ flex: 1, paddingBottom: 80 }}>
                <ScrollView style={styles.container}>
        {loading && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator color="#ffffff" size="large" />
            <Text style={{ color: '#ffffff', marginTop: 10 }}>Kraunama...</Text>
          </View>
        )}
        <View style={styles.header}>
        <Text style={styles.headerTitle}>Pakviesti draugus į barą</Text>
        <Text style={styles.barName}>{barName}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pavadinimas (neprivaloma)</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Įveskite kvietimo pavadinimą"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Susitikimo data *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCalendar(!showCalendar)}
          >
            <Text style={[
              styles.dateButtonText,
              !meetingDate && styles.dateButtonPlaceholder
            ]}>
              {meetingDate || 'Pasirinkite datą'}
            </Text>
          </TouchableOpacity>
          
          {showCalendar && (
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Pasirinkite datą</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Text style={styles.calendarClose}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.calendarGrid}>
                {/* Mėnesio pavadinimas su rodyklėmis */}
                <View style={styles.monthHeader}>
                  <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthArrow}>
                    <Text style={styles.monthArrowText}>‹</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.monthTitle}>
                    {new Date(currentYear, currentMonth).toLocaleDateString('lt-LT', { month: 'long', year: 'numeric' })}
                  </Text>
                  
                  <TouchableOpacity onPress={goToNextMonth} style={styles.monthArrow}>
                    <Text style={styles.monthArrowText}>›</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Savaitės dienų antraštės */}
                <View style={styles.weekDaysHeader}>
                  {['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'].map((day) => (
                    <Text key={day} style={styles.weekDayHeader}>{day}</Text>
                  ))}
                </View>
                
                {/* Kalendoriaus dienos */}
                <View style={styles.calendarDays}>
                  {generateCalendarDays().map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.calendarDay,
                        day.isCurrentMonth && styles.currentMonthDay,
                        day.isSelected && styles.selectedDay
                      ]}
                      onPress={() => {
                        if (day.isCurrentMonth && day.date) {
                          const year = day.date.getFullYear();
                          const month = String(day.date.getMonth() + 1).padStart(2, '0');
                          const dayNum = String(day.date.getDate()).padStart(2, '0');
                          setMeetingDate(`${year}-${month}-${dayNum}`);
                          setShowCalendar(false);
                        }
                      }}
                      disabled={!day.isCurrentMonth || !day.date}
                    >
                      <Text style={[
                        styles.calendarDayText,
                        !day.isCurrentMonth && styles.otherMonthDay,
                        day.isToday && styles.todayDayText,
                        day.isSelected && styles.selectedDayText
                      ]}>
                        {day.dayNumber}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Susitikimo laikas *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={[
              styles.dateButtonText,
              !meetingTime && styles.dateButtonPlaceholder
            ]}>
              {meetingTime || 'Pasirinkite laiką'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aprašymas (neprivaloma)</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Aprašykite susitikimą"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pasirinkite draugus *</Text>
          {friends.length === 0 ? (
            <View style={styles.noFriends}>
              <Text style={styles.noFriendsText}>
                Šiuo metu neturite draugų, kuriuos galėtumėte pakviesti.
              </Text>
            </View>
          ) : (
            <View style={styles.friendsList}>
              {friends.map((friend) => {
                return (
                <TouchableOpacity
                  key={friend.id}
                  style={[
                    styles.friendItem,
                    selectedFriends.includes(friend.id) && styles.friendItemSelected,
                  ]}
                  onPress={() => toggleFriendSelection(friend.id)}
                >
                  <CenteredAvatar
                    uri={friend.profile_photo_url || friend.avatar}
                    name={friend.name}
                    size={50}
                    backgroundColor="#4f46e5"
                    textColor="#ffffff"
                  />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendCheckins}>
                      {friend.checkin_count} kartų kartu
                    </Text>
                  </View>
                  <View style={styles.checkbox}>
                    {selectedFriends.includes(friend.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
              })}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (selectedFriends.length === 0 || !meetingDate || !meetingTime || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={submitInvitation}
          disabled={selectedFriends.length === 0 || !meetingDate || !meetingTime || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Išsiųsti kvietimus</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Laiko pasirinkimo modal'is */}
      <Modal
        isVisible={showTimePicker}
        onBackdropPress={() => setShowTimePicker(false)}
        onBackButtonPress={() => setShowTimePicker(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pasirinkite laiką</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timePickerContainer}>
            <Text style={styles.timeDisplay}>{meetingTime}</Text>
            
            <View style={styles.pickerRow}>
              {/* Valandos */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Valandos</Text>
                <Picker
                  selectedValue={selectedHour}
                  onValueChange={setSelectedHour}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                    <Picker.Item 
                      key={hour} 
                      label={String(hour).padStart(2, '0')} 
                      value={hour} 
                    />
                  ))}
                </Picker>
              </View>
              
              {/* Minutės */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minutės</Text>
                <Picker
                  selectedValue={selectedMinute}
                  onValueChange={setSelectedMinute}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                    <Picker.Item 
                      key={minute} 
                      label={String(minute).padStart(2, '0')} 
                      value={minute} 
                    />
                  ))}
                </Picker>
              </View>
              

            </View>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.confirmButtonText}>Patvirtinti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        </ScrollView>
      </View>
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a3848',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e4a5f',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  barName: {
    fontSize: 16,
    color: '#9ca3af',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f4a60',
    borderWidth: 1,
    borderColor: '#1e4a5f',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  timeButton: {
    backgroundColor: '#0f4a60',
    borderWidth: 1,
    borderColor: '#1e4a5f',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  dateTimeInput: {
    backgroundColor: '#0f4a60',
    borderWidth: 1,
    borderColor: '#1e4a5f',
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  dateTimeText: {
    color: '#ffffff',
    fontSize: 16,
  },
  dateTimePlaceholder: {
    color: '#9ca3af',
  },
  input: {
    backgroundColor: '#0f4a60',
    borderWidth: 1,
    borderColor: '#1e4a5f',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#0f4a60',
    borderWidth: 1,
    borderColor: '#1e4a5f',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  dateButtonPlaceholder: {
    color: '#9ca3af',
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 10,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  calendarClose: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  calendarGrid: {
    gap: 8,
  },
  calendarDayButton: {
    backgroundColor: '#1e4a5f',
    borderWidth: 1,
    borderColor: '#2e5a6f',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  calendarDayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  calendarDayDate: {
    color: '#9ca3af',
    fontSize: 12,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthArrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  monthArrowText: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 0,
    textTransform: 'capitalize',
    flex: 1,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayHeader: {
    flex: 1,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%', // 100% / 7 dienos
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  currentMonthDay: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
  selectedDay: {
    backgroundColor: '#0b3d2c',
    borderColor: '#0b3d2c',
  },
  calendarDayText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  otherMonthDay: {
    color: '#9ca3af',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  timePickerContainer: {
    backgroundColor: '#004259',
    borderRadius: 8,
    padding: 16,
  },
  timeDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 5,
  },
  picker: {
    width: '100%',
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  pickerItem: {
    color: '#000000',
    fontSize: 16,
    
  },
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#004259',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalClose: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sliderMin: {
    color: '#9ca3af',
    fontSize: 12,
    width: 20,
  },
  sliderMax: {
    color: '#9ca3af',
    fontSize: 12,
    width: 20,
    textAlign: 'right',
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginHorizontal: 10,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#0b3d2c',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#0b3d2c',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  timeButton: {
    backgroundColor: '#0b3d2c',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  timeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },


  confirmButton: {
    backgroundColor: '#0a3848',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },


  textArea: {
    backgroundColor: '#0f4a60',
    borderWidth: 1,
    borderColor: '#1e4a5f',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  noFriends: {
    backgroundColor: '#0f4a60',
    borderWidth: 1,
    borderColor: '#1e4a5f',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  noFriendsText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 14,
  },
  friendsList: {
    gap: 12,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f4a60',
    borderWidth: 1,
    borderColor: '#1e4a5f',
    borderRadius: 8,
    padding: 12,
  },
  friendItemSelected: {
    borderColor: '#0b3d2c',
    backgroundColor: '#0f4a60',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  friendCheckins: {
    fontSize: 14,
    color: '#9ca3af',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0b3d2c',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#0b3d2c',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default BarInviteScreen;
