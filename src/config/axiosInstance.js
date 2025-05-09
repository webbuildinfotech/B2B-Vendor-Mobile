
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const axiosInstance = axios.create({
  // baseURL: 'https://api.rg-techno.com/',
  // baseURL: 'http://localhost:3000/'
  baseURL: 'http://192.168.29.49:3000/' // Replace with your actual IP

});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      // Set Authorization header if token exists
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type dynamically based on the request data
    if (config.data instanceof FormData) {
      // If the request data is FormData, set Content-Type to multipart/form-data
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      // Otherwise, set Content-Type to application/json
      config.headers['Content-Type'] = 'application/json';
    }

    return config; // Return the config directly
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response
  (error) => Promise.reject(error) // Handle response errors
);

export default axiosInstance;
