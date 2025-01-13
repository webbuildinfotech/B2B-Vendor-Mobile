import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HTMLView from 'react-native-htmlview';
import { useFocusEffect } from '@react-navigation/native';
import styles from './TermsAndConditionsScreenCss';
import { fetchTermsAndConditions } from '../../BackendApis/termsAndConditionsApi';
import LoadingComponent from '../../components/Loading/LoadingComponent';

const TermsAndConditionsScreen = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [termsAndConditionData, setTermsAndConditionData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Function to fetch terms and conditions
    const getTermsAndConditions = async () => {
        setLoading(true);
        try {
            const data = await fetchTermsAndConditions();
            setTermsAndConditionData(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch Terms and Conditions');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the screen is focused
    useFocusEffect(
        useCallback(() => {
            getTermsAndConditions();
        }, [])
    );

    // Pull-to-refresh functionality
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getTermsAndConditions();
        setRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={styles.heroContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Terms and Conditions</Text>
            </View>

            {loading ? (
                <LoadingComponent />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.container}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : termsAndConditionData ? (
                        <HTMLView
                            value={termsAndConditionData.content || '<p>No Content Available</p>'}
                            stylesheet={htmlStyles}
                        />
                    ) : (
                        <Text style={styles.termsText}>No Content Available</Text>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default TermsAndConditionsScreen;

const htmlStyles = {
    p: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        textAlign: 'justify',
    },
    strong: {
        fontWeight: 'bold',
        color: '#000',
    },
    ul: {
        marginVertical: 10,
        paddingLeft: 20,
    },
    li: {
        marginBottom: 8,
        fontSize: 16,
        color: '#444',
        lineHeight: 22,
    },
    a: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
};
