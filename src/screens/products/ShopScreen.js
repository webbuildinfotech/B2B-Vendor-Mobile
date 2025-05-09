import { Text, View, Image, TouchableOpacity, ScrollView, Pressable, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from '../../assets/cssFile';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
// import Feather from '@expo/vector-icons/Feather';
import { Feather } from '@expo/vector-icons';
import { fetchItems } from '../../BackendApis/itemsApi';
import { Dropdown } from 'react-native-element-dropdown';
import { formatNumber } from '../../utils';
import { useDispatch } from 'react-redux';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import ErrorComponent from '../../components/Error/ErrorComponent';
import { useAuth } from '../../components/AuthToken/AuthContext';

const PRODUCT_SORT_OPTIONS = [
  { value: 'AtoZ', label: 'A to Z' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High - Low' },
  { value: 'priceAsc', label: 'Price: Low - High' },
];

const ShopScreen = () => {
  const route = useRoute();
  const searchQueryData = route.params?.searchQueryData || "";

  const { token } = useAuth();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortOption, setSortOption] = useState('AtoZ');

  const fetchItemsData = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(data);
      setFilteredItems(data.data);
      const groups = data.data.map(item => item.group);
      const uniqueGroups = [...new Set(groups)];
      setGroup(uniqueGroups);
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItemsData();
    setRefreshing(false);
  }, []);


  const handleSearch = (query) => {
    setSearchQuery(query);
    let filtered = items?.data;

    if (query.trim() !== "") {
      filtered = items?.data?.filter(
        (item) =>
          item.itemName.toLowerCase().includes(query.toLowerCase()) ||
          (item.subGroup1 && item.subGroup1.toLowerCase().includes(query.toLowerCase())) ||
          (item.subGroup2 && item.subGroup2.toLowerCase().includes(query.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (items.length > 0 && searchQueryData) {
      setSearchQuery(searchQueryData);
      handleSearch(searchQueryData);
    }
  }, [items, searchQueryData]);



  const sortItems = useCallback(() => {
    let sortedItems = [...filteredItems];
    if (sortOption === 'AtoZ') {
      sortedItems.sort((a, b) => a.itemName.localeCompare(b.itemName));
    } else if (sortOption === 'newest') {
      sortedItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === 'priceDesc') {
      sortedItems.sort((a, b) => parseFloat(b.sellingPrice) - parseFloat(a.sellingPrice));
    } else if (sortOption === 'priceAsc') {
      sortedItems.sort((a, b) => parseFloat(a.sellingPrice) - parseFloat(b.sellingPrice));
    }
    return sortedItems;
  }, [filteredItems, sortOption]);

  const totalPages = Math?.ceil(filteredItems?.length / itemsPerPage);
  const currentItems = sortItems(filteredItems).slice(
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

  return (
    <View style={styles.heroContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
   

        <View style={styles.mainBox}>
          <View style={styles.productTopSearch}>
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

          <Dropdown
            style={styles.MainDropdownStyle}
            data={PRODUCT_SORT_OPTIONS}
            labelField="label"
            valueField="value"
            placeholder={`Sort by: ${PRODUCT_SORT_OPTIONS.find(option => option.value === sortOption)?.label || 'Select'}`}
            value={`Sort By: ${sortOption}`}
            onChange={(option) => {
              setSortOption(option.value);
              const sorted = sortItems(filteredItems);
              setFilteredItems(sorted);
              setCurrentPage(1);
            }}
            selectedTextStyle={styles.selectedText}
          />
        </View>

        <Text style={styles.Verticalline} />

        {/* Product Items */}
        <View style={styles.heroTreanding}>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    PreviousRoute: 'ShopScreen',
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
    </View>
  );
};

export default ShopScreen;
