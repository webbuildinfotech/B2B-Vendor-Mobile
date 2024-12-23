import axiosInstance from '../config/config';  // Correct import path for axiosInstance

// Function to add a contact message
export const addContactUs = async (data) => {
    try {
        const response = await axiosInstance.post('/contact/create', data);  // Use axiosInstance to post
        return response.data;  // Return the data from response
    } catch (error) {
        console.error('Error adding contact message:', error);
        throw error;  // Re-throw the error for further handling
    }
};


export const getContactMessage = async () => {    
    try {
        const response = await axiosInstance.get(`/contact`); // Use axiosInstance directly
        
        return response.data; // Return the data from response
    } catch (error) {
        console.error(`Error fetching Cart Data:`, error);
        throw error; // Re-throw the error for further handling
    }
};
