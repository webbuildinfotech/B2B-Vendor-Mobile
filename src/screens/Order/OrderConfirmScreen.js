import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { resetProductAndAddress } from '../../../redux/productAndAddressReducer';
import { cleanCart } from '../../../redux/CartReducer';
import { useNavigation } from '@react-navigation/native';
// import GeneratePDF from './GeneratePDF';

const OrderConfirmScreen = () => {
    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const address = useSelector((state) => state.productAndAddress.address);

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirmOrder = () => {
        setLoading(true);
        // Simulating an API call for order confirmation
        setTimeout(() => {
            setLoading(false);
            setModalVisible(false);

            // Prepare OrderProduct array with relevant data from cart items
            const orderProducts = cart.map((item) => {
                return {
                    ProductName: item.itemName,
                    group: item.group,
                    subGroup1: item.subGroup1,
                    subGroup2: item.subGroup2,
                    SellingPrice: item.sellingPrice,
                    Quantity: item.quantity,
                    id: item.id, // Assuming each item has an 'id' field
                };
            });

            // Extract the required data
            const extractedData = {

                orderProducts,
                address: {
                    StreetAddress: address.street_address,
                    State: address.state,
                    Country: address.country,
                    ZipCode: address.zip_code,
                    PhoneNumber: address.mobile,
                },
            };

            // Convert to JSON string
            const jsonData = JSON.stringify(extractedData, null, 2);

            // <GeneratePDF orderProducts={orderProducts} address={extractedData.address} />;
            dispatch(resetProductAndAddress());
            dispatch(cleanCart());
            navigation.navigate('Order');
        }, 2000);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Order Confirmation</Text>

            <View style={styles.card}>
                <Text style={styles.header}>Product Details:</Text>
                {cart.length > 0 ? (
                    cart.map((item, index) => (
                        <View>
                            <View key={index} style={styles.carad}>
                                <View style={styles.detailsContainer}>
                                    <Text style={styles.detail}>
                                        <MaterialIcons name="label" size={16} color="#555" /> Name: {item.itemName}
                                    </Text>
                                    <Text style={styles.detail}>
                                        <MaterialIcons name="info" size={16} color="#555" /> Category: {item.subGroup1}
                                    </Text>
                                    <Text style={styles.detail}>
                                        <MaterialIcons name="info" size={16} color="#555" /> Sub Category: {item.subGroup2}
                                    </Text>
                                    <Text style={styles.detail}>
                                        <MaterialIcons name="monetization-on" size={16} color="#555" /> Quantity: {item.quantity}
                                    </Text>
                                    <Text style={styles.price}>
                                        <MaterialIcons name="attach-money" size={16} color="#555" /> Price: ₹{item.sellingPrice}
                                    </Text>
                                </View>
                            </View>

                            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 16 }} />
                        </View>
                    ))
                ) : (
                    <Text style={styles.errorText}>No products in the cart.</Text>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.header}>Shipping Address:</Text>
                {address ? (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detail}>
                            <FontAwesome name="user" size={16} color="#555" /> Name: {address.name}
                        </Text>
                        <Text style={styles.detail}>
                            <FontAwesome name="map-marker" size={16} color="#555" /> Street Address: {address.street_address}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="public" size={16} color="#555" /> Country: {address.country}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="public" size={16} color="#555" /> State: {address.state}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="email" size={16} color="#555" /> Zip Code: {address.zip_code}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialIcons name="phone" size={16} color="#555" /> Mobile No: {address.mobile}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.errorText}>No address available.</Text>
                )}
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Confirm Order</Text>
            </TouchableOpacity>

            {/* Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to confirm the order?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleConfirmOrder}>
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Loading Indicator */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Processing your order...</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#444',
    },
    detailsContainer: {
        marginVertical: 10,
    },
    detail: {
        fontSize: 16,
        marginVertical: 5,
        color: '#555',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#D32F2F', // Red color for price
    },
    errorText: {
        color: 'red',
        fontStyle: 'italic',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    modalButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        width: '40%',
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
    },
});

export default OrderConfirmScreen;
