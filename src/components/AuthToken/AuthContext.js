import React, { createContext, useState, useContext } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Create the AuthProvider
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    // Function to update the token
    const updateToken = (newToken) => {
        setToken(newToken);
    };

    // Function to clear the token
    const clearToken = () => {
        setToken(null);
    };

    // Provide the context value
    return (
        <AuthContext.Provider value={{ token, updateToken, clearToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access Auth Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
