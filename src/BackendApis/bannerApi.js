import axiosInstance from '../config/config';

export const fetchBanner = async () => {
    try {
        // Correct the syntax for string interpolation and use axiosInstance
        const response = await axiosInstance.get(`/banner/all`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching Banner:', error);
        throw error;
    }
};
