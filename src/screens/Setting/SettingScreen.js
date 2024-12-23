import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../components/AuthToken/AuthContext';
import styles from './SettingCss';
import LogoComponent from '../../components/Logo/LogoComponent';
import { Feather } from '@expo/vector-icons';

const SettingScreen = ({ navigation }) => {
    const { token, clearToken } = useAuth(); // Get token and clearToken from context
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            // Clear AsyncStorage
            await AsyncStorage.multiRemove(['authToken', 'userId', 'userData']);

            // Clear Context Token
            clearToken();

            // Add 5-second delay before navigating to Home
            setTimeout(() => {
                setIsLoggingOut(false);
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    })
                );
            }, 5000); // 5-second delay
        } catch (error) {
            console.error('Error during logout:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <SafeAreaView style={styles.heroContainer}>
            <ScrollView style={styles.scrollView}>
                {/* Logo Section */}
                <View style={styles.LogoContainer}>
                    <LogoComponent />
                    <Feather
                        name="shopping-cart"
                        size={24}
                        color="#fff"
                        onPress={() => {
                            if (token) {
                              // If token is present, navigate to 'VendorCart'
                              navigation.navigate('VendorCart');
                            } else {
                              // If no token, navigate to 'CustomerCart'
                              navigation.navigate('CustomerCart');
                            }
                          }}
                        // onPress={() => navigation.navigate('CustomerCart')}
                        style={styles.cartIcon}
                    />
                </View>

                {/* Main Options */}
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.enhancedButton}
                        onPress={() => navigation.navigate('ContactUs')}
                    >
                        <Text style={styles.enhancedButtonText}>Contact Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.enhancedButton}
                        onPress={() => navigation.navigate('TermsAndConditions')}
                    >
                        <Text style={styles.enhancedButtonText}>Terms and Conditions</Text>
                    </TouchableOpacity>

                    {/* Conditional Rendering for Login or Logout Button */}
                    {token ? (
                        <Pressable
                            style={styles.enhancedButton}
                            onPress={handleLogout}
                            disabled={isLoggingOut}
                        >
                            <Text style={styles.enhancedButtonText}>
                                {isLoggingOut ? 'Logging Out...' : 'Vendor Logout'}
                            </Text>
                        </Pressable>
                    ) : (
                        <TouchableOpacity
                            style={styles.enhancedButton}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.enhancedButtonText}>Vendor Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingScreen;
