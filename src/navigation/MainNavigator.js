import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../store/authStore';
// TopHeader and BottomTabBar will be added directly to screens when needed
import BarsListScreen from '../screens/bars/BarsListScreen';
import BarDetailsScreen from '../screens/bars/BarDetailsScreen';
import BarInviteScreen from '../screens/bars/BarInviteScreen';
import CheckinQuestionsScreen from '../screens/bars/CheckinQuestionsScreen';
import BarsMapScreen from '../screens/bars/BarsMapScreen';
import PassportScreen from '../screens/PassportScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import InvitationsScreen from '../screens/InvitationsScreen';
import FeedScreen from '../screens/FeedScreen';
import FriendPassportScreen from '../screens/FriendPassportScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';


const Stack = createNativeStackNavigator();

// Removed ScreenWrapper to fix navigation performance issues

const HomeScreen = ({ navigation }) => {
	const { user, logout } = useAuthStore();
	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<View style={styles.header}>
				<Text style={styles.title}>🍺 Barupasas</Text>
				<Text style={styles.welcome}>Sveiki, {user?.name}!</Text>
			</View>
			<View style={styles.content}>
				<TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('BarsList')}>
					<Text style={styles.primaryBtnText}>Peržiūrėti barus</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.primaryBtn, { marginTop: 12 }]} onPress={() => navigation.navigate('BarsMap')}>
					<Text style={styles.primaryBtnText}>Barų žemėlapis</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.primaryBtn, { marginTop: 12 }]} onPress={() => navigation.navigate('Passport')}>
					<Text style={styles.primaryBtnText}>Mano pasas</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.primaryBtn, { marginTop: 12 }]} onPress={() => navigation.navigate('Feed')}>
					<Text style={styles.primaryBtnText}>Feed</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity style={styles.logoutButton} onPress={logout}>
				<Text style={styles.logoutButtonText}>Atsijungti</Text>
			</TouchableOpacity>
		</View>
	);
};



const MainNavigator = () => {
	return (
		<Stack.Navigator 
			screenOptions={{ 
				headerShown: false,
				animation: 'none',
			}}
			initialRouteName="BarsList"
		>
			<Stack.Screen 
				name="BarsList" 
				component={BarsListScreen}
				options={{ title: 'Barai' }}
			/>
			<Stack.Screen 
				name="Home" 
				component={HomeScreen}
				options={{ title: 'Pagrindinis' }}
			/>
			<Stack.Screen 
				name="BarDetails" 
				component={BarDetailsScreen}
				options={{ title: 'Baro informacija' }}
			/>
			<Stack.Screen 
				name="BarInvite" 
				component={BarInviteScreen}
				options={{ title: 'Pakviesti draugus' }}
			/>
			<Stack.Screen 
				name="CheckinQuestions" 
				component={CheckinQuestionsScreen}
				options={{ title: 'Check‑in klausimai' }}
			/>
			<Stack.Screen 
				name="BarsMap" 
				component={BarsMapScreen}
				options={{ title: 'Barų žemėlapis' }}
			/>
			<Stack.Screen 
				name="Passport" 
				component={PassportScreen}
				options={{ title: 'Mano pasas' }}
			/>
			<Stack.Screen 
				name="ProfileEdit" 
				component={ProfileEditScreen}
				options={{ title: 'Redaguoti profilį' }}
			/>
			<Stack.Screen 
				name="Invitations" 
				component={InvitationsScreen}
				options={{ title: 'Kvietimai' }}
			/>
			<Stack.Screen 
				name="Feed" 
				component={FeedScreen}
				options={{ title: 'Feed' }}
			/>
			<Stack.Screen 
				name="FriendPassport" 
				component={FriendPassportScreen}
				options={{ title: 'Vartotojo pasas' }}
			/>
			<Stack.Screen 
				name="Leaderboard" 
				component={LeaderboardScreen}
				options={{ title: 'Lyderių lentelė' }}
			/>
		</Stack.Navigator>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#0b3d2c', paddingTop: 50, paddingHorizontal: 20 },
	header: { alignItems: 'center', marginBottom: 40 },
	title: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginBottom: 10 },
	welcome: { fontSize: 18, color: '#ffffff', opacity: 0.9 },
	content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	primaryBtn: { backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10 },
	primaryBtnText: { color: '#0b3d2c', fontWeight: '700', fontSize: 16 },
	logoutButton: { backgroundColor: '#ff4444', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 30 },
	logoutButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
	// Removed screen wrapper styles
});

export default MainNavigator;
