// src/config/config.js
import axios from 'axios';
// import { API_URL_SECONDARY } from '@env';

// Use your local IP address or your actual server URL
const baseURL = 'https://api.rg-techno.com'; // Adjust based on your network

// console.log('API_URL_SECONDARY :', API_URL_SECONDARY);
const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Export the axios instance
export default axiosInstance;
