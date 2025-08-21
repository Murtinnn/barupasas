import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

// SVG Icon Components
const CalendarIcon = ({ color = "#9ca3af", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </Svg>
);

const MailIcon = ({ color = "#9ca3af", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </Svg>
);

const SearchIcon = ({ color = "#9ca3af", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
  </Svg>
);

const FeedIcon = ({ color = "#9ca3af", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </Svg>
);

const UserIcon = ({ color = "#9ca3af", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </Svg>
);

const TrophyIcon = ({ color = "#9ca3af", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
          d="M6 9H4.5a2.5 2.5 0 000 5H6m0-5v5m0-5h12m-12 5h12m0-5v5m0-5h1.5a2.5 2.5 0 010 5H18m-6 5v-5m0 5h-2m2 0h2m-6-5h8v-2a4 4 0 00-4-4h0a4 4 0 00-4 4v2z" />
  </Svg>
);

const BottomTabBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    {
      name: 'Kvietimai',
      route: 'Invitations',
      IconComponent: MailIcon,
    },
    {
      name: 'Paieška',
      route: 'BarsList',
      IconComponent: SearchIcon,
    },
    {
      name: 'Feedas',
      route: 'Feed',
      IconComponent: FeedIcon,
    },
    {
      name: 'Mano pasas',
      route: 'Passport',
      IconComponent: UserIcon,
    },
  ];

  const isActive = (tabRoute) => {
    return route.name === tabRoute;
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const { IconComponent } = tab;
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => {
              navigation.navigate(tab.route);
            }}
          >
            <View style={styles.iconContainer}>
              <IconComponent 
                color={active ? "#7599a6" : "#9ca3af"} 
                size={24}
              />
            </View>
            <Text style={[styles.label, active && styles.activeLabel]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 80,
    backgroundColor: '#004259',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#7599a6',
    fontWeight: '600',
  },
});

export default BottomTabBar;
