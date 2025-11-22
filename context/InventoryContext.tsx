import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type InventoryItem = {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    category: string;
};

type InventoryContextType = {
    items: InventoryItem[];
    addItem: (item: Omit<InventoryItem, 'id'>) => void;
    deleteItem: (id: string) => void;
    updateItem: (id: string, item: Partial<InventoryItem>) => void;
    isLoading: boolean;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        saveItems(items);
    }, [items]);

    const loadItems = async () => {
        try {
            const storedItems = await AsyncStorage.getItem('inventory_items');
            if (storedItems) {
                setItems(JSON.parse(storedItems));
            }
        } catch (error) {
            console.error('Failed to load items', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveItems = async (newItems: InventoryItem[]) => {
        try {
            await AsyncStorage.setItem('inventory_items', JSON.stringify(newItems));
        } catch (error) {
            console.error('Failed to save items', error);
        }
    };

    const addItem = (newItem: Omit<InventoryItem, 'id'>) => {
        const item: InventoryItem = {
            ...newItem,
            id: Date.now().toString(), // Simple ID generation
        };
        setItems((prev) => [item, ...prev]);
    };

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateItem = (id: string, updatedFields: Partial<InventoryItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
        );
    };

    return (
        <InventoryContext.Provider value={{ items, addItem, deleteItem, updateItem, isLoading }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
}
