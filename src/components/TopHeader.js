import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../store/authStore';

const TopHeader = ({ title }) => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    { label: 'Feedas', route: 'Feed', icon: '📰' },
    { label: 'Lyderių Lentelė', route: 'Leaderboard', icon: '🏆' },
    { label: 'Valdymo skydelis', route: 'Home', icon: '📊' }, // TODO: Create Dashboard
    { label: 'Barai', route: 'BarsList', icon: '🍺' },
    { label: 'Barų Žemėlapis', route: 'BarsMap', icon: '🗺️' },
    { label: 'Mano Pasas', route: 'Passport', icon: '👤' },
    { label: 'Mano Skinai', route: 'Home', icon: '🎨' }, // TODO: Create Skins
    { label: 'Pasiūlymų dėžutė', route: 'Home', icon: '💡' }, // TODO: Create Suggestions
  ];

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    navigation.navigate('Auth');
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('BarsList')}>
          <Text style={styles.logo}>Barupasas</Text>
        </TouchableOpacity>
        
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuModal}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Meniu</Text>
              <TouchableOpacity 
                onPress={() => setMenuVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuContent}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate(item.route);
                  }}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              
              <View style={styles.separator} />
              
              <View style={styles.userSection}>
                <Text style={styles.userName}>{user?.name || 'Vartotojas'}</Text>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('ProfileEdit');
                  }}
                >
                  <Text style={styles.menuItemIcon}>⚙️</Text>
                  <Text style={styles.menuItemText}>Profilis</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogout}
                >
                  <Text style={styles.menuItemIcon}>🚪</Text>
                  <Text style={styles.menuItemText}>Atsijungti</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: '#0a3848', // Match main screen background
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 44, // Space for status bar
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuModal: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  menuContent: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  menuItemText: {
    fontSize: 16,
    color: '#e5e7eb',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 16,
  },
  userSection: {
    paddingTop: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
});

export default TopHeader;
