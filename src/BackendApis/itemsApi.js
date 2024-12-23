import axiosInstance from '../config/config';  // Use the axios instance from the config file

// Fetch all items
export const fetchItems = async () => {
    try {
        const response = await axiosInstance.get('/items');  // Use axiosInstance here
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

// Fetch a single item by ID
export const fetchItemById = async (id) => {
    try {
        const response = await axiosInstance.get(`/items/get/${id}`);  // Use axiosInstance here
        return response.data;
    } catch (error) {
        console.error(`Error fetching item with ID ${id}:`, error);
        throw error;
    }
};

// Fetch items filtered by category
export const fetchFilterItems = async (category) => {
    try {
        let response;
        
        // Fetch all items from the backend
        response = await axiosInstance.get('/items');  // Use axiosInstance here
        const allItems = response?.data;

        // If a category is provided, filter the items based on the category
        if (category) {

            // Filter items whose group matches the provided category
            const filteredItems = allItems.data.filter(item => item.group === category);
            return { ...allItems, data: filteredItems };  // Return the filtered items
        } else {
            console.log('No category provided, returning all items');
            return allItems;  // Return all items if no category is provided
        }

    } catch (error) {
        console.error('Error fetching items:', error);
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
        console.error('Error fetching search results:', error);
        throw error;
    }
};
