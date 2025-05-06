import React, { useCallback, useState } from 'react';
import { Text, View, Button, FlatList, Alert, Pressable } from 'react-native';
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
import DropDownPicker from 'react-native-dropdown-picker';
import LoadingComponent from '../../components/Loading/LoadingComponent';

const VendorShopScreen = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingComponent, setLoadingComponent] = useState(false);

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


    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const fetchItemsData = async () => {
        try {

            setLoadingComponent(true);
            const data = await fetchItems();

            // Set products
            setProducts(data.data);
            setFilteredProducts(data.data); // Initially, show all products

            const uniqueSubGroups1 = Array.from(
                new Map(
                    data.data.map(item => [
                        item.subGroup1,
                        {
                            id: item.subGroup1,
                            group: item.group,
                            subGroup1: item.subGroup1,
                            label: item.subGroup1,
                            value: item.subGroup1
                        }
                    ])
                ).values()
            )
                .sort((a, b) => a.subGroup1.localeCompare(b.subGroup1));

            const uniqueSubGroups2 = Array.from(
                new Map(
                    data.data.map(item => [item.subGroup2, { id: item.subGroup2, subGroup1: item.subGroup1, subGroup2: item.subGroup2, label: item.subGroup2, value: item.subGroup2 }])
                ).values()
            );

            // Set dropdown data
            setSubGroups1(uniqueSubGroups1);
            setSubGroups2(uniqueSubGroups2);

            setLoadingComponent(false);
        } catch (err) {
            setLoadingComponent(false);
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
        console.log("selectedSubGroup1Ids :", selectedSubGroup1Ids);

        setSelectedSubGroup1(selectedSubGroup1Ids);

        const filtered = subGroups2
            .filter(sg2 => selectedSubGroup1Ids.includes(sg2.subGroup1))  // Filter subGroups2 based on selectedSubGroup1Ids
            .map(sg2 => ({
                id: sg2.subGroup2,
                name: sg2.subGroup2,
                label: sg2.subGroup2,
                value: sg2.subGroup2
            }))
            .sort((a, b) => a.name.localeCompare(b.name));  // Sorting in ascending order based on `name` (subGroup2)

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

    const productItems = filteredProducts
        .map(product => ({
            id: product.id,
            name: product.itemName,
            label: product.itemName,
            value: product.id
        }))
        .sort((a, b) => a.name.localeCompare(b.name));  // Sorting in ascending order based on `name` (itemName)


    // Add to Cart Function
    const addToCart = async () => {
        try {
            setLoading(true);
            const payload = {
                items: selectedProduct.map(productId => ({
                    productId,
                    quantity: 1,
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

    // const handleClearAll = () => {
    //     console.log('====================================');
    //     console.log("ddddddddd");
    //     console.log('====================================');
    //     setValue([])
    // };
    
      if (loadingComponent) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><LoadingComponent /></View>;
      }
    
    return (
        <SafeAreaView style={styles.container}>
        

            <View style={{
                marginTop: 20,
                paddingHorizontal: 15
            }}>

                <Text style={styles.label}>Select Category:</Text>
                <DropDownPicker
                    zIndex={3000}
                    zIndexInverse={1000}
                    open={open}
                    value={selectedSubGroup1}
                    items={subGroups1}
                    setOpen={setOpen}
                    setValue={setSelectedSubGroup1}
                    onChangeValue={handleSubGroup1Change}
                    autoScroll
                    multiple={true}
                    mode="BADGE"
                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                />
            </View>

            <View style={{
                paddingHorizontal: 15
            }}>
                <Text style={styles.label}>Select SubCategory:</Text>
                <DropDownPicker
                    zIndex={2000}
                    zIndexInverse={2000}
                    open={open2}
                    value={selectedSubGroup2}
                    items={filteredSubGroups2}
                    setOpen={setOpen2}
                    setValue={setSelectedSubGroup2}
                    onChangeValue={handleSubGroup2Change}
                    autoScroll

                    multiple={true}
                    mode="BADGE"
                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                />

            </View>

            <View style={{
                paddingHorizontal: 15
            }}>
                <Text style={styles.label}>Select Product:</Text>
                <DropDownPicker
                    zIndex={1000}
                    zIndexInverse={3000}
                    open={open3}
                    value={selectedProduct}
                    items={productItems}
                    setOpen={setOpen3}
                    setValue={setSelectedProduct}
                    autoScroll

                    multiple={true}
                    mode="BADGE"
                    badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                />

            </View>


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
        </SafeAreaView>
    );
};

export default VendorShopScreen;
