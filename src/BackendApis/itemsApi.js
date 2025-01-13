import axiosInstance from '../config/config';

export const fetchItems = async () => {
    try {
        const response = await axiosInstance.get('/items');
        return response?.data;
    } catch (error) {
        console.log('Error fetching items:', error);
        throw error;
    }
};

export const fetchItemById = async (id) => {
    try {
        const response = await axiosInstance.get(`/items/get/${id}`);
        return response.data;
    } catch (error) {
        console.log(`Error fetching item with ID ${id}:`, error);
        throw error;
    }
};

export const fetchFilterItems = async (category) => {
    try {
        let response;
        
        response = await axiosInstance.get('/items');
        const allItems = response?.data;

        if (category) {

            const filteredItems = allItems.data.filter(item => item.group === category);
            return { ...allItems, data: filteredItems };
        } else {
            console.log('No category provided, returning all items');
            return allItems;
        }

    } catch (error) {
        console.log('Error fetching items:', error);
        throw error;
    }
};

// Fetch items based on a search query
export const fetchItemsSearch = async (query) => {
    try {
        // Fetch all items
        const response = await axiosInstance.get('/items');  // Use axiosInstance here
        const items = response?.data;

        if (query) {
            const filteredItems = items.data.filter(item => 
                item.itemName.toLowerCase().includes(query.toLowerCase()) || 
                (item.subGroup1 && item.subGroup1.toLowerCase().includes(query.toLowerCase())) ||
                (item.subGroup2 && item.subGroup2.toLowerCase().includes(query.toLowerCase()))
            );
            return filteredItems;
        }

        // If no query, return all items
        return items;

    } catch (error) {
        console.log('Error fetching search results:', error);
        throw error;
    }
};
