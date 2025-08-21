import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../services/apiConfig';
import { useAuthStore } from '../store/authStore';

const RejectedInvitationsScreen = () => {
  const navigation = useNavigation();
  const { storedToken } = useAuthStore();
  const [rejectedBarInvitations, setRejectedBarInvitations] = useState([]);
  const [rejectedEventInvitations, setRejectedEventInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRejectedInvitations = async () => {
    try {
      const response = await fetch(`${API_URL}/invitations/rejected`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRejectedBarInvitations(data.data.rejectedBarInvitations || []);
          setRejectedEventInvitations(data.data.rejectedEventInvitations || []);
        }
      } else {
        console.error('Failed to fetch rejected invitations:', response.status);
      }
    } catch (error) {
      console.error('Error fetching rejected invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedInvitations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRejectedInvitations();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderBarInvitation = (invitation) => (
    <View key={invitation.id} style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        <Image
          source={{ uri: invitation.sender.profile_photo_url }}
          style={styles.profileImage}
        />
        <View style={styles.invitationInfo}>
          <Text style={styles.senderName}>{invitation.sender.name}</Text>
          <Text style={styles.invitationText}>
            Kvietė į: <Text style={styles.barName}>{invitation.bar.name}</Text>
          </Text>
          <Text style={styles.dateText}>
            Kada: {formatDate(invitation.meeting_time)}
          </Text>
        </View>
      </View>
      <View style={styles.invitationActions}>
        <Text style={styles.viewMoreText}>Plačiau</Text>
      </View>
    </View>
  );

  const renderEventInvitation = (invitation) => (
    <View key={invitation.id} style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        <Image
          source={{ uri: invitation.sender.profile_photo_url }}
          style={styles.profileImage}
        />
        <View style={styles.invitationInfo}>
          <Text style={styles.senderName}>{invitation.sender.name}</Text>
          <Text style={styles.invitationText}>
            Kvietė į: <Text style={styles.eventName}>{invitation.event.name}</Text>
          </Text>
          <Text style={styles.dateText}>
            Kada: {formatDate(invitation.planned_date)}
          </Text>
        </View>
      </View>
      <View style={styles.invitationActions}>
        <Text style={styles.viewMoreText}>Plačiau</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Kraunama...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atmesti kvietimai</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {rejectedBarInvitations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Barų kvietimai</Text>
            <View style={styles.invitationsList}>
              {rejectedBarInvitations.map(renderBarInvitation)}
            </View>
          </View>
        )}

        {rejectedEventInvitations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Renginių kvietimai</Text>
            <View style={styles.invitationsList}>
              {rejectedEventInvitations.map(renderEventInvitation)}
            </View>
          </View>
        )}

        {rejectedBarInvitations.length === 0 && rejectedEventInvitations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nėra atmestų kvietimų</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a3848',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a3848',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    paddingLeft: 8,
  },
  invitationsList: {
    gap: 16,
  },
  invitationCard: {
    backgroundColor: '#004259',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  invitationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
    marginRight: 12,
  },
  invitationInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  invitationText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  barName: {
    fontWeight: '500',
  },
  eventName: {
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  invitationActions: {
    alignItems: 'flex-end',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default RejectedInvitationsScreen;
