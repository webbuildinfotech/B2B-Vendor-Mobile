import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ImageBackground,
    RefreshControl,
    useWindowDimensions,
  } from 'react-native';
  import React, { useCallback, useState } from 'react';
  import { getContactMessage } from '../../BackendApis/contactUsApi';
  import HTMLView from 'react-native-htmlview';
  import { useFocusEffect } from '@react-navigation/native';
  import LoadingComponent from '../../components/Loading/LoadingComponent';
  
  const ContactUsScreen = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [contactUsData, setContactUsData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
  
    // Fetch contact message
    const getContactUsData = async () => {
      setLoading(true);
      try {
        const data = await getContactMessage();
        setContactUsData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Contact Us Message');
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch data on screen focus
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
      <ScrollView
        style={styles.main}
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
  
        <View style={styles.container}>
          {loading ? (
            <LoadingComponent />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : contactUsData ? (
            <HTMLView
              value={contactUsData?.message || '<p>No Content Available</p>'}
              stylesheet={htmlStyles}
            />
          ) : (
            <Text style={styles.noContentText}>No Content Available</Text>
          )}
        </View>
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
      borderWidth: 1,
      borderColor: '#CCCCCC',
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      margin: 10,
    },
    noContentText: {
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
      marginTop: 20,
    },
    errorContainer: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#FFEEEE',
      borderRadius: 8,
    },
    errorText: {
      fontSize: 16,
      color: '#FF0000',
      textAlign: 'center',
    },
  });
  
  const htmlStyles = StyleSheet.create({
    p: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
      marginBottom: 10,
    },
    strong: {
      fontWeight: 'bold',
      color: '#000',
    },
    ul: {
      marginVertical: 10,
    //   paddingLeft: 20,
    },
    li: {
      marginBottom: 28,
      fontSize: 16,
      color: '#444',
      lineHeight: 22,
    },
    a: {
      color: '#007BFF',
      textDecorationLine: 'underline',
    },
  });
  