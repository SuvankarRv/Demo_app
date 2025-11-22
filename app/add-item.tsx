import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';

import { useInventory } from '@/context/InventoryContext';

export default function AddItemScreen() {
    const { addItem } = useInventory();
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');

    const handleSave = () => {
        if (!name || !price) return; // Basic validation

        addItem({
            name,
            sku,
            quantity: parseInt(quantity) || 0,
            price: parseFloat(price) || 0,
            category,
        });
        router.back();
    };

    return (
        <View className="flex-1 bg-gray-100">
            <StatusBar style="light" />
            <View className="p-4">
                <Text className="text-2xl font-bold text-gray-800 mb-6">Add New Item</Text>

                <ScrollView className="space-y-4">
                    <View>
                        <Text className="text-gray-600 mb-1 font-medium">Item Name</Text>
                        <TextInput
                            className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                            placeholder="e.g. Wireless Mouse"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-1 font-medium">SKU</Text>
                        <TextInput
                            className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                            placeholder="e.g. WM-002"
                            value={sku}
                            onChangeText={setSku}
                        />
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-gray-600 mb-1 font-medium">Quantity</Text>
                            <TextInput
                                className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                                placeholder="0"
                                keyboardType="numeric"
                                value={quantity}
                                onChangeText={setQuantity}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-600 mb-1 font-medium">Price</Text>
                            <TextInput
                                className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-1 font-medium">Category</Text>
                        <TextInput
                            className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                            placeholder="e.g. Electronics"
                            value={category}
                            onChangeText={setCategory}
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-blue-600 p-4 rounded-xl items-center mt-6 active:bg-blue-700"
                        onPress={handleSave}
                    >
                        <Text className="text-white font-bold text-lg">Save Item</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="p-4 rounded-xl items-center"
                        onPress={() => router.back()}
                    >
                        <Text className="text-gray-500 font-medium">Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}
