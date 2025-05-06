import React, { useCallback, useState } from 'react';
import { Text, View, FlatList, Alert, Pressable } from 'react-native';
import styles from './VendorShopScreenCss';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchItems } from '../../BackendApis/itemsApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MultiSelect from 'react-native-multiple-select';
import { addCart } from '../../BackendApis/cartApi';
import { Feather } from '@expo/vector-icons';
import LogoComponent from '../../components/Logo/LogoComponent';
import { useAuth } from '../../components/AuthToken/AuthContext';
import { ActivityIndicator } from 'react-native-paper';

const VendorShopScreen = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const [products, setProducts] = useState([]); // All products
    const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products to display

    const [subGroups1, setSubGroups1] = useState([]);
    const [subGroups2, setSubGroups2] = useState([]);

    const [filteredSubGroups1, setFilteredSubGroups1] = useState([]);
    const [filteredSubGroups2, setFilteredSubGroups2] = useState([]);

    const [selectedSubGroup1, setSelectedSubGroup1] = useState([]);
    const [selectedSubGroup2, setSelectedSubGroup2] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);

    const fetchItemsData = async () => {
        try {
            const data = await fetchItems(); // API call

            // Set products
            setProducts(data.data);
            setFilteredProducts(data.data); // Initially, show all products

            const uniqueSubGroups1 = Array.from(
                new Map(
                    data.data.map(item => [item.subGroup1, { id: item.subGroup1, group: item.group, subGroup1: item.subGroup1 }])
                ).values()
            );

            const uniqueSubGroups2 = Array.from(
                new Map(
                    data.data.map(item => [item.subGroup2, { id: item.subGroup2, subGroup1: item.subGroup1, subGroup2: item.subGroup2 }])
                ).values()
            );

            // Set dropdown data
            setSubGroups1(uniqueSubGroups1);
            setSubGroups2(uniqueSubGroups2);
        } catch (err) {
            console.log('Error fetching items:', err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchItemsData();
        }, [])
    );

    // Filter subGroup1 when subGroup1 is selected
    const handleSubGroup1Change = selectedSubGroup1Ids => {
        setSelectedSubGroup1(selectedSubGroup1Ids);

        const filtered = subGroups2
            .filter(sg2 => selectedSubGroup1Ids.includes(sg2.subGroup1))
            .map(sg2 => ({ id: sg2.subGroup2, name: sg2.subGroup2 }));
        setFilteredSubGroups2(filtered);

        // Reset lower level
        setSelectedSubGroup2([]);
        setSelectedProduct([]);

        // Update product display
        filterProducts(selectedSubGroup1Ids, []);
    };

    // Handle subGroup2 selection and update product display
    const handleSubGroup2Change = selectedSubGroup2Ids => {
        setSelectedSubGroup2(selectedSubGroup2Ids);
        filterProducts(selectedSubGroup1, selectedSubGroup2Ids);
    };

    // Filter products based on selections
    const filterProducts = (subGroup1, subGroup2) => {
        let filtered = products;

        if (subGroup1.length > 0) {
            filtered = filtered.filter(product => subGroup1.includes(product.subGroup1));
        }
        if (subGroup2.length > 0) {
            filtered = filtered.filter(product => subGroup2.includes(product.subGroup2));
        }

        setFilteredProducts(filtered);
    };

    const productItems = filteredProducts.map(product => ({
        id: product.id, // Use unique ID
        name: product.itemName, // Display product name in the dropdown
    }));

    // Add to Cart Function
    const addToCart = async () => {
        try {
            setLoading(true);
            const payload = {
                items: selectedProduct.map(productId => ({
                    productId,
                    quantity: 100,
                })),
            };

            const response = await addCart(payload);
            Alert.alert('Success', 'Products added to cart successfully!');
            navigation.navigate("VendorCart");

            // Clear selected states
            setSelectedSubGroup1([]);
            setFilteredSubGroups2([]);
            setSelectedSubGroup2([]);
            setSelectedProduct([]);

        } catch (error) {
            console.log('Error adding to cart:', error);
            Alert.alert('Error', 'Failed to add products to cart.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
           

            <FlatList
                style={styles.mainCard}
                ListHeaderComponent={
                    <View>
                        {/* Multi-select dropdown for SubGroup1 */}
                        <Text style={styles.label}>Select SubGroup1:</Text>
                        <View style={styles.dropdownContainer}>
                            <MultiSelect
                                items={subGroups1.map(sg1 => ({
                                    id: sg1.subGroup1,
                                    name: sg1.subGroup1,
                                }))}
                                uniqueKey="id"
                                onSelectedItemsChange={handleSubGroup1Change}
                                selectedItems={selectedSubGroup1}
                                selectText="Pick SubGroup1"
                                searchInputPlaceholderText="Search SubGroup1..."
                                tagRemoveIconColor="#ff0000"
                                tagBorderColor="#ccc"
                                tagTextColor="#333"
                                selectedItemTextColor="#007ACC"
                                selectedItemIconColor="#007ACC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#000' }}
                                submitButtonColor="#007ACC"
                                submitButtonText="Done"
                                styleDropdownMenuSubsection={styles.dropdown}
                            />
                        </View>

                        {/* Multi-select dropdown for SubGroup2 */}
                        <Text style={styles.label}>Select SubGroup2:</Text>
                        <View style={styles.dropdownContainer}>
                            <MultiSelect
                                items={filteredSubGroups2}
                                uniqueKey="id"
                                onSelectedItemsChange={handleSubGroup2Change}
                                selectedItems={selectedSubGroup2}
                                selectText="Pick SubGroup2"
                                searchInputPlaceholderText="Search SubGroup2..."
                                tagRemoveIconColor="#ff0000"
                                tagBorderColor="#ccc"
                                tagTextColor="#333"
                                selectedItemTextColor="#007ACC"
                                selectedItemIconColor="#007ACC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#000' }}
                                submitButtonColor="#007ACC"
                                submitButtonText="Done"
                                styleDropdownMenuSubsection={styles.dropdown}
                            />
                        </View>

                        {/* Multi-select dropdown for Products */}
                        <Text style={styles.label}>Select Products:</Text>
                        <View style={styles.dropdownContainer}>
                            <MultiSelect
                                items={productItems}
                                uniqueKey="id"
                                onSelectedItemsChange={setSelectedProduct}
                                selectedItems={selectedProduct}
                                selectText="Pick Products"
                                searchInputPlaceholderText="Search Products..."
                                tagRemoveIconColor="#ff0000"
                                tagBorderColor="#ccc"
                                tagTextColor="#333"
                                selectedItemTextColor="#007ACC"
                                selectedItemIconColor="#007ACC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#000' }}
                                submitButtonColor="#007ACC"
                                submitButtonText="Done"
                                styleDropdownMenuSubsection={styles.dropdown}
                            />
                        </View>
                    </View>
                }
            />
            <View style={styles.mainCard}>
                {loading ? (
                    <ActivityIndicator size="large" color="#fe0002" />
                ) : (
                    <View style={[
                        styles.cartButton,
                        {
                            backgroundColor: selectedProduct.length === 0 ? "#db3a41" : "#fe0002",
                        }
                    ]}>
                        <Pressable
                            disabled={selectedProduct.length === 0}
                            onPress={addToCart}
                        >
                            <Text style={styles.byeNowText}>Add to Cart</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
};

export default VendorShopScreen;
