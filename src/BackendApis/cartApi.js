// src/BackendApis/cartApi.js

import axiosInstance from '../config/axiosInstance';

export const addCart = async (Itemdata) => {
    try {
        const response = await axiosInstance.post('/cart/add', Itemdata);
        return response.data;
    } catch (error) {
        console.log('Error adding to cart:', error);
        throw error;
    }
};


// Fetch a single item by ID 
export const fetchCart = async () => {    
    try {
        const response = await axiosInstance.get(`/cart`);
        return response.data;
    } catch (error) {
        console.log(`Error fetching Cart Data:`, error);
        throw error;
    }
};


export const addQuantity = async (parameter) => {
    try {
        const response = await axiosInstance.put(`/cart/updateQuantity/${parameter.id}`, parameter);
        return true;
    } catch (error) {
        console.log("Error updating quantity:", error?.response?.data || error.message);
        console.log("Full Error Object:", error?.response?.data);
        return false; // Return false for any errors
    }
};



// Increase item quantity
export const increaseQuantity = async (id) => {
    try {
        await axiosInstance.patch(`/cart/increment/${id}`);
        return true;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to increase quantity.';
        console.log('Error increasing quantity:', error);
        throw error;
    }
};

export const decreaseQuantity = async (id) => {
    try {
        await axiosInstance.patch(`/cart/decrement/${id}`);
        return true;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to decrease quantity.';
        console.log('Error decreasing quantity:', error);
        throw error;
    }
};

export const deleteCartItem = async (id) => {
    try {
        const response = await axiosInstance.delete(`/cart/delete/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to delete cart item.';
        console.log('Error deleting cart item:', error);
        throw error;
    }
};