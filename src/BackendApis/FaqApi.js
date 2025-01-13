import axiosInstance from '../config/config';

export const fetchFaq = async () => {
    try {
        const response = await axiosInstance.get('/faq');
        return response?.data;
    } catch (error) {
        console.log('Error fetching Faq:', error);
        throw error;
    }
};
