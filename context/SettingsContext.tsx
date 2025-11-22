import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'gold' | 'purple' | 'blue' | 'green';

type ThemeColors = {
    primary: string;
    secondary: string;
    gradient: string;
};

type SettingsContextType = {
    darkMode: boolean;
    theme: Theme;
    notifications: boolean;
    autoSave: boolean;
    toggleDarkMode: () => void;
    setTheme: (theme: Theme) => void;
    toggleNotifications: () => void;
    toggleAutoSave: () => void;
    getThemeColors: () => ThemeColors;
};

const themeColorMap: Record<Theme, ThemeColors> = {
    gold: {
        primary: '#ffd700',
        secondary: '#ff8c00',
        gradient: 'linear-gradient(135deg, #ffd700, #ff8c00)',
    },
    purple: {
        primary: '#a855f7',
        secondary: '#9333ea',
        gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    },
    blue: {
        primary: '#3b82f6',
        secondary: '#2563eb',
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
    green: {
        primary: '#00ff88',
        secondary: '#00cc66',
        gradient: 'linear-gradient(135deg, #00ff88, #00cc66)',
    },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(true);
    const [theme, setThemeState] = useState<Theme>('gold');
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedDarkMode = await AsyncStorage.getItem('darkMode');
            const savedTheme = await AsyncStorage.getItem('theme');
            const savedNotifications = await AsyncStorage.getItem('notifications');
            const savedAutoSave = await AsyncStorage.getItem('autoSave');

            if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
            if (savedTheme !== null) setThemeState(savedTheme as Theme);
            if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
            if (savedAutoSave !== null) setAutoSave(JSON.parse(savedAutoSave));
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const toggleDarkMode = async () => {
        const newValue = !darkMode;
        setDarkMode(newValue);
        await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
    };

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
    };

    const toggleNotifications = async () => {
        const newValue = !notifications;
        setNotifications(newValue);
        await AsyncStorage.setItem('notifications', JSON.stringify(newValue));
    };

    const toggleAutoSave = async () => {
        const newValue = !autoSave;
        setAutoSave(newValue);
        await AsyncStorage.setItem('autoSave', JSON.stringify(newValue));
    };

    const getThemeColors = () => themeColorMap[theme];

    return (
        <SettingsContext.Provider
            value={{
                darkMode,
                theme,
                notifications,
                autoSave,
                toggleDarkMode,
                setTheme,
                toggleNotifications,
                toggleAutoSave,
                getThemeColors,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
