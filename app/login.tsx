import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
    const { signIn } = useAuth();

    // Platform-specific rendering
    if (Platform.OS === 'web') {
        // For web, use dynamic require
        const WebLogin = require('./login.web').default;
        return <WebLogin signIn={signIn} />;
    } else {
        // For native platforms
        const NativeLogin = require('./login.native').default;
        return <NativeLogin signIn={signIn} />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});
