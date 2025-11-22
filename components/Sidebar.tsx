import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useUserManagement } from '@/context/UserManagement Context';

type NavItem = {
    name: string;
    path: string;
    icon: string;
    permission?: string;
};

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { hasPermission, currentUser } = useUserManagement();
    const slideAnim = useRef(new Animated.Value(0)).current;

    const navItems: NavItem[] = [
        { name: 'Dashboard', path: '/(tabs)', icon: 'house.fill' },
        { name: 'Inventory', path: '/(tabs)/inventory', icon: 'list.bullet', permission: 'view_inventory' },
        { name: 'Admin', path: '/(tabs)/admin', icon: 'shield.fill', permission: 'manage_users' },
        { name: 'Settings', path: '/(tabs)/settings', icon: 'gearshape.fill' },
    ];

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: isCollapsed ? 1 : 0,
            useNativeDriver: false,
            tension: 50,
            friction: 7
        }).start();
    }, [isCollapsed]);

    const sidebarWidth = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [280, 80]
    });

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path);
    };

    const handleNavigate = (path: string) => {
        router.push(path as any);
        if (Platform.OS !== 'web') {
            setIsMobileOpen(false);
        }
    };

    const filteredNavItems = navItems.filter(item => {
        if (!item.permission) return true;
        return hasPermission(item.permission as any);
    });

    if (Platform.OS !== 'web') {
        // Mobile: Drawer-style sidebar
        return (
            <>
                {/* Mobile Menu Button */}
                <TouchableOpacity
                    className="absolute top-4 left-4 z-50 bg-purple-600 p-3 rounded-full shadow-lg"
                    onPress={() => setIsMobileOpen(!isMobileOpen)}
                >
                    <IconSymbol name={isMobileOpen ? "xmark" : "line.3.horizontal"} size={24} color="white" />
                </TouchableOpacity>

                {/* Mobile Sidebar Overlay */}
                {isMobileOpen && (
                    <>
                        <View className="absolute inset-0 bg-black/50 z-40" onTouchEnd={() => setIsMobileOpen(false)} />
                        <View className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-gray-900 to-black z-50 shadow-2xl">
                            <RenderSidebarContent
                                isCollapsed={false}
                                navItems={filteredNavItems}
                                isActive={isActive}
                                handleNavigate={handleNavigate}
                                user={user}
                                currentUser={currentUser}
                                signOut={signOut}
                            />
                        </View>
                    </>
                )}
            </>
        );
    }

    // Desktop: Fixed sidebar
    return (
        <Animated.View
            style={{ width: sidebarWidth }}
            className="h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black border-r border-gray-700/50 relative"
        >
            {/* Collapse Toggle */}
            <TouchableOpacity
                className="absolute -right-4 top-20 z-10 bg-purple-600 p-2 rounded-full shadow-lg"
                onPress={() => setIsCollapsed(!isCollapsed)}
            >
                <IconSymbol
                    name={isCollapsed ? "chevron.right" : "chevron.left"}
                    size={16}
                    color="white"
                />
            </TouchableOpacity>

            <RenderSidebarContent
                isCollapsed={isCollapsed}
                navItems={filteredNavItems}
                isActive={isActive}
                handleNavigate={handleNavigate}
                user={user}
                currentUser={currentUser}
                signOut={signOut}
            />
        </Animated.View>
    );
}

function RenderSidebarContent({ isCollapsed, navItems, isActive, handleNavigate, user, currentUser, signOut }: any) {
    return (
        <View className="flex-1 p-4">
            {/* Logo/Brand */}
            <View className="mb-8 mt-4">
                {!isCollapsed ? (
                    <>
                        <Text className="text-3xl font-bold text-white mb-1">
                            Inventory<Text className="text-purple-400">Pro</Text>
                        </Text>
                        <Text className="text-gray-400 text-xs">Professional Management</Text>
                    </>
                ) : (
                    <View className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                        <Text className="text-white text-2xl font-bold">IP</Text>
                    </View>
                )}
            </View>

            {/* User Profile */}
            {!isCollapsed && (
                <View className="bg-white/5 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/10">
                    <View className="flex-row items-center gap-3">
                        <View className="bg-gradient-to-br from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                            <Text className="text-white text-lg font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold" numberOfLines={1}>
                                {user?.name || 'User'}
                            </Text>
                            <Text className="text-gray-400 text-xs capitalize">
                                {currentUser?.role || 'Member'}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Navigation Items */}
            <View className="flex-1">
                {navItems.map((item: any, index: number) => {
                    const active = isActive(item.path);
                    return (
                        <TouchableOpacity
                            key={item.path}
                            onPress={() => handleNavigate(item.path)}
                            className={`flex-row items-center gap-3 p-3 rounded-xl mb-2 transition-all ${active
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50'
                                    : 'hover:bg-white/5'
                                }`}
                            style={{ marginTop: index === 0 ? 0 : 4 }}
                        >
                            <View className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-white/20' : 'bg-white/5'
                                }`}>
                                <IconSymbol
                                    name={item.icon}
                                    size={22}
                                    color={active ? '#ffffff' : '#9ca3af'}
                                />
                            </View>
                            {!isCollapsed && (
                                <Text className={`font-semibold ${active ? 'text-white' : 'text-gray-300'
                                    }`}>
                                    {item.name}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                onPress={signOut}
                className="flex-row items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 mt-4"
            >
                <View className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <IconSymbol name="arrow.right.square" size={22} color="#ef4444" />
                </View>
                {!isCollapsed && (
                    <Text className="font-semibold text-red-400">Logout</Text>
                )}
            </TouchableOpacity>

            {/* Footer */}
            {!isCollapsed && (
                <View className="mt-4 pt-4 border-t border-white/10">
                    <Text className="text-gray-500 text-xs text-center">
                        Made with ❤️ by Suvankar
                    </Text>
                    <Text className="text-gray-600 text-xs text-center mt-1">
                        v1.0.0
                    </Text>
                </View>
            )}
        </View>
    );
}
