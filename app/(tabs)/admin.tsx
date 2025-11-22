import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUserManagement, UserRole, Permission } from '@/context/UserManagementContext';

export default function AdminScreen() {
    const { users, currentUser, createUser, updateUser, deleteUser, hasPermission, isAdmin } = useUserManagement();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState<string | null>(null);

    // Form state
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState<UserRole>('viewer');

    // Check if user has admin access
    if (!hasPermission('manage_users')) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100">
                <StatusBar style="dark" />
                <View className="flex-1 items-center justify-center p-4">
                    <View className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
                        <Text className="text-6xl mb-4 text-center">🚫</Text>
                        <Text className="text-xl font-bold text-red-700 mb-2 text-center">Access Denied</Text>
                        <Text className="text-gray-600 text-center">
                            You don&apos;t have permission to access the admin panel.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    const handleCreateUser = async () => {
        if (!newEmail || !newName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const permissions: Permission[] = [];

        await createUser({
            email: newEmail,
            name: newName,
            role: newRole,
            permissions,
            isActive: true
        });

        Alert.alert('Success', 'User created successfully!');
        setNewEmail('');
        setNewName('');
        setNewRole('viewer');
        setShowCreateForm(false);
    };

    const handleDeleteUser = (userId: string, userName: string) => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete "${userName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteUser(userId)
                }
            ]
        );
    };

    const toggleUserStatus = (userId: string, currentStatus: boolean) => {
        updateUser(userId, { isActive: !currentStatus });
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-300';
            case 'manager': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'viewer': return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getPermissionCount = (role: UserRole) => {
        const counts = { admin: 7, manager: 5, viewer: 2 };
        return counts[role];
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar style="dark" />
            <View className="p-4 flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-2xl font-bold text-gray-800">Admin Panel</Text>
                        <Text className="text-gray-500 mt-1">User Management & Permissions</Text>
                    </View>
                    <TouchableOpacity
                        className="bg-purple-600 p-3 rounded-full"
                        onPress={() => setShowCreateForm(!showCreateForm)}
                    >
                        <IconSymbol name={showCreateForm ? "xmark" : "person.badge.plus"} size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Stats */}
                    <View className="flex-row gap-3 mb-4">
                        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                            <Text className="text-gray-500 text-sm">Total Users</Text>
                            <Text className="text-2xl font-bold text-gray-800 mt-1">{users.length}</Text>
                        </View>
                        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                            <Text className="text-gray-500 text-sm">Active</Text>
                            <Text className="text-2xl font-bold text-green-600 mt-1">
                                {users.filter(u => u.isActive).length}
                            </Text>
                        </View>
                        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                            <Text className="text-gray-500 text-sm">Admins</Text>
                            <Text className="text-2xl font-bold text-purple-600 mt-1">
                                {users.filter(u => u.role === 'admin').length}
                            </Text>
                        </View>
                    </View>

                    {/* Create User Form */}
                    {showCreateForm && (
                        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
                            <Text className="text-lg font-bold text-gray-800 mb-4">Create New User</Text>

                            <View className="mb-3">
                                <Text className="text-gray-600 mb-1 font-medium">Email</Text>
                                <TextInput
                                    className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-800"
                                    placeholder="user@example.com"
                                    value={newEmail}
                                    onChangeText={setNewEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View className="mb-3">
                                <Text className="text-gray-600 mb-1 font-medium">Full Name</Text>
                                <TextInput
                                    className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-800"
                                    placeholder="John Doe"
                                    value={newName}
                                    onChangeText={setNewName}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-600 mb-2 font-medium">Role</Text>
                                <View className="flex-row gap-2">
                                    {(['admin', 'manager', 'viewer'] as UserRole[]).map((role) => (
                                        <TouchableOpacity
                                            key={role}
                                            className={`flex-1 p-3 rounded-xl border-2 ${newRole === role
                                                ? 'bg-purple-50 border-purple-600'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                            onPress={() => setNewRole(role)}
                                        >
                                            <Text className={`text-center font-semibold capitalize ${newRole === role ? 'text-purple-600' : 'text-gray-600'
                                                }`}>
                                                {role}
                                            </Text>
                                            <Text className="text-xs text-gray-500 text-center mt-1">
                                                {getPermissionCount(role)} permissions
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity
                                className="bg-purple-600 p-4 rounded-xl active:bg-purple-700"
                                onPress={handleCreateUser}
                            >
                                <Text className="text-white font-bold text-center">Create User</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Users List */}
                    <Text className="text-lg font-bold text-gray-800 mb-3">All Users</Text>
                    {users.map((user) => (
                        <View key={user.id} className="bg-white p-4 rounded-xl shadow-sm mb-3">
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <Text className="text-lg font-bold text-gray-800">{user.name}</Text>
                                        {!user.isActive && (
                                            <View className="bg-red-100 px-2 py-1 rounded">
                                                <Text className="text-red-600 text-xs font-semibold">Inactive</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="text-gray-500 text-sm">{user.email}</Text>
                                    <View className="flex-row items-center gap-2 mt-2">
                                        <View className={`px-3 py-1 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                            <Text className="text-xs font-semibold capitalize">{user.role}</Text>
                                        </View>
                                        <Text className="text-xs text-gray-500">
                                            {user.permissions.length} permissions
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Actions */}
                            {currentUser?.id !== user.id && (
                                <View className="flex-row gap-2 mt-2 pt-3 border-t border-gray-100">
                                    <TouchableOpacity
                                        className="flex-1 bg-blue-50 p-2 rounded-lg flex-row items-center justify-center gap-2"
                                        onPress={() => toggleUserStatus(user.id, user.isActive)}
                                    >
                                        <IconSymbol
                                            name={user.isActive ? "pause.circle" : "play.circle"}
                                            size={18}
                                            color="#2563eb"
                                        />
                                        <Text className="text-blue-600 font-semibold text-sm">
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="flex-1 bg-red-50 p-2 rounded-lg flex-row items-center justify-center gap-2"
                                        onPress={() => handleDeleteUser(user.id, user.name)}
                                    >
                                        <IconSymbol name="trash" size={18} color="#dc2626" />
                                        <Text className="text-red-600 font-semibold text-sm">Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {currentUser?.id === user.id && (
                                <View className="mt-2 pt-3 border-t border-gray-100">
                                    <Text className="text-xs text-gray-500 text-center">
                                        👤 This is you (Current User)
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
