import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../components/AuthToken/AuthContext';
import styles from './SettingCss';

const SettingScreen = ({ navigation }) => {
    const { token } = useAuth(); 

    return (
        <SafeAreaView style={styles.heroContainer}>
            <ScrollView style={styles.scrollView}>
              

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
