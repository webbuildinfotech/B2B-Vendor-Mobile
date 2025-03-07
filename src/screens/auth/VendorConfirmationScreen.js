import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { cleanCart } from "../../../redux/CartReducer";
import { formatNumber } from "../../utils";
import { fetchAddress } from "../../BackendApis/userApi";
import { fetchCart } from "../../BackendApis/cartApi";
import { addOrderFirst, addOrderSecond } from "../../BackendApis/orderApi";
import { TextInput } from "react-native-paper";

const DELIVERY_TYPES = {
    TRANSPORTATION: "Transportation",
    SALES_PICKUP: "Sales Pickup",
};

const VendorConfirmationScreen = () => {
    const [cart, setCart] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const steps = [
        { title: "Address", content: "Address Form" },
        { title: "Place Order", content: "Order Summary" },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null); // Ensure default is null
    const [addresses, setAddress] = useState([]);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState(DELIVERY_TYPES.FREE); // Default Delivery Type
    const [discount, setDiscount] = useState(""); // Initialize discount as a string for TextInput
    const [finalAmount, setFinalAmount] = useState(0); // Initialize finalAmount to 0

    const total = cart
        ?.map((item) => item.product.sellingPrice * item.quantity)
        .reduce((curr, prev) => curr + prev, 0);

    const totalQuantity = cart
        ?.map((item) => item.quantity)
        .reduce((curr, prev) => curr + prev, 0);

    const calculateFinalAmount = () => {
        const discountValue = parseFloat(discount) || 0; // Convert discount to a float
        const calculatedFinalAmount = total - (total * (discountValue / 100));
        setFinalAmount(calculatedFinalAmount); // Update the finalAmount state
    };

    useEffect(() => {
        calculateFinalAmount(); // Recalculate whenever discount changes
    }, [discount]);

    const handleProceedToCheckout = () => {
        if (!selectedAddress) {
            Alert.alert("Please select an address before proceeding.");
            return;
        }
        setCurrentStep(1);
    };

    // Function to fetch address and cart data
    const getAddrsssData = async () => {
        try {
            const data = await fetchAddress(); // API call for address
            const cartDatas = await fetchCart(); // API call for cart data
            setCart(cartDatas);

            // Ensure data is an array
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                setAddress([data]); // Wrap the object in an array
            } else if (Array.isArray(data)) {
                setAddress(data);
            } else {
                console.log("Fetched data is not an array:", data);
                setAddress([]); // Reset to empty array if not valid
            }
        } catch (err) {
            console.log("Error fetching addresses:", err);
        }
    };

    // Use useFocusEffect to refresh data whenever the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            getAddrsssData(); // Call the async function
        }, [])
    );

    const handleAddToOrder = async (total, addressId, products) => {
        try {
            const response = await addOrderFirst(addressId, total, totalQuantity, discount, finalAmount, selectedDeliveryType);

            // Prepare products data for the second order API
            const orderProducts = products.map(product => ({
                productId: product.product.id,
                quantity: product.quantity
            }));
            const orderId = response.id;

            // Call the second order API
            await addOrderSecond(orderId, orderProducts);

            dispatch(cleanCart());
            navigation.navigate("Order");
        } catch (error) {
            console.log('Error placing order:', error);
        }
    };


    return (
        <ScrollView style={{ marginTop: 55 }}>
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, justifyContent: "space-between" }}>
                    {steps.map((step, index) => (
                        <View key={index} style={{ justifyContent: "center", alignItems: "center" }}>
                            {index > 0 && (
                                <View style={{ flex: 1, height: 2, backgroundColor: index <= currentStep ? "#0C68E9" : "#D0D0D0" }} />
                            )}
                            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: index <= currentStep ? "#0C68E9" : "#ccc", justifyContent: "center", alignItems: "center" }}>
                                {index < currentStep ? (
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>&#10003;</Text>
                                ) : (
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>{index + 1}</Text>
                                )}
                            </View>
                            <Text style={{ textAlign: "center", marginTop: 8 }}>{step.title}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {currentStep === 0 && (
                <View style={{ marginHorizontal: 20, paddingVertical: 15 }}>
                    <Text style={styles.headerText}>Select Delivery Address</Text>

                    <Pressable onPress={() => navigation.navigate("AddAddressScreen")} style={styles.addAddressButton}>
                        <Text style={{ fontSize: 16, color: "#0C68E9", fontWeight: "bold", }}>Add a new Address</Text>
                        <AntDesign name="pluscircleo" size={24} color="#0C68E9" />
                    </Pressable>

                    {addresses.map((item) => (
                        <Pressable
                            key={item.id}
                            style={{
                                backgroundColor: selectedAddress?.id === item.id ? "#e0f7fa" : "#f9f9f9",
                                borderWidth: 1,
                                borderColor: "#D0D0D0",
                                padding: 15,
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 7,
                                borderRadius: 8,
                                shadowColor: "#1C252E",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 2,
                            }}
                            onPress={() => setSelectedAddress(item)}
                        >
                            {selectedAddress?.id === item.id ? (
                                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                            ) : (
                                <Entypo name="circle" size={20} color="gray" />
                            )}
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.addressDetailsText}>Street Address: {item.street_address}</Text>
                                <Text style={styles.addressDetailsText}>Phone No: {item.mobile}</Text>
                                <Text style={styles.addressDetailsText}>Zip Code: {item.zip_code}</Text>
                                <Text style={styles.addressDetailsText}>State: {item.state}</Text>
                                <Text style={styles.addressDetailsText}>Country: {item.country}</Text>
                            </View>
                        </Pressable>
                    ))}

                    {/* Delivery Type Selector */}
                    <View style={styles.deliveryTypeContainer}>
                        <Text style={styles.deliveryTypeText}>Select Delivery Type:</Text>
                        {Object.values(DELIVERY_TYPES).map((type) => (
                            <Pressable
                                key={type}
                                onPress={() => setSelectedDeliveryType(type)}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: 5,
                                }}
                            >
                                {selectedDeliveryType === type ? (
                                    <FontAwesome5 name="dot-circle" size={20} color="#0C68E9" />
                                ) : (
                                    <Entypo name="circle" size={20} color="gray" />
                                )}
                                <Text style={{ marginLeft: 10, fontSize: 16 }}>{type}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable style={styles.emptyLastBox}
                        onPress={() => navigation.navigate("VendorCart")}
                    >
                        <Feather name="chevron-left" size={20} color="#1C252E" />
                        <Text style={styles.emptyLastText}>Back</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleProceedToCheckout}
                        style={styles.proceedButton}
                    >
                        <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold", }}>Proceed to Checkout</Text>
                    </Pressable>
                </View>
            )}

            {currentStep === 1 && (
                <View style={{ marginHorizontal: 20, padding: 15 }}>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    <Text style={styles.selectedAddressTitle}>Delivery Type: {selectedDeliveryType}</Text>

                    <Text style={styles.selectedAddressTitle}>Selected Address:</Text>
                    <Text style={styles.selectedAddressText}>{selectedAddress?.street_address}</Text>
                    <Text style={styles.selectedAddressText}>Phone: {selectedAddress?.mobile}</Text>
                    <Text style={styles.selectedAddressText}>{selectedAddress?.state}</Text>
                    <Text style={styles.selectedAddressText}>{selectedAddress?.country}</Text>
                    <Text style={styles.selectedAddressText}>Zip Code: {selectedAddress?.zip_code}</Text>

                    <Text style={styles.orderSummaryTitle}>Products:</Text>
                    {cart.length > 0 ? (
                        cart.map((item, index) => (
                            <View key={index} style={styles.productContainer}>
                                <Text style={styles.productText}>{item.product.itemName} (x{item.quantity})</Text>
                                <Text style={styles.productPrice}>₹ {formatNumber(item.product.sellingPrice * item.quantity)}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyCartText}>No products in the cart.</Text>
                    )}
                    <View style={styles.productContainer}>
                        <Text style={styles.orderTotalText}>Order Total: </Text>
                        <Text style={styles.totalAmount}> ₹ {formatNumber(total)}</Text>
                    </View>

                    {/* Discount Input Field */}
                    <View style={{ marginVertical: 15 }}>
                        <Text style={styles.discountLabel}>Discount (%)</Text>
                        <TextInput
                            value={discount}
                            onChangeText={(text) => {
                                // Ensure the input is a number and between 0 and 100
                                const numericValue = parseInt(text, 10); // Convert text to number
                                if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
                                    setDiscount(text); // Update state only if within range
                                } else if (text === "") {
                                    setDiscount(""); // Allow clearing the input
                                }
                            }}
                            placeholder="Enter discount percentage"
                            keyboardType="numeric"
                            style={styles.discountInput}
                        />

                    </View>

                    <View style={styles.productContainer}>
                        <Text style={styles.finalAmountLabel}>Final Amount: </Text>
                        <Text style={styles.totalAmount}> ₹ {formatNumber(finalAmount)}</Text>
                    </View>


                    <Pressable
                        onPress={() => {
                            handleAddToOrder(total, selectedAddress.id, cart);
                        }}
                        style={styles.placeOrderButton}
                    >
                        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Place your order</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    addAddressButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        paddingVertical: 7,
    },
    addressText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#181818",
    },
    addressDetailsText: {
        fontSize: 14,
        color: "#555",
    },
    proceedButton: {
        backgroundColor: "#0C68E9",
        padding: 12,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        elevation: 5,
        shadowColor: "#1C252E",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
    },
    orderSummaryTitle: {
        color: "#1C252E",
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
    },
    selectedAddressTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
    },
    selectedAddressText: {
        fontSize: 16,
    },
    orderTotalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 8,
    },
    totalAmount: {
        fontSize: 22,
        color: "#1C252E",
        fontWeight: "bold",
    },
    productContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    productText: {
        fontSize: 16,
        color: "#1C252E",
        fontWeight: "bold",

    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ff5722",
    },
    emptyCartText: {
        fontSize: 16,
        color: "#555",
        marginVertical: 10,
    },
    placeOrderButton: {
        backgroundColor: "#0C68E9",
        padding: 12,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        elevation: 5,
        shadowColor: "#1C252E",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
    },
    emptyLastBox: {
        // marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-start",
        gap: 3,

        // backgroundColor: "#fff",
        // paddingHorizontal: 15,
        paddingVertical: 5,
        // borderRadius: 5,
        borderColor: "#C0C0C0",
        // borderWidth: 0.6,
    },
    emptyLastText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1C252E',
    },

    deliveryTypeContainer: {
        marginVertical: 15,
    },
    deliveryTypeText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },

    discountLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    discountInput: {
        borderWidth: 1,
        borderColor: "#D0D0D0",
        // padding: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    finalAmountLabel: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default VendorConfirmationScreen;
