import { Image, View, TouchableOpacity, Text, RefreshControl, ScrollView, ActivityIndicator, Dimensions, Pressable, TextInput } from 'react-native';
import React, { useState, useCallback } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import styles from './HomeScreenCss';
import { useFocusEffect } from '@react-navigation/native';
import { fetchItems } from '../../BackendApis/itemsApi';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { resetSelectedGroup, setSelectedGroupR } from '../../../redux/groupReducer';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import ErrorComponent from '../../components/Error/ErrorComponent';
import LogoComponent from '../../components/Logo/LogoComponent';
import { fetchBanner } from '../../BackendApis/bannerApi';
import { useAuth } from '../../components/AuthToken/AuthContext';
import { Feather } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const selectedGroup = useSelector(state => state.group.selectedGroup);


  const [items, setItems] = useState([]);
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCategories, setVisibleCategories] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerData, setBannerData] = useState([]);

  const getItems = async () => {
    setSearchQuery("");
    dispatch(resetSelectedGroup(''));
    setLoading(true);
    try {
      const data = await fetchItems();
      const bannerData = await fetchBanner();
      setBannerData(bannerData);
      setItems(data);


      const groupsWithImages = data.data.map(item => ({
        subGroup1: item.subGroup1,
        id: item.id,
        firstImage: item.productImages && item.productImages.length > 0 ? item.productImages[0] : null,
      }));


      const uniqueGroups = groupsWithImages.reduce((accumulator, current) => {
        const x = accumulator.find(item => item.subGroup1 === current.subGroup1);
        if (!x) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);

      setCategory(uniqueGroups);
      setError(null);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      getItems();
    }, [])
  );

  const handleShowMore = () => {
    setVisibleCategories(category.length);
  };

  const handleShowLess = () => {
    setVisibleCategories(6);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getItems();
    setRefreshing(false);
  }, []);

  const displayProducts = items?.data?.slice(0, 6) || [];


  const handleCategoryPress = async (item) => {
    // await dispatch(setSelectedGroupR(item.group));
    if (selectedGroup !== item.group) {
      // navigation.navigate('Shop');
      navigation.navigate('CategoryScreen', { category: item.subGroup1, PreviousRoute: 'Home' });
    }
  };

  const displayCategories = category
    .sort((a, b) => a.subGroup1.localeCompare(b.subGroup1))
    .slice(0, visibleCategories);
  const actualVisibleCategories = Math.min(visibleCategories, category.length);
  const screenWidth = Dimensions.get("window").width;


  const handleSearch = (query) => {
    setSearchQuery(query);

  };
  return (
    <SafeAreaView style={styles.heroContainer}>
      {loading ? (
        <LoadingComponent />
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View>
            <LogoComponent />
            <Feather
              name="shopping-cart"
              size={24}
              color="#fff"
              style={styles.cartIcon}
              onPress={() => {
                if (token) {
                  navigation.navigate('VendorCart', {
                    PreviousRoute: 'Home',
                    PreviousScreen: 'Home',
                  });

                } else {
                  navigation.navigate('CustomerCart', {
                    PreviousRoute: 'Home',
                    PreviousScreen: 'Home',
                  });
                }
              }}
            />
          </View>


          <View style={styles.mainBox}>
            <View style={styles.productTopSearch}>
              <TextInput
                placeholder="Search products, categories..."
                style={styles.searchInput}
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <Pressable style={styles.searchIcon}
                onPress={() => {
                  if (searchQuery) {
                    navigation.navigate('Shop', {
                      screen: 'ShopScreen',
                      params: {
                        searchQueryData: searchQuery,
                      },
                    });
                  } else {
                    alert('Please enter a search query');
                  }
                }}
              >
                <Feather name="search" size={24} color="#fff" />
              </Pressable>
            </View>
          </View>


          <Text style={styles.Verticalline} />

          <View>
            {bannerData.length > 0 ? (
              <Carousel
                loop
                width={screenWidth}
                height={200}
                autoPlay={true}
                data={bannerData}
                onSnapToItem={(index) => setCurrentIndex(index)}
                renderItem={({ item }) => (
                  <View style={styles.slide}>
                    <Image
                      source={{ uri: item.BannerImages[0] }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                )}
                scrollAnimationDuration={3000}
              />

            ) : (
              <ActivityIndicator size="large" color="#fe0002" />
            )}

            <View style={styles.dotsContainer}>
              {bannerData.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dot, currentIndex === index ? styles.activeDot : null]}
                />
              ))}
            </View>
          </View>


          <View style={styles.mainCategoryBox}>
            <Text style={styles.Verticalline} />
            <View style={styles.productListTextContainer}>
              <Text style={styles.productText}>Categories</Text>
            </View>

            {category.length > 0 ? (
              <View>
                <View style={styles.categoryListBoxContainer}>
                  {displayCategories.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.categoryContainer}
                      onPress={() => {
                        handleCategoryPress(item);
                      }}
                    >
                      <Image
                        source={
                          item.firstImage
                            ? { uri: item.firstImage }
                            : require('../../assets/images/NOIMAGE.jpg')
                        }
                        style={styles.categoryImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.categoryText}>
                        {item.subGroup1?.length > 9
                          ? `${item.subGroup1.substring(0, 9)}...`
                          : item.subGroup1}
                      </Text>
                    </TouchableOpacity>
                  ))}

                </View>

                <View style={styles.counterContainer}>
                  <Text style={styles.counterText}>
                    You've viewed {actualVisibleCategories} of {category.length} Product Categories
                  </Text>
                </View>


                <View style={styles.buttonContainer}>
                  {visibleCategories < category.length ? (
                    <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
                      <Text style={styles.showMoreText}>Load More</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.showLessButton} onPress={handleShowLess}>
                      <Text style={styles.showLessText}>Load Less</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <ErrorComponent errorMessage={error} onRetry={getItems} />
            )}
          </View>

          <Text style={styles.Verticalline} />

          <View style={styles.productListTextContainer}>
            <View>
              <Text style={styles.productText}>Latest Products</Text>
            </View>

            {token ? ("") : (
              <View style={styles.productTextAndIcon}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Shop', { screen: 'ShopScreen' });
                  }}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
                <MaterialIcons name="keyboard-double-arrow-right" size={25} color="#fe0002" />
              </View>
            )}
          </View>

          {displayProducts.length > 0 ? (
            <View style={styles.productListContainer}>
              {displayProducts.map((item) => (
                <View key={item.id.toString()} style={styles.productColumn}>
                  <TouchableOpacity
                    style={styles.productContainer}
                    onPress={() => {
                      navigation.navigate('Shop', {
                        screen: 'Info',
                        params: {
                          id: item.id,
                          PreviousRoute: 'Home',
                        },
                      });
                    }}
                  >
                    {item.productImages && item.productImages.length > 0 ? (
                      <Image source={{ uri: item.productImages[0] }} style={styles.productImage} resizeMode="contain" />
                    ) : (
                      <Image source={require('../../assets/images/NOIMAGE.jpg')} style={styles.productImage} resizeMode="contain" />
                    )}

                    <Text style={styles.productName}>{item.itemName}</Text>
                    <Text style={styles.productPrice}>₹{item.sellingPrice}</Text>
                    <Text style={styles.productDes}>
                      {item.description?.length > 20
                        ? `${item.description.substring(0, 20)}...`
                        : item.description}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <ErrorComponent errorMessage={error} onRetry={getItems} />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
