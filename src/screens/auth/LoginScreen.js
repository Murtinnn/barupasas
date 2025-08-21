import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	ActivityIndicator,
	Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import useAuthStore from '../../store/authStore';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const { login, isLoading, error, clearError } = useAuthStore();

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert('Klaida', 'Prašome įvesti el. paštą ir slaptažodį');
			return;
		}
		clearError();
		const result = await login({ email, password, remember });
		if (!result.success) {
			Alert.alert('Prisijungimo klaida', result.error || 'Nepavyko prisijungti');
		}
	};

	const navigateToForgot = () => {
		Alert.alert('Priminti slaptažodį', 'Ši funkcija bus pridėta vėliau.');
	};

	const navigateToRegister = () => {
		navigation.navigate('Register');
	};

	return (
		<KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<StatusBar style="light" />
			<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
				{/* Forma – be papildomų headerių, kaip web login.blade.php */}
				<View style={styles.formBox}>
					{error ? (
						<View style={styles.alert}>
							<Text style={styles.alertText}>{error}</Text>
						</View>
					) : null}

					{/* El. paštas */}
					<View style={styles.fieldBlock}>
						<Text style={styles.label}>El. paštas</Text>
						<TextInput
							style={styles.input}
							placeholder="jusu@email.lt"
							placeholderTextColor="#6b7280"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							editable={!isLoading}
						/>
					</View>

					{/* Slaptažodis */}
					<View style={[styles.fieldBlock, styles.mt4]}>
						<Text style={styles.label}>Slapažodis</Text>
						<View style={styles.passwordRow}>
							<TextInput
								style={[styles.input, styles.inputFlex]}
								placeholder="Įveskite slaptažodį"
								placeholderTextColor="#6b7280"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								editable={!isLoading}
							/>
							<TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
								<Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Prisiminti */}
					<View style={[styles.rememberWrap, styles.mt4]}>
						<Pressable style={styles.checkboxRow} onPress={() => setRemember(!remember)}>
							<View style={[styles.checkbox, remember && styles.checkboxChecked]}> 
								{remember ? <Text style={styles.checkboxMark}>✓</Text> : null}
							</View>
							<Text style={styles.rememberText}>Prisiminti</Text>
						</Pressable>
					</View>

					{/* Veiksmų eilutė kaip web: kairėje nuoroda, dešinėje balta CTA */}
					<View style={[styles.actionsRow, styles.mt4]}>
						<TouchableOpacity onPress={navigateToForgot}>
							<Text style={styles.forgotLink}>Pamiršote slaptažodį?</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]} onPress={handleLogin} disabled={isLoading}>
							{isLoading ? <ActivityIndicator color="#111827" /> : <Text style={styles.primaryBtnText}>Prisijungti</Text>}
						</TouchableOpacity>
					</View>

					{/* Registracija (pas web jos nėra šiame puslapyje, bet paliekame nuorodą apačioje) */}
					<View style={styles.registerRow}>
						<Text style={styles.registerText}>Neturite paskyros? </Text>
						<TouchableOpacity onPress={navigateToRegister} disabled={isLoading}>
							<Text style={styles.registerLink}>Registruotis</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	// Puslapio fonas kaip dark tema (gray-900)
	page: { flex: 1, backgroundColor: '#111827' },
	container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
	formBox: { width: '100%', maxWidth: 420, alignSelf: 'center' },

	// Klaidos pranešimas (panašus į tailwind alert)
	alert: { backgroundColor: '#7f1d1d', borderColor: '#fecaca', borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 16 },
	alertText: { color: '#fde2e2', fontSize: 14, textAlign: 'center' },

	fieldBlock: {},
	mt4: { marginTop: 16 },

	label: { color: '#e5e7eb', fontSize: 14, fontWeight: '600', marginBottom: 6 }, // text-gray-200
	input: {
		backgroundColor: '#111827', // dark:bg-gray-900
		borderColor: '#374151', // dark:border-gray-700
		borderWidth: 1,
		color: '#d1d5db', // dark:text-gray-300
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 12,
		fontSize: 16,
	},
	inputFlex: { flex: 1 },
	passwordRow: { flexDirection: 'row', alignItems: 'center' },
	eyeBtn: { paddingHorizontal: 12, paddingVertical: 10 },
	eyeText: { color: '#d1d5db', fontSize: 18 },

	rememberWrap: { flexDirection: 'row', alignItems: 'center' },
	checkboxRow: { flexDirection: 'row', alignItems: 'center' },
	checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#374151', backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
	checkboxChecked: { backgroundColor: '#2d7a4f', borderColor: '#2d7a4f' }, // akcentas lieka brandintas
	checkboxMark: { color: '#ffffff', fontSize: 14, lineHeight: 14 },
	rememberText: { color: '#9ca3af', marginLeft: 8, fontSize: 14 }, // dark:text-gray-400

	actionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	forgotLink: { color: '#9ca3af', textDecorationLine: 'underline', fontSize: 14 },
	primaryBtn: { backgroundColor: '#ffffff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 }, // x-primary-button baltas
	primaryBtnDisabled: { opacity: 0.6 },
	primaryBtnText: { color: '#111827', fontWeight: '700', fontSize: 16 },

	registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
	registerText: { color: '#d1d5db', fontSize: 14 },
	registerLink: { color: '#93c5fd', fontSize: 14, fontWeight: '600' },

	// Antraštės (šioje versijoje nenaudojamos – paliktos jei prireiktų)
	header: { display: 'none' },
	title: { display: 'none' },
	subtitle: { display: 'none' },
	logo: { display: 'none' },
});

export default LoginScreen;
