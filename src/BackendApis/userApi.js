// src/BackendApis/authApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../config/axiosInstance';


export const addVendorAddress = async (AddressData) => {
    try {
        const response = await axiosInstance.post(`/addresses/create`, AddressData);
        return response.data;
    } catch (error) {
        console.log(`Error Add Address Data:`, error);
        throw error;
    }
};

export const fetchAddress = async () => {
    try {
        const response = await axiosInstance.get(`/addresses`);
        return response.data;
    } catch (error) {
        console.log(`Error fetching Address Data:`, error);
        throw error;
    }
};

export const fetchUserData = async () => {
    try {
        const response = await axiosInstance.get(`/users`);
        return response.data;
    } catch (error) {
        console.log(`Error fetching User Data:`, error);
        throw error;
    }
};

export const fetchUserDataById = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.log(`Error fetching User Data:`, error);
        throw error;
    }
};

export const authLogout = async (clearContext) => {
    try {
       
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userData');


       
        if (clearContext) {
            clearContext();
        }

        return { success: true };
    } catch (error) {
        console.log('Error during logout:', error);
        return { success: false, error: error.message };
    }
};
