
import axios from 'axios';
// const baseURL = 'http://localhost:3000'; 

const baseURL = 'http://192.168.29.49:3000'; // Replace with your actual IP

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
