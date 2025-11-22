import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type User = {
    email: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    signIn: (email: string) => void;
    signOut: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('auth_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to check user', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string) => {
        const newUser = { email, name: email.split('@')[0] };
        setUser(newUser);
        await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
        router.replace('/(tabs)');
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem('auth_user');
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
