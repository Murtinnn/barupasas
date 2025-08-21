import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';

import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput, Image, ScrollView, LayoutAnimation, UIManager, Platform, Linking, Switch } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import locationService from '../../services/locationService';
import useAuthStore from '../../store/authStore';
import { API_URL } from '../../services/apiConfig';
import BarFiltersModal from '../../components/BarFiltersModal';
import { fetchTags, fetchRecommendedRoutes, fetchCategories } from '../../services/barFiltersService';
import TopHeader from '../../components/TopHeader';
import BottomTabBar from '../../components/BottomTabBar';

const BarsListScreen = ({ navigation }) => {
	const { token } = useAuthStore();
	const [items, setItems] = useState([]);
	const [displayItems, setDisplayItems] = useState([]);
	// const [loading, setLoading] = useState(false); // No loading state for seamless navigation
	const [error, setError] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [query, setQuery] = useState('');
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [routes, setRoutes] = useState([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);
	const searchDebounceRef = useRef(null);
	const [userLocation, setUserLocation] = useState(null);
	const [onlyOpen, setOnlyOpen] = useState(false);
	const [filtersModalVisible, setFiltersModalVisible] = useState(false);
	const [activeFilters, setActiveFilters] = useState({
		cities: [],
		tags: [],
		routes: []
	});

	// Enable smooth animations on Android
	useEffect(() => {
		if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}, []);

	const uniqueById = useCallback((arr) => {
		const map = new Map();
		for (const it of Array.isArray(arr) ? arr : []) {
			if (!map.has(it.id)) map.set(it.id, it);
		}
		return Array.from(map.values());
	}, []);

	// Memoized data calculation - must be before any conditional returns
	const dataToRender = useMemo(() => {
		return displayItems.length ? uniqueById(displayItems) : uniqueById(items);
	}, [displayItems, items, uniqueById]);

	const applyLocalFilter = useCallback((sourceItems, q, categoryId) => {
		const norm = (s) => String(s || '').toLowerCase();
		const nq = norm(q);
		const base = uniqueById(sourceItems);
		return base.filter((it) => {
			const matchesText = nq.length === 0 || norm(it.name).includes(nq) || norm(it.address).includes(nq);
			const matchesCat = !categoryId || (Array.isArray(it.categories) && it.categories.some((c) => c.id === categoryId));
			return matchesText && matchesCat;
		});
	}, [uniqueById]);

	const fetchBars = useCallback(async (reset = false) => {
		if (!token) return;
		if (!reset && !hasMore) return;

		try {
					if (reset && items.length === 0) {
			// No loading state for seamless navigation
			setError(null);
		}

			// Sąrašas su paginacija ir filtrais (jei turime lokaciją – backend rikiuos pagal atstumą)
			const currentPage = reset ? 1 : page;
			const params = new URLSearchParams();
			params.set('per_page', '50'); // Užkrauname po 50 barų (greitesnis)
			params.set('page', String(currentPage));
			if (query && query.trim().length > 0) params.set('search', query.trim());
			if (selectedCategoryId) params.set('category_id', String(selectedCategoryId));
			if (userLocation) {
				const lat = userLocation.coords?.latitude || userLocation.latitude;
				const lng = userLocation.coords?.longitude || userLocation.longitude;
				if (lat && lng) {
					params.set('lat', String(lat));
					params.set('lng', String(lng));
				}
			}
			if (onlyOpen) params.set('open', '1');
			
			// Pridedame naujus filtrus
			if (activeFilters.cities && activeFilters.cities.length > 0) {
				activeFilters.cities.forEach(cityId => params.append('city[]', cityId));
			}
			if (activeFilters.tags && activeFilters.tags.length > 0) {
				activeFilters.tags.forEach(tagId => params.append('tag[]', tagId));
			}
			if (activeFilters.routes && activeFilters.routes.length > 0) {
				activeFilters.routes.forEach(routeId => params.append('route[]', routeId));
			}
			
			const url = `${API_URL}/bars?${params.toString()}`;
			const res = await fetch(url, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } });
			const data = await res.json();
			if (!res.ok || !data?.success) throw new Error(data?.message || 'Nepavyko gauti barų sąrašo');
			
			const newItems = uniqueById(data.data.items || []);
			
			// Rikiavimo funkcija pagal atstumą
			const sortByDistance = (items) => {
				return items.sort((a, b) => {
					// Jei abu turi atstumą, rikiuojame pagal jį
					if (typeof a.distance_km === 'number' && typeof b.distance_km === 'number') {
						return a.distance_km - b.distance_km;
	}
					// Jei tik vienas turi atstumą, jis eina pirmas
					if (typeof a.distance_km === 'number') return -1;
					if (typeof b.distance_km === 'number') return 1;
					// Jei nei vienas neturi atstumo, rikiuojame pagal pavadinimą
					return (a.name || '').localeCompare(b.name || '');
				});
			};
			
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			if (reset) {
				const sortedItems = sortByDistance([...newItems]);
				setItems(sortedItems);
				setDisplayItems(sortedItems);
			} else {
				setItems((prev) => {
					const combinedItems = uniqueById([...prev, ...newItems]);
					return sortByDistance([...combinedItems]);
				});
				setDisplayItems((prev) => {
					const combinedItems = uniqueById([...prev, ...newItems]);
					return sortByDistance([...combinedItems]);
				});
			}
			
			// Tikriname, ar yra daugiau puslapių (naudojame pagination objektą)
			const pg = data.data.pagination;
			const hasMorePages = pg.current_page < pg.last_page;
			setHasMore(hasMorePages);
			setPage(currentPage + 1);
		} catch (e) {
			setError(e.message || 'Klaida kraunant duomenis');
		} finally {
			// No loading state for seamless navigation
			setRefreshing(false);
		}
	}, [token, query, selectedCategoryId, userLocation, API_URL, uniqueById, page, activeFilters]);

	// Pirmas užkrovimas tik kai turime lokaciją arba leidimas atmestas
	useEffect(() => { if (token && userLocation) { fetchBars(true); } }, [token, userLocation, fetchBars]);

			// Visada bandom gauti lokaciją ir perduoti lat/lng
		useEffect(() => {
			(async () => {
				try {
					const location = await locationService.getCurrentLocation();
					if (location) {
						setUserLocation(location);
					} else {
											// Call fetchBars directly without dependency
					if (token) {
						// Don't show loading for location-based refresh
							try {
								const response = await fetch(`${API_URL}/bars?per_page=50&page=1`, {
									headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
								});
								const data = await response.json();
								if (data?.success && data?.data?.items) {
									setItems(data.data.items);
									setDisplayItems(data.data.items);
								}
							} catch (e) {
								setError(e.message);
							}
						}
						return;
					}
					setPage(1);
					setHasMore(true);
					// fetchBars will be called when userLocation changes
				} catch {}
			})();
		}, [token, API_URL]);

	const fetchCategoriesData = useCallback(async () => {
		if (!token) return;
		try {
			const cats = await fetchCategories(token);
			setCategories(cats);
		} catch {}
	}, [token]);

	const fetchTagsData = useCallback(async () => {
		if (!token) return;
		try {
			const tagsData = await fetchTags(token);
			setTags(tagsData);
		} catch {}
	}, [token]);

	const fetchRoutesData = useCallback(async () => {
		if (!token) return;
		try {
			const routesData = await fetchRecommendedRoutes(token);
			setRoutes(routesData);
		} catch {}
	}, [token]);

	// Initial data load - immediate without loading state
	useEffect(() => { 
		if (token && items.length === 0) {
			fetchBars(true);
		}
	}, [token]);
	
	// Removed useFocusEffect to prevent infinite loops

	// Netoliese toggle buvo pašalintas

	const onRefresh = () => {
		setRefreshing(true);
		setPage(1);
		setHasMore(true);
		setItems([]);
		setDisplayItems([]);
		fetchBars(true);
	};

	const renderItem = useCallback(({ item, key }) => {
		return (
			<TouchableOpacity 
				key={key}
				style={[
					styles.card, 
					item.has_visited && styles.cardVisited
				]} 
				onPress={() => navigation.navigate('BarDetails', { id: item.id })}
			>
			{/* Wishlist heart top-right */}

			<View style={styles.cardRow}>
				{item.image_url ? (
					<Image source={{ uri: item.image_url }} style={styles.thumbLg} resizeMode="cover" />
				) : <View style={[styles.thumbLg, { backgroundColor: '#1f2937' }]} />}
				<View style={styles.cardBody}>
					<View style={styles.cardHeader}>
						<Text style={styles.cardTitle}>{item.name}</Text>
						<View style={styles.cardHeaderRight}>
							{typeof item.distance_km === 'number' ? (
								<Text style={styles.badgeDark}>
									{item.distance_km >= 1 ? 
										`${item.distance_km.toFixed(1)} km` : 
										`${Math.round(item.distance_km * 1000)} m`
									}
								</Text>
							) : null}
							<TouchableOpacity
								style={styles.heartBtn}
								onPress={async () => {
									try {
										LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
										const res = await fetch(`${API_URL}/bars/${item.id}/wishlist`, {
											method: 'POST',
											headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
										});
										const data = await res.json();
										if (!res.ok || !data?.success) throw new Error();
										const next = !!data.data.is_in_wishlist;
										setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, is_in_wishlist: next } : it)));
										setDisplayItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, is_in_wishlist: next } : it)));
									} catch {}
								}}
							>
								<Ionicons name={item.is_in_wishlist ? 'heart' : 'heart-outline'} size={22} color={item.is_in_wishlist ? '#dc2626' : '#cbd5e1'} />
							</TouchableOpacity>
						</View>
					</View>
					{item.address ? <Text style={styles.cardSubDark}>{item.address}</Text> : null}
					{Array.isArray(item.tags) && item.tags.length > 0 ? (
						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6 }}>
							{item.tags.map((t) => (
								<Text
									key={`tag-${item.id}-${t.id}`}
									style={[styles.tagBadge, t.color ? { backgroundColor: t.color } : styles.badgeDark, { marginRight: 6 }]}
								>
									{t.name}
								</Text>
							))}
						</ScrollView>
					) : null}
					{item.today_status ? (
						<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
							<View style={[styles.dot, { backgroundColor: item.today_status.is_open_now ? '#10b981' : '#ef4444' }]} />
							<Text style={styles.statusText}>
								{item.today_status.is_open_now ? `Atidaryta ${item.today_status.opening_time}–${item.today_status.closing_time}` : 'Uždaryta'}
							</Text>
						</View>
					) : null}
					<View style={styles.actionsRow}>
						{/* Check-in: green for first visit, purple for subsequent visits */}
						<TouchableOpacity 
							style={[styles.chip, item.has_official_checkin ? styles.chipPurple : styles.chipGreen]} 
							onPress={async () => {
								try {
									const loc = await locationService.getCurrentLocation();
									if (!loc) { return; }
									
									if (item.has_official_checkin) {
										// Subsequent visit - social check-in logic
										if (!item.can_do_social_checkin) {
											// Skaičiuojame, kiek laiko dar liko
											const lastCheckin = item.last_checkin_at || new Date();
											const nextAvailableTime = new Date(lastCheckin);
											nextAvailableTime.setHours(nextAvailableTime.getHours() + 12);
											
											const now = new Date();
											const timeRemaining = nextAvailableTime - now;
											
											if (timeRemaining > 0) {
												const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
												const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
												
												let timeMessage = '';
												if (hours > 0) {
													timeMessage = `${hours} val. ${minutes} min.`;
												} else {
													timeMessage = `${minutes} min.`;
												}
												
												alert(`Pakartotinis check-in gali būti atliekamas tik po 12 valandų nuo paskutinio apsilankymo.\n\nGalėsite atlikti check-in už: ${timeMessage}`);
											} else {
												alert('Check-in galimas tik po 12 valandų nuo paskutinio apsilankymo');
											}
											return;
										}
										
										// Social check-in endpoint
										const res = await fetch(`${API_URL}/checkins/${item.id}/social`, {
											method: 'POST',
											headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
											body: JSON.stringify({ 
												latitude: loc.coords?.latitude || loc.latitude, 
												longitude: loc.coords?.longitude || loc.longitude 
											})
										});
										const data = await res.json().catch(() => ({}));
										
										if (res.ok && data?.data?.mode === 'social_questions') {
											navigation.navigate('CheckinQuestions', { 
												barId: item.id, 
												questions: data.data.questions || [],
												isSocialCheckin: true 
											});
											return;
										}
										
										alert(data?.message || 'Nepavyko atlikti check-in');
									} else {
										// First visit - official check-in logic
										const res = await fetch(`${API_URL}/checkins/${item.id}/start`, {
											method: 'POST',
											headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
											body: JSON.stringify({ 
												latitude: loc.coords?.latitude || loc.latitude, 
												longitude: loc.coords?.longitude || loc.longitude 
											})
										});
										const data = await res.json().catch(() => ({}));
										
										if (res.ok && data?.data?.mode === 'questions') {
											navigation.navigate('CheckinQuestions', { barId: item.id, questions: data.data.questions || [] });
											return;
										}
										if (res.ok && data?.data?.mode === 'instant') {
											// Sėkmingas greitas check-in
											alert(data.data?.message || 'Check‑in atliktas');
											return;
										}
										alert(data?.message || 'Nepavyko atlikti check‑in');
									}
								} catch (e) {
									alert('Klaida atliekant check‑in');
								}
							}}
						>
							<Text style={styles.chipText}>Check‑in</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.chip, styles.chipPurple]} onPress={() => navigation.navigate('BarDetails', { id: item.id })}>
							<Text style={styles.chipText}>Plačiau</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.chip, styles.chipGray]}
							onPress={() => {
								if (item.latitude && item.longitude) {
									const lat = Number(item.latitude);
									const lng = Number(item.longitude);
									const label = encodeURIComponent(item.name || 'Bar');
									const url = Platform.select({
										ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`,
										android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
										default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
									});
									if (url) Linking.openURL(url);
								}
							}}
						>
							<Text style={styles.chipText}>Nuvykti</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TouchableOpacity>
		);
	});

	const onChangeQuery = (text) => {
		setQuery(text);
		// Local, immediate filter (no loading state)
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setDisplayItems(applyLocalFilter(items, text, selectedCategoryId));
		if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
		searchDebounceRef.current = setTimeout(() => {
			// Tylus AJAX paieškos atnaujinimas: tik 0 arba ≥2 simboliai
			if (text.length === 0 || text.trim().length >= 2) {
				setPage(1);
				setHasMore(true);
				setItems([]);
				setDisplayItems([]);
				// "Silent" – nekeliame loading flag (jis keliamos tik pradiniam vaizde)
				fetchBars(true);
			}
		}, 250);
	};

	const onSelectCategory = (id) => {
		const nextId = (id === selectedCategoryId ? null : id);
		setSelectedCategoryId(nextId);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setDisplayItems(applyLocalFilter(items, query, nextId));
		setPage(1);
		setHasMore(true);
		setItems([]);
		setDisplayItems([]);
		fetchBars(true);
	};

	const handleFiltersApply = (apiFilters) => {
		// Konvertuojame iš API formato į modalės formatą
		const modalFilters = {
			cities: apiFilters.city || [],
			tags: apiFilters.tag || [],
			routes: apiFilters.route || []
		};
		
		setActiveFilters(modalFilters);
		setPage(1);
		setHasMore(true);
		setItems([]);
		setDisplayItems([]);
		fetchBars(true);
	};

	// Remove blocking loading screen for seamless navigation

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.error}>{error}</Text>
				<TouchableOpacity style={styles.retryBtn} onPress={() => fetchBars(true)}>
					<Text style={styles.retryText}>Bandyti dar kartą</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#0a3848' }}>
			<TopHeader title="Barai" />
			<View style={{ flex: 1, paddingBottom: 80 }}>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={styles.listContent}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				onScroll={(event) => {
					const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
					const scrollY = contentOffset.y;
					const contentHeight = contentSize.height;
					const screenHeight = layoutMeasurement.height;
					const distanceFromBottom = contentHeight - scrollY - screenHeight;
					
					// Krauname daugiau, jei esame prie pabaigos (greitesnis trigger)
					if (distanceFromBottom < 100 && hasMore && items.length > 0) {
						fetchBars(false);
					}
				}}
				scrollEventThrottle={8}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{/* No loading indicator for seamless navigation */}

				{/* Header */}
				<View>
						<View style={styles.titleWrap}>
							<Text style={styles.pageTitle}>Barų Sąrašas</Text>
						</View>
						<View style={styles.searchWrap}>
							<TextInput
								value={query}
								onChangeText={onChangeQuery}
								placeholder="Paieška pagal pavadinimą ar adresą..."
								placeholderTextColor="#9ca3af"
								style={styles.searchInput}
								returnKeyType="search"
								blurOnSubmit={false}
							/>

							<View style={styles.filtersRow}>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
									<Switch value={onlyOpen} onValueChange={(v)=>{ setOnlyOpen(v); setPage(1); setHasMore(true); setItems([]); setDisplayItems([]); fetchBars(true); }} trackColor={{ true: '#16a34a' }} thumbColor={onlyOpen ? '#ffffff' : '#f4f3f4'} />
									<Text style={{ marginLeft: 8, color: '#ffffff' }}>Rodyti tik atidarytus</Text>
								</View>
								<TouchableOpacity 
									style={styles.filterButton}
									onPress={() => setFiltersModalVisible(true)}
								>
									<Ionicons name="filter" size={20} color="#ffffff" />
									<Text style={styles.filterButtonText}>Filtrai</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* Bars List */}
					{dataToRender.map((item) => renderItem({ item, key: item.id }))}

					{/* Loading Indicator */}
					{hasMore ? (
						<View style={{ padding: 20, alignItems: 'center' }}>
							<ActivityIndicator color="#0b3d2c" size="large" />
							<Text style={{ marginTop: 10, color: '#ffffff' }}>Kraunama daugiau barų...</Text>
						</View>
					) : null}
				</ScrollView>

				{/* Filtravimo modalas */}
				<BarFiltersModal
					key={JSON.stringify(activeFilters)}
					visible={filtersModalVisible}
					onClose={() => setFiltersModalVisible(false)}
					onApply={handleFiltersApply}
					categories={categories}
					tags={tags}
					routes={routes}
					initialFilters={activeFilters}
					userLocation={userLocation}
					fetchCategoriesData={fetchCategoriesData}
					fetchTagsData={fetchTagsData}
					fetchRoutesData={fetchRoutesData}
				/>
			</View>
			<BottomTabBar />
		</View>
	);
};

const styles = StyleSheet.create({
	page: { flex: 1, backgroundColor: '#0a3848' },
	listContent: { padding: 16 },
	titleWrap: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 },
	pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
	centerText: { marginTop: 8, color: '#374151' },
	error: { color: '#b91c1c', fontWeight: '600', marginBottom: 12, textAlign: 'center' },
	retryBtn: { backgroundColor: '#0b3d2c', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
	retryText: { color: '#fff', fontWeight: '700' },
	searchWrap: { paddingHorizontal: 16, paddingBottom: 16 },
	searchInput: { backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#111827' },
	categoriesRow: { marginTop: 10 },
	categoriesContent: { paddingRight: 16 },
	filtersRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
	filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4f46e5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 8 },
	filterButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
	catChip: { backgroundColor: '#eef2f7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb' },
	catChipActive: { backgroundColor: '#0b3d2c', borderColor: '#0b3d2c' },
	catText: { color: '#111827', fontWeight: '600' },
	catTextActive: { color: '#ffffff' },
	card: { backgroundColor: '#004259', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#0f4a60', overflow: 'hidden' },
	cardVisited: { borderColor: '#22c55e', borderWidth: 2 },
	cardRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
	thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 12, backgroundColor: '#e5e7eb' },
	thumbLg: { width: 80, height: 80, borderRadius: 8, marginRight: 12, backgroundColor: '#e5e7eb' },
	cardBody: { flex: 1 },

	heartBtn: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(10,56,72,0.9)', borderWidth: 1, borderColor: '#0f4a60' },
	cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	cardTitle: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
	badge: { backgroundColor: '#e5f3ed', color: '#0b3d2c', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 12 },
	badgeDark: { backgroundColor: '#123e51', color: '#cbd5e1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 12 },
	cardSub: { marginTop: 6, color: '#6b7280' },
	cardSubDark: { marginTop: 4, color: '#cbd5e1' },
	actionsRow: { flexDirection: 'row', marginTop: 10, gap: 8 },
	actionSm: { backgroundColor: '#0b3d2c', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
	actionSmActive: { backgroundColor: '#0b3d2c' },
	actionSmText: { color: '#ffffff', fontWeight: '700' },
	chip: { borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
	chipText: { color: '#ffffff', fontWeight: '700' },
	chipGreen: { backgroundColor: '#15803d' },
	chipPurple: { backgroundColor: '#6d28d9' },
	chipGray: { backgroundColor: '#6b7280' },
	chipDisabled: { opacity: 0.5 },
	statusChip: { marginTop: 6, alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, overflow: 'hidden' },
	statusText: { color: '#ffffff', marginLeft: 6 },
	dot: { width: 8, height: 8, borderRadius: 999 },
	tagBadge: { backgroundColor: '#123e51', color: '#ffffff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 12 },
});

export default BarsListScreen;
