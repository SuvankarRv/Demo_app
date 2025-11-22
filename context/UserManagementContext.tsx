import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'admin' | 'manager' | 'viewer';

export type Permission =
    | 'create_item'
    | 'edit_item'
    | 'delete_item'
    | 'view_inventory'
    | 'manage_users'
    | 'view_analytics'
    | 'edit_settings';

export type User = {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions: Permission[];
    createdAt: Date;
    isActive: boolean;
};

type UserManagementContextType = {
    users: User[];
    currentUser: User | null;
    createUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
    updateUser: (id: string, updates: Partial<User>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    hasPermission: (permission: Permission) => boolean;
    isAdmin: () => boolean;
    setCurrentUser: (userId: string) => void;
};

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

const defaultPermissions: Record<UserRole, Permission[]> = {
    admin: ['create_item', 'edit_item', 'delete_item', 'view_inventory', 'manage_users', 'view_analytics', 'edit_settings'],
    manager: ['create_item', 'edit_item', 'view_inventory', 'view_analytics', 'edit_settings'],
    viewer: ['view_inventory', 'view_analytics']
};

export function UserManagementProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUserState] = useState<User | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            saveUsers();
        }
    }, [users]);

    const loadUsers = async () => {
        try {
            const storedUsers = await AsyncStorage.getItem('app_users');
            if (storedUsers) {
                const parsed = JSON.parse(storedUsers);
                setUsers(parsed.map((u: any) => ({
                    ...u,
                    createdAt: new Date(u.createdAt)
                })));
            } else {
                // Create default admin user
                const defaultAdmin: User = {
                    id: '1',
                    email: 'admin@demo.com',
                    name: 'Admin User',
                    role: 'admin',
                    permissions: defaultPermissions.admin,
                    createdAt: new Date(),
                    isActive: true
                };
                setUsers([defaultAdmin]);
                setCurrentUserState(defaultAdmin);
            }
        } catch (error) {
            console.error('Failed to load users', error);
        }
    };

    const saveUsers = async () => {
        try {
            await AsyncStorage.setItem('app_users', JSON.stringify(users));
        } catch (error) {
            console.error('Failed to save users', error);
        }
    };

    const createUser = async (newUser: Omit<User, 'id' | 'createdAt'>) => {
        const user: User = {
            ...newUser,
            id: Date.now().toString(),
            createdAt: new Date(),
            permissions: newUser.permissions.length > 0 ? newUser.permissions : defaultPermissions[newUser.role]
        };
        setUsers(prev => [...prev, user]);
    };

    const updateUser = async (id: string, updates: Partial<User>) => {
        setUsers(prev => prev.map(user =>
            user.id === id ? { ...user, ...updates } : user
        ));

        // Update current user if it's the one being updated
        if (currentUser?.id === id) {
            setCurrentUserState(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const deleteUser = async (id: string) => {
        setUsers(prev => prev.filter(user => user.id !== id));

        // Clear current user if it's the one being deleted
        if (currentUser?.id === id) {
            setCurrentUserState(null);
        }
    };

    const hasPermission = (permission: Permission): boolean => {
        if (!currentUser) return false;
        return currentUser.permissions.includes(permission);
    };

    const isAdmin = (): boolean => {
        return currentUser?.role === 'admin';
    };

    const setCurrentUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUserState(user);
        }
    };

    return (
        <UserManagementContext.Provider value={{
            users,
            currentUser,
            createUser,
            updateUser,
            deleteUser,
            hasPermission,
            isAdmin,
            setCurrentUser
        }}>
            {children}
        </UserManagementContext.Provider>
    );
}

export function useUserManagement() {
    const context = useContext(UserManagementContext);
    if (context === undefined) {
        throw new Error('useUserManagement must be used within a UserManagementProvider');
    }
    return context;
}
