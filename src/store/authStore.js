import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../services/apiConfig';

// Using regular fetch instead of timeout wrapper for better compatibility

const useAuthStore = create((set, get) => ({
	user: null,
	token: null,
	isLoading: false,
	isAuthenticated: true, // Start authenticated for seamless navigation
	error: null,

	setLoading: (loading) => set({ isLoading: loading }),
	setError: (error) => set({ error }),
	clearError: () => set({ error: null }),

	login: async (credentials) => {
		set({ isLoading: true, error: null });
		try {
			const res = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(credentials),
			});
			const data = await res.json().catch(() => ({ success: false }));
			if (data?.success) {
				const { user, token } = data.data;
				await SecureStore.setItemAsync('auth_token', token);
				await SecureStore.setItemAsync('user_data', JSON.stringify(user));
				set({ user, token, isAuthenticated: true, isLoading: false, error: null });
				return { success: true, data: data.data };
			}
			set({ isLoading: false, error: data?.message || 'Prisijungti nepavyko', isAuthenticated: false });
			return { success: false, error: data?.message };
		} catch (e) {
			set({ isLoading: false, error: 'Network error', isAuthenticated: false });
			return { success: false, error: 'Network error' };
		}
	},

	register: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const res = await fetch(`${API_URL}/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(payload),
			});
			const data = await res.json().catch(() => ({ success: false }));
			if (data?.success) {
				const { user, token } = data.data;
				await SecureStore.setItemAsync('auth_token', token);
				await SecureStore.setItemAsync('user_data', JSON.stringify(user));
				set({ user, token, isAuthenticated: true, isLoading: false, error: null });
				return { success: true, data: data.data };
			}
			set({ isLoading: false, error: data?.message || 'Registracija nepavyko', isAuthenticated: false });
			return { success: false, error: data?.message, errors: data?.errors };
		} catch (e) {
			set({ isLoading: false, error: 'Network error', isAuthenticated: false });
			return { success: false, error: 'Network error' };
		}
	},

	logout: async () => {
		set({ isLoading: true });
		try {
			const { token } = get();
			if (token) {
				await fetch(`${API_URL}/auth/logout`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
				});
			}
		} catch {}
		await SecureStore.deleteItemAsync('auth_token');
		await SecureStore.deleteItemAsync('user_data');
		set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
	},

	loadStoredAuth: () => {
		// TEMP: Force user ID 5 (Jackas) for testing - immediate sync setup
		const testUser = { id: 5, name: 'Jackas', email: 'm.jakelevicius@gmail.com' };
		const testToken = '12|nV56SbM7eenXQtzwkaTpQAGHU4amhqsvyOsfiWZT91e3733e';
		
		// Set auth immediately - synchronous for instant navigation
		set({ user: testUser, token: testToken, isAuthenticated: true, isLoading: false, error: null });
		
		// Store in background (non-blocking)
		SecureStore.setItemAsync('auth_token', testToken);
		SecureStore.setItemAsync('user_data', JSON.stringify(testUser));
		
	},

	updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
}));

export default useAuthStore;
