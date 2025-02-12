import axios from 'axios';
// import { API_URL_SECONDARY, API_URL_PRIMARY } from '@env';

const BASE_URL = 'https://api.rg-techno.com';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authVerify = async (contact) => {
    try {
        const response = await axiosInstance.post('/auth/verify-otp', { contact });
        return response?.data;
    } catch (error) {
        console.log('Error verifying OTP:', error?.response?.data || error.message);
        throw error;
    }
};

export const authLogin = async (contact, otp) => {
    try {
        const response = await axiosInstance.post('/auth/login', { contact, otp });

        // Ensure your backend returns the correct structure
        const token = response?.data?.access_token; // Ensure this is correct
        const user = response?.data?.user; // Adjust if the user data structure is different
        return { success: true, user, token }; // Return user and token
    } catch (error) {
        console.log('Error during login:', error?.response?.data || error.message);
        throw error; // This will propagate the error to the calling function
    }
};

