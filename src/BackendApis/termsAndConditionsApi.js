import axiosInstance from '../config/config';  // Import axiosInstance from the config

export const fetchTermsAndConditions = async () => {
    try {
        const response = await axiosInstance.get('/terms-conditions');  // Use axiosInstance for the request
        return response?.data;
    } catch (error) {
        console.error('Error fetching TermsAndConditions:', error);
        throw error;  // Re-throw the error for further handling
    }
};
