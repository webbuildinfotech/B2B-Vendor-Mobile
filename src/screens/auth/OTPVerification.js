import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, StyleSheet, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../../../redux/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { authLogin } from '../../BackendApis/authApi';
import { useAuth } from '../../components/AuthToken/AuthContext';

const OTPVerification = ({ route, navigation }) => {
    const { updateToken } = useAuth();
    const { email } = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']); 
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [resendDisabled, setResendDisabled] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        if (timer > 0) {
            const timerId = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else {
            setResendDisabled(false);
        }
    }, [timer]);

    // Utility function to mask email
    const maskEmail = (email) => {
        const [localPart, domainPart] = email.split('@');
        const maskedLocalPart = localPart.slice(0, 3) + '*'.repeat(localPart.length - 3);
        return `${maskedLocalPart}@${domainPart}`;
    };

    const handleVerifyOTP = async () => {
        const ValidOtp = otp.join('');
        if (ValidOtp.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Input Error',
                text2: 'OTP is required.',
            });
            return;
        }
        Keyboard.dismiss();
        
        setLoading(true);
        const contact = email;
        try {
            const response = await authLogin(contact, ValidOtp);

            const { token, user } = response;

            await AsyncStorage.setItem("authToken", token);
            await AsyncStorage.setItem("userId", user.id);
            await AsyncStorage.setItem("userData", JSON.stringify(user));
            dispatch(setUser(user));
            updateToken(token);
            Toast.show({
                type: 'success',
                text1: 'Verification Successful',
                text2: 'Your OTP has been verified successfully.',
            });

            navigation.navigate('MainTabs', {
                screen: 'Home',
            });

        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Verification Error',
                text2: 'Enter Correct OTP.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value, index) => {
        if (value.length <= 1) {
            const updatedOtp = [...otp];
            updatedOtp[index] = value;
            setOtp(updatedOtp);

            if (value !== '' && index < otp.length - 1) {
                inputs[index + 1].focus();
            }
        }
    };

    const handleKeyPress = (event, index) => {
        if (event.nativeEvent.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                inputs[index - 1].focus();
                const updatedOtp = [...otp];
                updatedOtp[index - 1] = '';
                setOtp(updatedOtp);
            }
        }
    };

    const inputs = [];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to {maskEmail(email)}</Text>

            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputs[index] = ref)}
                        style={styles.otpBox}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={value}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(event) => handleKeyPress(event, index)}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.verifyButtonText}>Verify OTP</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#F9F9F9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    otpBox: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#fff',
    },
    verifyButton: {
        backgroundColor: "#fe0002",
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendButton: {
        marginTop: 20,
    },
    resendText: {
        color: '#007BFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default OTPVerification;
