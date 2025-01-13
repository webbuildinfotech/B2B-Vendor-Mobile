import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Network from 'expo-network';
// import { useSelector } from 'react-redux';
import HomeScreen from '../src/screens/Home/HomeScreen';
// import CartScreen from '../src/screens/products/CartScreen';
import AddressScreen from '../src/screens/auth/AddressScreen';
import AddAddressScreen from '../src/screens/auth/AddAddressScreen';
import ConfirmationScreen from '../src/screens/auth/ConfirmationScreen';
import OrderScreen from '../src/screens/products/OrderScreen';
import ProfileScreen from '../src/screens/auth/ProfileScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import ProductInfoScreen from '../src/screens/products/ProductInfoScreen';
import OTPVerification from '../src/screens/auth/OTPVerification';
import NoInternetScreen from '../src/screens/NoInternet/NoInternetScreen';
import VendorHomeScreen from '../src/screens/Vendor/VendorHomeScreen';
import { fetchCart } from '../src/BackendApis/cartApi';
import ShopScreen from '../src/screens/products/ShopScreen';
import ContactUsScreen from '../src/screens/ContactUs/ContactUsScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import OrderConfirmScreen from '../src/screens/Order/OrderConfirmScreen';
import SettingScreen from '../src/screens/Setting/SettingScreen';
import TermsAndConditionsScreen from '../src/screens/TermsAndConditions/TermsAndConditionsScreen';
import VendorShopScreen from '../src/screens/products/VendorShopScreen';
import CartScreen from '../src/screens/products/CartScreen';
import VendorConfirmationScreen from '../src/screens/auth/VendorConfirmationScreen';
import { useAuth } from '../src/components/AuthToken/AuthContext';
import CustomerCartScreen from '../src/screens/products/CustomerCartScreen';
import CategoryScreen from '../src/screens/products/CategoryScreen';
import SubCategoryScreen from '../src/screens/products/SubCategoryScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import MapScreen from '../src/screens/Map/MapScreen';
import FaqScreen from '../src/screens/Faq/FaqScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CategoryScreen"
                component={CategoryScreen}
                options={{
                    headerShown: false,
                    title: "Categories",
                    headerBackTitle: "Back",
                }}
            />
            <Stack.Screen
                name="SubCategoryScreen"
                component={SubCategoryScreen}
                options={{
                    headerShown: false,
                    title: "Subcategories",
                    headerBackTitle: "Back",
                }}
            />

        </Stack.Navigator>
    );
}


function AuthStack() {
    const { token } = useAuth();
    return (
        <Stack.Navigator>
            {/*
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
            */}

            {token ? (
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ headerShown: false }}
                />
            ) : (
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
            )}

        </Stack.Navigator>
    );
}

function BottomTabs() {
    const { token } = useAuth();

    return (
        <Tab.Navigator>
            {/* Home Tab */}
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarLabel: "Home",
                    tabBarLabelStyle: { color: "#000", fontWeight: "700", marginBottom: 7 },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="home" size={26} color="#fe0002" />
                        ) : (
                            <Ionicons name="home-outline" size={26} color="#fe0002" />
                        ),
                }}
            />

            <Tab.Screen
                name="Shop"
                component={ShopStack}
                options={{
                    tabBarLabel: "Products",
                    tabBarLabelStyle: { color: "#000", fontWeight: "700", marginBottom: 7 },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="storefront-sharp" size={26} color="#fe0002" />
                        ) : (
                            <Ionicons name="storefront-outline" size={26} color="#fe0002" />
                        ),
                }}
            />

            {/* Auth Tab */}
            <Tab.Screen
                name="Auth"
                component={AuthStack}
                options={{
                    tabBarLabel: token ? "Profile" : "Login",
                    tabBarLabelStyle: { color: "#000", fontWeight: "700", marginBottom: 7 },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <FontAwesome5 name="user-alt" size={26} color="#fe0002" />
                        ) : (
                            <FontAwesome5 name="user" size={26} color="#fe0002" />
                        ),
                }}
            />

            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarLabel: "Dealers",
                    tabBarLabelStyle: { color: "#000", fontWeight: "700", marginBottom: 7 },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="location" size={26} color="#fe0002" />
                        ) : (
                            <Ionicons name="location-outline" size={26} color="#fe0002" />
                        ),
                }}
            />

            {/* Setting Tab */}
            <Tab.Screen
                name="Setting"
                component={SettingStack}
                options={{
                    tabBarLabel: "About",
                    tabBarLabelStyle: { color: "#000", fontWeight: "700", marginBottom: 7 },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="settings" size={26} color="#fe0002" />
                        ) : (
                            <Ionicons name="settings-outline" size={26} color="#fe0002" />
                        ),
                }}
            />
        </Tab.Navigator>
    );
}



