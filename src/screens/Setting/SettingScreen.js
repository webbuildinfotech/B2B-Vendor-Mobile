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
    const { token } = useAuth(); 

    return (
        <SafeAreaView style={styles.heroContainer}>
            <ScrollView style={styles.scrollView}>
                <View>
                    <LogoComponent />
                    <Feather
                        name="shopping-cart"
                        size={24}
                        color="#fff" onPress={() => {
                            if (token) {
                                navigation.navigate('VendorCart', {
                                    PreviousRoute: 'SettingScreen',
                                });

                            } else {
                                navigation.navigate('CustomerCart', {
                                    PreviousRoute: 'SettingScreen',
                                });
                            }
                        }}
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

                    <TouchableOpacity
                        style={styles.enhancedButton}
                        onPress={() => navigation.navigate('Faq')}
                    >
                        <Text style={styles.enhancedButtonText}>Faq's</Text>
                    </TouchableOpacity>

                  
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingScreen;
