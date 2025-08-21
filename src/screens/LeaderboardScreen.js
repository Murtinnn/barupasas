import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ActivityIndicator,
	Alert,
	RefreshControl,
	TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../store/authStore';
import { API_URL, WEB_URL } from '../services/apiConfig';
import TopHeader from '../components/TopHeader';
import BottomTabBar from '../components/BottomTabBar';
import CenteredAvatar from '../components/CenteredAvatar';

const LeaderboardScreen = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const { token } = useAuthStore();
	const navigation = useNavigation();

	const fetchLeaderboard = async (isRefresh = false) => {
		if (isRefresh) setRefreshing(true);
		else setLoading(true);

		try {
			const res = await fetch(`${API_URL}/leaderboard`, {
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}

			const data = await res.json();
			if (data.success) {
				setUsers(data.data || []);
			} else {
				throw new Error('API returned success: false');
			}
		} catch (error) {
			console.error('Leaderboard fetch error:', error);
			Alert.alert('Klaida', 'Nepavyko įkelti lyderių lentelės');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchLeaderboard();
	}, []);

	const onRefresh = () => {
		fetchLeaderboard(true);
	};

	const renderPodium = () => {
		const podium = users.slice(0, 3);
		if (podium.length === 0) return null;

		// Svetainės tvarka: 2nd, 1st, 3rd
		const podiumOrder = [1, 0, 2];
		const borderColors = ['#ffd700', '#c0c0c0', '#cd7f32']; // auksas, sidabras, bronza
		const sizes = [94, 64, 64]; // 1st place didesnis0

		return (
			<View style={styles.podiumContainer}>
				<Text style={styles.podiumTitle}>Daugiausiai barų aplankę vartotojai</Text>
				<View style={styles.podiumRow}>
					{podiumOrder.map((realIdx, displayIdx) => {
						if (!podium[realIdx]) return null;
						const user = podium[realIdx];
						const isFirst = realIdx === 0;
						const size = sizes[realIdx];
						const borderColor = borderColors[realIdx];

						return (
							<TouchableOpacity 
								key={user.id} 
								style={[styles.podiumItem, { marginBottom: isFirst ? 24 : realIdx === 1 ? 16 : 8 }]}
								onPress={() => navigation.navigate('FriendPassport', { userId: user.id })}
								activeOpacity={0.7}
							>
								<View style={styles.podiumUser}>
									<CenteredAvatar 
										uri={user.avatar}
										name={user.name}
										size={size}
										borderWidth={4}
										borderColor={borderColor}
										backgroundColor="#4f46e5"
										textColor="#ffffff"
									/>
									<Text style={[styles.positionText, { color: borderColor }]}>
										{realIdx + 1} Vieta
									</Text>
									<Text style={[styles.userName, isFirst && styles.firstPlaceText]} numberOfLines={1}>
										{user.name}
									</Text>
									<Text style={styles.checkinCount}>{user.checkins_count} barai</Text>
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		);
	};

	const renderUser = ({ item, index }) => {
		if (index < 3) return null; // Skip podium users in the list

		return (
			<TouchableOpacity 
				style={styles.userRow}
				onPress={() => navigation.navigate('FriendPassport', { userId: item.id })}
				activeOpacity={0.7}
			>
				<Text style={styles.position}>{index + 1}</Text>
				<View style={styles.userInfo}>
					<CenteredAvatar 
						uri={item.avatar} 
						name={item.name} 
						size={40} 
						borderWidth={2} 
						borderColor="#4f46e5" 
						backgroundColor="#4f46e5" 
						textColor="#ffffff" 
						style={{ marginRight: 12 }}
					/>
					<Text style={styles.name} numberOfLines={1}>{item.name}</Text>
				</View>
				<Text style={styles.count}>{item.checkins_count}</Text>
			</TouchableOpacity>
		);
	};

	// Remove blocking loading screen for seamless navigation

	return (
		<View style={{ flex: 1, backgroundColor: '#0a3848' }}>
			<TopHeader title="Lyderių lentelė" />
			<View style={{ flex: 1, paddingBottom: 80 }}>
			<StatusBar style="light" />

			{loading && users.length === 0 && (
				<View style={{ padding: 20, alignItems: 'center' }}>
					<ActivityIndicator color="#ffffff" size="large" />
					<Text style={{ color: '#ffffff', marginTop: 10 }}>Kraunama...</Text>
				</View>
			)}

			{/* Podium Section */}
			{renderPodium()}

			{/* Table Header */}
			{users.length > 3 && (
				<View style={styles.tableHeader}>
					<Text style={[styles.tableHeaderText, styles.tableHeaderPosition]}>#</Text>
					<Text style={[styles.tableHeaderText, styles.tableHeaderUser]}>VARTOTOJAS</Text>
					<Text style={[styles.tableHeaderText, styles.tableHeaderCount]}>BARŲ KIEKIS</Text>
				</View>
			)}

			{/* Users List */}
			<FlatList
				data={users}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderUser}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />}
				style={styles.list}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>Nėra duomenų</Text>
					</View>
				}
			/>
			</View>
			<BottomTabBar />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0a3848', // Svetainės spalva
		paddingTop: 12,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0a3848',
	},
	loadingText: {
		color: '#ffffff',
		marginTop: 16,
		fontSize: 16,
	},

	list: {
		flex: 1,
	},
	listContent: {
		paddingBottom: 20,
	},

	// Podium styles - identiški svetainei
	podiumContainer: {
		backgroundColor: '#004259',
		marginHorizontal: 16,
		borderRadius: 12,
		padding: 24,
		marginBottom: 40,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	podiumTitle: {
		fontSize: 18,
		fontWeight: '500',
		textAlign: 'center',
		marginBottom: 24,
		color: '#fff',
	},
	podiumRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		gap: 16,
	},
	podiumItem: {
		alignItems: 'center',
		flex: 1,
	},
	podiumUser: {
		alignItems: 'center',
	},
	positionText: {
		fontSize: 14,
		fontWeight: 'bold',
		marginTop: 8,
	},
	userName: {
		fontSize: 14,
		fontWeight: '600',
		marginTop: 4,
		textAlign: 'center',
		color: '#fff',
	},
	firstPlaceText: {
		fontSize: 16,
	},
	checkinCount: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 2,
	},

	// Table styles - identiški svetainei
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: '#0a3848',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#374151',
		marginHorizontal: 16,
		marginBottom: 8,
	},
	tableHeaderText: {
		color: '#9ca3af',
		fontSize: 12,
		fontWeight: '500',
		textTransform: 'uppercase',
		textAlign: 'left',
	},
	tableHeaderPosition: {
		width: 40,
	},
	tableHeaderUser: {
		flex: 1,
		paddingLeft: 16,
	},
	tableHeaderCount: {
		width: 80,
		textAlign: 'center',
	},
	userRow: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#0a3848',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#374151',
		marginHorizontal: 16,
	},
	position: {
		color: '#d1d5db',
		fontSize: 14,
		fontWeight: '500',
		width: 40,
		textAlign: 'left',
	},
	userInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	name: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
		flex: 1,
	},
	count: {
		color: '#d1d5db',
		fontSize: 14,
		fontWeight: '500',
		width: 80,
		textAlign: 'center',
	},
	emptyContainer: {
		padding: 40,
		alignItems: 'center',
	},
	emptyText: {
		color: '#9ca3af',
		fontSize: 16,
	},
});

export default LeaderboardScreen;

