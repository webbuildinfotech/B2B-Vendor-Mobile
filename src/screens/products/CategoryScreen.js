import { Text, View, Image, TouchableOpacity, ScrollView, Pressable, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from '../../assets/cssFile';
import styles2 from '../Home/HomeScreenCss';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import { fetchItems } from '../../BackendApis/itemsApi';
import { formatNumber } from '../../utils';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import ErrorComponent from '../../components/Error/ErrorComponent';
import LogoComponent from '../../components/Logo/LogoComponent';
import { useAuth } from '../../components/AuthToken/AuthContext';

const CategoryScreen = ({ route }) => {
  const { token } = useAuth();
  const { category, PreviousRoute } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subCatrgory, setSubCatrgory] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fetchItemsData = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(data);

      if (category) {
        const filtered = data.data.filter((item) => item.subGroup1 === category);

        const groupsWithImages = filtered.map(item => ({
          subGroup2: item.subGroup2,
          id: item.id,
          firstImage: item.productImages && item.productImages.length > 0 ? item.productImages[0] : null,
        }));

        const uniqueSubCategory = groupsWithImages.reduce((accumulator, current) => {
          const x = accumulator.find(item => item.subGroup2 === current.subGroup2);
          if (!x) {
            accumulator.push(current);
          }
          return accumulator;
        }, []);

        setFilteredItems(filtered);
        setSubCatrgory(uniqueSubCategory);
      } else {
        setFilteredItems(data.data);
      }

      // setFilteredItems(data.data);
      const groups = data.data.map(item => item.group);
      const uniqueGroups = [...new Set(groups)];
      setError(null);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItemsData();
    }, [])
  );

  useEffect(() => {
    setSubCatrgory(subCatrgory);
  }, [subCatrgory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItemsData();
    setRefreshing(false);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    let filtered = items.data;

    if (query.trim() !== "") {
      filtered = items.data.filter(
        (item) =>
          item.itemName.toLowerCase().includes(query.toLowerCase()) ||
          (item.subGroup1 && item.subGroup1.toLowerCase().includes(query.toLowerCase())) ||
          (item.subGroup2 && item.subGroup2.toLowerCase().includes(query.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  };


  const totalPages = Math?.ceil(filteredItems?.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;
    const firstPage = 1;
    const lastPage = totalPages;

    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), firstPage);
    let endPage = Math.min(startPage + maxVisiblePages - 1, lastPage);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, firstPage);
    }

    if (startPage > firstPage) {
      pageNumbers.push(
        <TouchableOpacity key={firstPage} onPress={() => setCurrentPage(firstPage)} style={styles.pageNumber}>
          <Text style={styles.pageText}>{firstPage}</Text>
        </TouchableOpacity>
      );
    }

    if (startPage > firstPage + 1) {
      pageNumbers.push(<Text key="ellipsis-start"> ... </Text>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <TouchableOpacity
          key={i}
          onPress={() => setCurrentPage(i)}
          style={[styles.pageNumber, currentPage === i && styles.activePage]}
        >
          <Text style={[styles.pageText, currentPage === i && styles.activePageText]}>{i}</Text>
        </TouchableOpacity>
      );
    }

    if (endPage < lastPage - 1) {
      pageNumbers.push(<Text key="ellipsis-end"> ... </Text>);
    }

    if (endPage < lastPage) {
      pageNumbers.push(
        <TouchableOpacity key={lastPage} onPress={() => setCurrentPage(lastPage)} style={styles.pageNumber}>
          <Text style={styles.pageText}>{lastPage}</Text>
        </TouchableOpacity>
      );
    }

    return pageNumbers;
  };

  const navigation = useNavigation();

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <ErrorComponent
        errorMessage={error}
        onRetry={fetchItemsData}
      />
    );
  }

  const handleCategoryPress = async (item) => {
    navigation.navigate('SubCategoryScreen', { subCategory: item.subGroup2, category: category, PreviousRoute: 'CategoryScreen' });
  };

  const handleReturn = () => {
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: {
        screen: PreviousRoute,
      },
    });
  };


  const handleShowMore = () => {
    setVisibleCategories(subCatrgory.length);
  };

  const handleShowLess = () => {
    setVisibleCategories(6);
  };


  const displayCategories = subCatrgory
    .sort((a, b) => a.subGroup2.localeCompare(b.subGroup2))
    .slice(0, visibleCategories);
  const actualVisibleCategories = Math.min(visibleCategories, subCatrgory.length);

  return (
    <SafeAreaView style={styles.heroContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                  PreviousRoute: 'CategoryScreen',
                  PreviousScreen: 'Home',
                  category: category,
                });

              } else {
                navigation.navigate('CustomerCart', {
                  PreviousRoute: 'CategoryScreen',
                  PreviousScreen: 'Home',
                  category: category,
                });
              }
            }}
          />
        </View>

        <View style={styles.mainBox}>


          <View style={styles.filterContainer}>

            <TouchableOpacity
              onPress={() => {
                handleReturn();
              }}>
              <Text style={styles.backText}><Feather name="chevron-left" size={20} color="black" /> Back</Text>
            </TouchableOpacity>

            <View style={styles.heroTopSearch}>
              <Pressable style={styles.heroPressable}>
                <Feather name="search" size={24} color="#ccc" />
                <TextInput
                  placeholder='Search...'
                  style={styles.searchInput}
                  placeholderTextColor="#aaa"
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </Pressable>
            </View>


          </View>
        </View>

        <Text style={styles.Verticalline} />

        <View style={styles2.mainCategoryBox}>
          <Text style={styles2.Verticalline} />

          <View style={styles2.productListTextContainer}>
            <Text style={styles2.productText}>Sub Categories</Text>
          </View>

          {subCatrgory.length > 0 ? (
            <View>
              <View style={styles2.categoryListBoxContainer}>
                {displayCategories.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles2.categoryContainer}
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
                      style={styles2.categoryImage}
                      resizeMode="contain"
                    />
                    <Text style={styles2.categoryText}>
                      {item.subGroup2?.length > 9
                        ? `${item.subGroup2.substring(0, 9)}...`
                        : item.subGroup2}
                    </Text>
                  </TouchableOpacity>
                ))}

              </View>

              {subCatrgory.length > 6 && (
                <>
                  <View style={styles2.counterContainer}>
                    <Text style={styles2.counterText}>
                      You've viewed {actualVisibleCategories} of {subCatrgory.length} Product Categories
                    </Text>
                  </View>


                  <View style={styles2.buttonContainer}>
                    {visibleCategories < subCatrgory.length ? (
                      <TouchableOpacity style={styles2.showMoreButton} onPress={handleShowMore}>
                        <Text style={styles2.showMoreText}>Load More</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles2.showLessButton} onPress={handleShowLess}>
                        <Text style={styles2.showLessText}>Load Less</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}

            </View>
          ) : (
            <ErrorComponent errorMessage={error} onRetry={fetchItemsData} />
          )}
        </View>
        <Text style={styles.Verticalline} />

        {/* Product Items */}
        <View style={styles.heroTreanding}>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  navigation.navigate('Shop', {
                    screen: 'Info',
                    params: {
                      id: item.id,
                      PreviousRoute: 'CategoryScreen',
                      category: item.subGroup1
                    },
                  })
                }
                style={{
                  marginVertical: 4,
                  width: "49%",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <View style={styles.heroProductView}>
                  <Image
                    style={styles.heroTopImage}
                    source={
                      item.productImages && item.productImages.length > 0
                        ? { uri: item.productImages[0] }
                        : require('../../assets/images/NOIMAGE.jpg')
                    }
                  />

                  <Text style={styles.heroProductTitle} numberOfLines={1}>
                    {item.itemName}
                  </Text>
                  <View style={styles.heroProductBottom}>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: "#1C252E",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      ₹ {formatNumber(item.sellingPrice)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View
              style={{
                alignItems: "center",
                marginTop: 20,
                paddingHorizontal: 20,
                paddingVertical: 20,
                justifyContent: "center",
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 18, color: "#555", fontWeight: "bold", textAlign: "center" }}>
                Oops! No items found
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.Verticalline} />

        {/* Pagination Controls */}
        <View style={styles.paginationControls}>
          <TouchableOpacity onPress={goToPreviousPage} disabled={currentPage === 1}>
            <Text style={styles.paginationArrow}><AntDesign name="left" size={18} color="#1C252E" /></Text>
          </TouchableOpacity>

          {renderPageNumbers()}

          <TouchableOpacity onPress={goToNextPage} disabled={currentPage === totalPages}>
            <Text style={styles.paginationArrow}><AntDesign name="right" size={18} color="#1C252E" /></Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryScreen;
