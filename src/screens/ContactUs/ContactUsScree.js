import { StyleSheet, Text, View, ScrollView, ImageBackground, RefreshControl, useWindowDimensions } from 'react-native';
import React, { useCallback, useState } from 'react';
import { getContactMessage } from '../../BackendApis/contactUsApi';
import RenderHTML from 'react-native-render-html';
import { useFocusEffect } from '@react-navigation/native';
import LoadingComponent from '../../components/Loading/LoadingComponent';

const ContactUsScreen = () => {
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [contactUsData, setContactUsData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const { width } = useWindowDimensions(); // Get screen width for HTML rendering

    // Function to fetch terms and conditions
    const getContactUsData = async () => {
        setLoading(true);
        try {
            const data = await getContactMessage(); // Ensure this API returns data in the expected format
            setContactUsData(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch Contact Us Message');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the screen is focused
    useFocusEffect(
        useCallback(() => {
            getContactUsData();
        }, [])
    );

    // Pull-to-refresh functionality
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getContactUsData();
        setRefreshing(false);
    }, []);



    return (
        <ScrollView style={styles.main}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <ImageBackground
                source={require('../../assets/images/contactUs.webp')}
                style={styles.headerBackground}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.headerText}>Contact Us</Text>
                </View>
            </ImageBackground>

            <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <LoadingComponent/>
                // <ActivityIndicator size="large" color="#fe0002" style={styles.loadingIndicator} />
            ) : (
                <ScrollView
                    // contentContainerStyle={styles.container}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : contactUsData ? (
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: contactUsData?.message || '<p>No Content Available</p>' }}
                        />
                    ) : (
                        <Text style={styles.noContentText}>No Content Available</Text>
                    )}
                </ScrollView>
            )}
            </ScrollView>
        </ScrollView>
    );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        marginTop: 30,
    },
    headerBackground: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    container: {
    flexGrow: 1,
    padding: 20,
    borderWidth: 1, // Add border width
    borderColor: '#CCCCCC', // Light gray border color
    borderRadius: 10, // Rounded corners
    backgroundColor: '#FFFFFF', // Background color for contrast
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for elevation
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow radius for a smooth shadow
    elevation: 3, // Elevation for Android shadow
    margin: 10, // Add margin for spacing
    // height:"100%"
},

noContentText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
},
});
