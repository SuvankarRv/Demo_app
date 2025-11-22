import { Tabs } from 'expo-router';
import React from 'react';
import { View, Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Sidebar from '@/components/Sidebar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isWeb = Platform.OS === 'web';

  return (
    <View className="flex-1 flex-row">
      {/* Sidebar for Web */}
      {isWeb && <Sidebar />}

      {/* Main Content */}
      <View className="flex-1">
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            // Hide tab bar on web (using sidebar instead)
            tabBarStyle: isWeb ? { display: 'none' } : undefined,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="inventory"
            options={{
              title: 'Inventory',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="admin"
            options={{
              title: 'Admin',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              href: null, // Hide this tab
            }}
          />
        </Tabs>
      </View>

      {/* Sidebar for Mobile (rendered inside Sidebar component) */}
    </View>
  );
}
