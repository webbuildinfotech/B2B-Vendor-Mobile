import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import React, { useState, useEffect } from 'react';
import HTMLView from 'react-native-htmlview';
import { fetchFaq } from '../../BackendApis/FaqApi';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FaqScreen = () => {
    const [faqData, setFaqData] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const response = await fetchFaq();
                const activeFaqs = response.data.filter((item) => item.status === 'Active');
                setFaqData(activeFaqs);
            } catch (err) {
                setError('Failed to load FAQs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadFaqs();
    }, []);

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((prev) => (prev === index ? null : index));
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <LoadingComponent />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {faqData?.map((item, index) => (
                <View key={item.id} style={styles.faqItem}>
                    <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.questionContainer}>
                        <Text style={styles.question}>{item.question}</Text>
                        <Text style={styles.toggleButton}>{expanded === index ? <FontAwesome6 name="minus" size={15} color="#fe0002" /> : <FontAwesome6 name="plus" size={15} color="#fe0002" />}</Text>
                    </TouchableOpacity>
                    {expanded === index && (
                        <View style={styles.answerContainer}>
                            <HTMLView
                                value={item.answer}
                                stylesheet={htmlStyles}
                            />
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

export default FaqScreen;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    faqItem: {
        marginBottom: 15,
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        width: "95%",
    },
    toggleButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fe0002',
    },
    answerContainer: {
        padding: 15,
        backgroundColor: '#F9F9F9',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

const htmlStyles = StyleSheet.create({
    p: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    strong: {
        fontWeight: 'bold',
    },
    ul: {
        marginVertical: 10,
    },
    li: {
        marginBottom: 5,
    },
});
