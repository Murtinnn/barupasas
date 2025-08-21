import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import useAuthStore from '../store/authStore';
import { API_URL } from '../services/apiConfig';
import CenteredAvatar from '../components/CenteredAvatar';
import TopHeader from '../components/TopHeader';
import BottomTabBar from '../components/BottomTabBar';

const InvitationsScreen = ({ navigation }) => {
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState({
    barInvitations: [],
    eventInvitations: [],
    acceptedBarInvitations: [],
    acceptedEventInvitations: [],
    archivedBarInvitations: [],
    archivedEventInvitations: [],
    myActiveBarInvitations: [],
    myActiveEventInvitations: [],
    myArchivedBarInvitations: [],
    myArchivedEventInvitations: [],
  });
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  	useEffect(() => {
		loadInvitations();
	}, []);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/invitations`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInvitations(data.data);
        }
      }
    } catch (error) {
      console.log('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitation, type) => {
    try {
      const response = await fetch(`${API_URL}/invitations/${invitation.id}/accept`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        Alert.alert('Sėkmė', 'Kvietimas priimtas!');
        loadInvitations();
      } else {
        Alert.alert('Klaida', 'Nepavyko priimti kvietimo');
      }
    } catch (error) {
      Alert.alert('Klaida', 'Įvyko klaida priimant kvietimą');
    }
  };

  const handleDeclineInvitation = async (invitation, type) => {
    try {
      const response = await fetch(`${API_URL}/invitations/${invitation.id}/decline`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        Alert.alert('Sėkmė', 'Kvietimas atmestas!');
        loadInvitations();
      } else {
        Alert.alert('Klaida', 'Nepavyko atmesti kvietimo');
      }
    } catch (error) {
      Alert.alert('Klaida', 'Įvyko klaida atmetant kvietimą');
    }
  };

  const handleCancelInvitation = async (invitation, type) => {
    try {
      const response = await fetch(`${API_URL}/invitations/${invitation.id}/cancel`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        Alert.alert('Sėkmė', 'Kvietimas atšauktas!');
        loadInvitations();
      } else {
        Alert.alert('Klaida', 'Nepavyko atšaukti kvietimo');
      }
    } catch (error) {
      Alert.alert('Klaida', 'Įvyko klaida atšaukant kvietimą');
    }
  };

  const openInvitationModal = (invitation) => {
    setSelectedInvitation(invitation);
    setShowModal(true);
  };

  const renderInvitationCard = (invitation, type, status = 'pending') => {
    const isBar = type === 'bar';
    const isEvent = type === 'event';
    const isAccepted = status === 'accepted';
    const isArchived = status === 'archived';

    let cardStyle = styles.invitationCard;
    let borderColor = '#4f46e5';
    let statusText = '';
    let statusColor = '';

    if (isAccepted) {
      cardStyle = styles.acceptedInvitationCard;
      borderColor = '#10b981';
      statusText = 'Priimta';
      statusColor = '#10b981';
    } else if (isArchived) {
      cardStyle = styles.archivedInvitationCard;
      borderColor = '#6b7280';
      statusText = 'Archyvuota';
      statusColor = '#6b7280';
    }

    return (
      <View key={`${type}-${invitation.id}`} style={[cardStyle, { borderColor }]}>
        <View style={styles.invitationContent}>
          <View style={styles.invitationLeft}>
            <CenteredAvatar 
              uri={invitation.sender?.profile_photo_url} 
              name={invitation.sender?.name} 
              size={40} 
              backgroundColor={borderColor} 
              textColor="#ffffff" 
            />
            <View style={styles.invitationInfo}>
              <Text style={styles.inviterName}>{invitation.sender?.name}</Text>
              <Text style={styles.invitationTarget}>
                Kvietė į: <Text style={styles.targetName}>
                  {isBar ? invitation.bar?.name : invitation.event?.name || 'Renginys'}
                </Text>
              </Text>
              <Text style={styles.invitationTime}>
                Kada: {invitation.meeting_time || invitation.planned_date || invitation.planned_time || ''}
              </Text>
            </View>
          </View>
          
          <View style={styles.invitationRight}>
            {status === 'pending' && !isArchived && (
              <>
                <TouchableOpacity 
                  style={styles.declineButton}
                  onPress={() => handleDeclineInvitation(invitation, type)}
                >
                  <Text style={styles.declineButtonText}>Atmesti</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => openInvitationModal(invitation)}
                >
                  <Text style={styles.detailsButtonText}>Plačiau</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleAcceptInvitation(invitation, type)}
                >
                  <Text style={styles.acceptButtonText}>Priimti</Text>
                </TouchableOpacity>
              </>
            )}
            
            {status === 'accepted' && (
              <TouchableOpacity 
                style={styles.acceptedStatus}
                onPress={() => openInvitationModal(invitation)}
              >
                <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
              </TouchableOpacity>
            )}
            
            {isArchived && (
              <TouchableOpacity 
                style={styles.archivedStatus}
                onPress={() => openInvitationModal(invitation)}
              >
                <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderReceivedTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Barų kvietimai */}
      {invitations.barInvitations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kvietimai į barus</Text>
          <View style={styles.invitationsList}>
            {invitations.barInvitations.map(invitation => 
              renderInvitationCard(invitation, 'bar', 'pending')
            )}
          </View>
        </View>
      )}

      {/* Renginių kvietimai */}
      {invitations.eventInvitations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kvietimai į renginius</Text>
          <View style={styles.invitationsList}>
            {invitations.eventInvitations.map(invitation => 
              renderInvitationCard(invitation, 'event', 'pending')
            )}
          </View>
        </View>
      )}

      {/* Priimti kvietimai */}
      {(invitations.acceptedBarInvitations.length > 0 || invitations.acceptedEventInvitations.length > 0) && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Priimti kvietimai</Text>
            <TouchableOpacity 
              style={styles.rejectedButton}
              onPress={() => navigation.navigate('RejectedInvitations')}
            >
              <Text style={styles.rejectedButtonText}>Atmesti kvietimai</Text>
            </TouchableOpacity>
          </View>
          
          {invitations.acceptedBarInvitations.length > 0 && (
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Barai</Text>
              <View style={styles.invitationsList}>
                {invitations.acceptedBarInvitations.map(invitation => 
                  renderInvitationCard(invitation, 'bar', 'accepted')
                )}
              </View>
            </View>
          )}
          
          {invitations.acceptedEventInvitations.length > 0 && (
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Renginiai</Text>
              <View style={styles.invitationsList}>
                {invitations.acceptedEventInvitations.map(invitation => 
                  renderInvitationCard(invitation, 'event', 'accepted')
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Archyvuoti kvietimai */}
      {(invitations.archivedBarInvitations.length > 0 || invitations.archivedEventInvitations.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Archyvuoti kvietimai</Text>
          
          {invitations.archivedBarInvitations.length > 0 && (
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Barai</Text>
              <View style={styles.invitationsList}>
                {invitations.archivedBarInvitations.map(invitation => 
                  renderInvitationCard(invitation, 'bar', 'archived')
                )}
              </View>
            </View>
          )}
          
          {invitations.archivedEventInvitations.length > 0 && (
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Renginiai</Text>
              <View style={styles.invitationsList}>
                {invitations.archivedEventInvitations.map(invitation => 
                  renderInvitationCard(invitation, 'event', 'archived')
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {invitations.barInvitations.length === 0 && 
       invitations.eventInvitations.length === 0 && 
       invitations.acceptedBarInvitations.length === 0 && 
       invitations.acceptedEventInvitations.length === 0 && 
       invitations.archivedBarInvitations.length === 0 && 
       invitations.archivedEventInvitations.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nėra naujų kvietimų</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderSentTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Aktyvūs barų kvietimai */}
      {invitations.myActiveBarInvitations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Aktyvūs barų kvietimai</Text>
          <View style={styles.invitationsList}>
            {invitations.myActiveBarInvitations.map(invitation => 
              renderInvitationCard(invitation, 'bar', 'pending')
            )}
          </View>
        </View>
      )}

      {/* Aktyvūs renginių kvietimai */}
      {invitations.myActiveEventInvitations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Aktyvūs renginių kvietimai</Text>
          <View style={styles.invitationsList}>
            {invitations.myActiveEventInvitations.map(invitation => 
              renderInvitationCard(invitation, 'event', 'pending')
            )}
          </View>
        </View>
      )}

      {/* Archyvuoti barų kvietimai */}
      {invitations.myArchivedBarInvitations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Archyvuoti barų kvietimai</Text>
          <View style={styles.invitationsList}>
            {invitations.myArchivedBarInvitations.map(invitation => 
              renderInvitationCard(invitation, 'bar', 'archived')
            )}
          </View>
        </View>
      )}

      {/* Archyvuoti renginių kvietimai */}
      {invitations.myArchivedEventInvitations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Archyvuoti renginių kvietimai</Text>
          <View style={styles.invitationsList}>
            {invitations.myArchivedEventInvitations.map(invitation => 
              renderInvitationCard(invitation, 'event', 'archived')
            )}
          </View>
        </View>
      )}

      {invitations.myActiveBarInvitations.length === 0 && 
       invitations.myActiveEventInvitations.length === 0 && 
       invitations.myArchivedBarInvitations.length === 0 && 
       invitations.myArchivedEventInvitations.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Neturite sukurtų kvietimų</Text>
        </View>
      )}
    </ScrollView>
  );

  // Remove blocking loading screen for seamless navigation

  return (
    <View style={{ flex: 1, backgroundColor: '#0a3848' }}>
      <TopHeader title="Kvietimai" />
      <View style={{ flex: 1, paddingBottom: 80 }}>
      {loading && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator color="#ffffff" size="large" />
          <Text style={{ color: '#ffffff', marginTop: 10 }}>Kraunama...</Text>
        </View>
      )}
      {/* Tab buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'received' && styles.activeTabButton]}
          onPress={() => setActiveTab('received')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'received' && styles.activeTabButtonText]}>
            Gauti kvietimai
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'sent' && styles.activeTabButton]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'sent' && styles.activeTabButtonText]}>
            Sukurti kvietimai
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab content */}
      {activeTab === 'received' ? renderReceivedTab() : renderSentTab()}

      {/* Invitation Details Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedInvitation && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalSenderInfo}>
                    <CenteredAvatar 
                      uri={selectedInvitation.sender?.profile_photo_url} 
                      name={selectedInvitation.sender?.name} 
                      size={48} 
                      backgroundColor="#4f46e5" 
                      textColor="#ffffff" 
                    />
                    <View>
                      <Text style={styles.modalSenderName}>{selectedInvitation.sender?.name}</Text>
                      <Text style={styles.modalSenderLabel}>Kvietė</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Kur kviečia:</Text>
                    <Text style={styles.modalSectionValue}>
                      {selectedInvitation.bar?.name || selectedInvitation.event?.name || ''}
                    </Text>
                  </View>

                  {(selectedInvitation.meeting_time || selectedInvitation.planned_date) && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Kada:</Text>
                      <Text style={styles.modalSectionValue}>
                        {selectedInvitation.meeting_time || selectedInvitation.planned_date || ''}
                      </Text>
                    </View>
                  )}

                  {selectedInvitation.description && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Aprašymas:</Text>
                      <Text style={styles.modalSectionValue}>
                        {selectedInvitation.description}
                      </Text>
                    </View>
                  )}

                  {selectedInvitation.type === 'event' && selectedInvitation.bars && selectedInvitation.bars.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Renginio barai:</Text>
                      {selectedInvitation.bars.map((bar, index) => (
                        <View key={index} style={styles.barItem}>
                          <Image source={{ uri: bar.image_url }} style={styles.barImage} />
                          <View style={styles.barInfo}>
                            <Text style={styles.barName}>{bar.name}</Text>
                            <Text style={styles.barAddress}>{bar.address}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {selectedInvitation.recipients && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Pakviesti žmonės:</Text>
                      
                      {/* Pakvietėjas */}
                      {selectedInvitation.recipients.filter(p => p.status === 'inviter').map((person, index) => (
                        <View key={index} style={styles.personItem}>
                          <CenteredAvatar 
                            uri={person.profile_photo_url} 
                            name={person.name} 
                            size={32} 
                            backgroundColor="#4f46e5" 
                            textColor="#ffffff" 
                          />
                          <Text style={styles.personName}>{person.name}</Text>
                          <Text style={styles.personStatus}>Pakvietėjas</Text>
                        </View>
                      ))}

                      {/* Pakviesti (pending) */}
                      {selectedInvitation.recipients.filter(p => p.status === 'pending' && p.status !== 'inviter').length > 0 && (
                        <View style={styles.recipientsGroup}>
                          <Text style={styles.recipientsGroupTitle}>Pakviesti (laukiama atsakymo):</Text>
                          {selectedInvitation.recipients.filter(p => p.status === 'pending' && p.status !== 'inviter').map((person, index) => (
                            <View key={index} style={styles.personItem}>
                              <CenteredAvatar 
                                uri={person.profile_photo_url} 
                                name={person.name} 
                                size={32} 
                                backgroundColor="#f59e0b" 
                                textColor="#ffffff" 
                              />
                              <Text style={styles.personName}>{person.name}</Text>
                              <Text style={styles.personStatus}>Laukiama atsakymo</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Dalyvaus (accepted) */}
                      {selectedInvitation.recipients.filter(p => p.status === 'accepted' && p.status !== 'inviter').length > 0 && (
                        <View style={styles.recipientsGroup}>
                          <Text style={styles.recipientsGroupTitle}>Dalyvaus:</Text>
                          {selectedInvitation.recipients.filter(p => p.status === 'accepted' && p.status !== 'inviter').map((person, index) => (
                            <View key={index} style={styles.personItem}>
                              <CenteredAvatar 
                                uri={person.profile_photo_url} 
                                name={person.name} 
                                size={32} 
                                backgroundColor="#10b981" 
                                textColor="#ffffff" 
                              />
                              <Text style={styles.personName}>{person.name}</Text>
                              <Text style={styles.personStatus}>Priėmė</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Dalyvauti negalės (rejected/declined) */}
                      {selectedInvitation.recipients.filter(p => ['rejected', 'declined'].includes(p.status) && p.status !== 'inviter').length > 0 && (
                        <View style={styles.recipientsGroup}>
                          <Text style={styles.recipientsGroupTitle}>Dalyvauti negalės:</Text>
                          {selectedInvitation.recipients.filter(p => ['rejected', 'declined'].includes(p.status) && p.status !== 'inviter').map((person, index) => (
                            <View key={index} style={styles.personItem}>
                              <CenteredAvatar 
                                uri={person.profile_photo_url} 
                                name={person.name} 
                                size={32} 
                                backgroundColor="#ef4444" 
                                textColor="#ffffff" 
                              />
                              <Text style={styles.personName}>{person.name}</Text>
                              <Text style={styles.personStatus}>Atmetė</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Uždaryti</Text>
                  </TouchableOpacity>

                  {selectedInvitation.type === 'event' && (
                    <TouchableOpacity 
                      style={styles.modalViewButton}
                      onPress={() => {
                        setShowModal(false);
                        // TODO: Navigate to event details
                      }}
                    >
                      <Text style={styles.modalViewButtonText}>Peržiūrėti</Text>
                    </TouchableOpacity>
                  )}

                  {selectedInvitation.sender?.name !== useAuthStore.getState().user?.name && 
                   selectedInvitation.status === 'pending' && (
                    <TouchableOpacity 
                      style={styles.modalDeclineButton}
                      onPress={() => {
                        handleDeclineInvitation(selectedInvitation, selectedInvitation.type);
                        setShowModal(false);
                      }}
                    >
                      <Text style={styles.modalDeclineButtonText}>Atmesti kvietimą</Text>
                    </TouchableOpacity>
                  )}

                  {selectedInvitation.sender?.name === useAuthStore.getState().user?.name && (
                    <TouchableOpacity 
                      style={styles.modalCancelButton}
                      onPress={() => {
                        handleCancelInvitation(selectedInvitation, selectedInvitation.type);
                        setShowModal(false);
                      }}
                    >
                      <Text style={styles.modalCancelButtonText}>Atšaukti kvietimą</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      </View>
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a3848',
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#4f46e5',
  },
  tabButtonText: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 12,
    paddingLeft: 8,
  },
  subsection: {
    marginBottom: 24,
  },
  subsectionTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 8,
  },
  invitationsList: {
    gap: 16,
  },
  invitationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  acceptedInvitationCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  archivedInvitationCard: {
    backgroundColor: '#004259',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#6b7280',
  },
  invitationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invitationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  invitationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  inviterName: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  invitationTarget: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 2,
  },
  targetName: {
    fontWeight: '600',
  },
  invitationTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  invitationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  declineButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  declineButtonText: {
    color: '#f87171',
    fontWeight: '600',
    fontSize: 12,
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailsButtonText: {
    color: '#818cf8',
    fontWeight: '600',
    fontSize: 12,
  },
  acceptButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  acceptButtonText: {
    color: '#34d399',
    fontWeight: '600',
    fontSize: 14,
  },
  acceptedStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  archivedStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  rejectedButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rejectedButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
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
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    paddingBottom: 16,
  },
  modalSenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalSenderName: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 18,
  },
  modalSenderLabel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSectionValue: {
    color: '#818cf8',
    fontSize: 16,
  },
  barItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  barImage: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#818cf8',
  },
  barInfo: {
    flex: 1,
  },
  barName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  barAddress: {
    color: '#9ca3af',
    fontSize: 12,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  personName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
  personStatus: {
    color: '#818cf8',
    fontSize: 12,
    marginLeft: 'auto',
  },
  recipientsGroup: {
    marginTop: 16,
  },
  recipientsGroupTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  modalCloseButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalViewButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalViewButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalDeclineButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalDeclineButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default InvitationsScreen;