function ShopStack() {
    const { token } = useAuth(); // Get token from your auth context

    return (
        <Stack.Navigator>
            {/* Conditionally set the initial screen */}
            {token ? (
                <Stack.Screen
                    name="VendorShop"
                    component={VendorShopScreen}
                    options={{ headerShown: false }}
                />
            ) : (
                <Stack.Screen
                    name="ShopScreen"
                    component={ShopScreen}
                    options={{ headerShown: false }}
                />
            )}
            

            {/* Shared Screens */}
            <Stack.Screen
                name="Info"
                component={ProductInfoScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CategoryScreen"
                component={CategoryScreen}
                options={{
                    headerShown: false,
                    title: "Categories",
                    headerBackTitle: "Back",
                }}
            />
            <Stack.Screen
                name="SubCategoryScreen"
                component={SubCategoryScreen}
                options={{
                    headerShown: false,
                    title: "Subcategories",
                    headerBackTitle: "Back",
                }}
            />
        </Stack.Navigator>
    );
}


function SettingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SettingScreen"
                component={SettingScreen}
                options={{
                    headerShown: false,
                    title: "Settings",
                }}
            />
            <Stack.Screen
                name="ContactUs"
                component={ContactUsScreen}
                options={{
                    headerShown: false,
                    title: "Contact Us",
                    headerBackTitle: "Back",
                }}
            />
            <Stack.Screen
                name="TermsAndConditions"
                component={TermsAndConditionsScreen}
                options={{
                    headerShown: false,
                    title: "Terms And Conditions",
                    headerBackTitle: "Back",
                }}
            />
            <Stack.Screen
                name="Faq"
                component={FaqScreen}
                options={{
                    headerShown: true,
                    title: "Frequently Asked Questions",
                    headerBackTitle: "Back",
                }}
            />
        </Stack.Navigator>
    );
}


export default function App() {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const checkNetwork = async () => {
            const networkState = await Network.getNetworkStateAsync();
            setIsConnected(networkState.isConnected);
        };
        checkNetwork();
    }, []);

    if (!isConnected) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="NoInternet"
                        component={NoInternetScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={BottomTabs}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                        title: "Login",
                    }}
                />

                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{
                        headerShown: true,
                        title: "Register",
                    }}
                />
                <Stack.Screen
                    name="OTPVerification"
                    component={OTPVerification}
                    options={{
                        headerShown: true,
                        title: "OTP Verification",
                    }}
                />
                <Stack.Screen
                    name="VendorConfirmation"
                    component={VendorConfirmationScreen}
                    options={{
                        headerShown: true,
                        title: "Vendor Confirmation",
                    }}
                />

                <Stack.Screen
                    name="VendorCart"
                    component={CartScreen}
                    options={{ headerShown: true }}
                />
                <Stack.Screen
                    name="CustomerCart"
                    component={CustomerCartScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Order"
                    component={OrderScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OrderConfirm"
                    component={OrderConfirmScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="VendorConfirm"
                    component={VendorConfirmationScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Confirm"
                    component={ConfirmationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddAddress"
                    component={AddressScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddAddressScreen"
                    component={AddAddressScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 20,
        minHeight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
