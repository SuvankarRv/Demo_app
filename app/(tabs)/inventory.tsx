import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { useState } from 'react';

import { useInventory } from '@/context/InventoryContext';

export default function InventoryScreen() {
    const { items, deleteItem } = useInventory();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter items based on search query
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteItem = (id: string, name: string) => {
        Alert.alert(
            'Delete Item',
            `Are you sure you want to delete "${name}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteItem(id)
                }
            ]
        );
    };

    const handleEditItem = (id: string) => {
        router.push(`/edit-item?id=${id}`);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar style="dark" />
            <View className="p-4 flex-1">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-gray-800">Inventory</Text>
                    <TouchableOpacity
                        className="bg-blue-600 p-2 rounded-full"
                        onPress={() => router.push('/add-item')}
                    >
                        <IconSymbol name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="bg-white p-3 rounded-xl shadow-sm mb-4 flex-row items-center gap-2">
                    <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search items..."
                        className="flex-1 text-gray-800"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Inventory List */}
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row justify-between items-center">
                            <View>
                                <Text className="font-semibold text-gray-800 text-lg">{item.name}</Text>
                                <Text className="text-gray-500 text-sm">SKU: {item.sku}</Text>
                                <View className="flex-row gap-2 mt-1">
                                    <Text className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{item.category}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="font-bold text-lg text-blue-600">${item.price}</Text>
                                <Text className={`text-sm ${item.quantity < 10 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                    Qty: {item.quantity}
                                </Text>
                                <View className="flex-row gap-2 mt-2">
                                    <TouchableOpacity
                                        onPress={() => handleEditItem(item.id)}
                                    >
                                        <IconSymbol name="pencil" size={20} color="#3B82F6" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteItem(item.id, item.name)}
                                    >
                                        <IconSymbol name="trash" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-10">
                            <Text className="text-gray-500">
                                {searchQuery ? 'No items match your search.' : 'No items yet. Add one!'}
                            </Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}
