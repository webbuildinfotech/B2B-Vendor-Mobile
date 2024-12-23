import { Text, View, Image, TouchableOpacity, ScrollView, Pressable, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from '../../assets/cssFile';
import styles1 from '../Vendor/VendorHomeScreenCss';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import { fetchItems } from '../../BackendApis/itemsApi';
import { Dropdown } from 'react-native-element-dropdown';
import { formatNumber } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { resetSelectedGroup, setSelectedGroupR } from '../../../redux/groupReducer';
import LoadingComponent from '../../components/Loading/LoadingComponent';
import ErrorComponent from '../../components/Error/ErrorComponent';
import LogoComponent from '../../components/Logo/LogoComponent';


const PRODUCT_SORT_OPTIONS = [
  { value: 'AtoZ', label: 'A to Z' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High - Low' },
  { value: 'priceAsc', label: 'Price: Low - High' },
];


const ShopScreen = () => {
  const dispatch = useDispatch();
  const selectedGroupr = useSelector((state) => state.group.selectedGroup);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [dropdownValue, setDropdownValue] = useState(4);
  const [sortOption, setSortOption] = useState('AtoZ');
  const [selectedGroup, setSelectedGroup] = useState('');

  // const options = [
  //   { label: '4 items per page', value: 4 },
  //   { label: '10 items per page', value: 10 },
  //   { label: '20 items per page', value: 20 },
  //   { label: '30 items per page', value: 30 },
  // ];

  // Define fetchItemsData outside of useFocusEffect
  const fetchItemsData = async () => {
    setLoading(true);
    try {
      const data = await fetchItems(); // API call
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

  // Fetch items when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchItemsData(); // Call the async function
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItemsData();
    setRefreshing(false);
  }, []);
  const filterByGroup = useCallback((group) => {
    // Set the selected group in the global state
    dispatch(setSelectedGroupR(group));
    setSelectedGroup(group); // Local state (if needed, you might not need this)

    // Filter the items based on the passed group
    const filtered = items.data?.filter(item => item.group === group);

    setFilteredItems(filtered || []); // Ensure filteredItems is set to an empty array if no items match
    setCurrentPage(1); // Reset to the first page
  }, [dispatch, items.data]);

  // Use effect to filter items when selectedGroupr changes
  useEffect(() => {
    if (selectedGroupr) {
      filterByGroup(selectedGroupr); // Call the filter function with the selected group
    } else {
      setFilteredItems(items.data || []); // Reset to all items if no group is selected
    }
  }, [selectedGroupr, items.data, filterByGroup]);


  const resetFilter = useCallback(() => {
    dispatch(resetSelectedGroup(''));
    setSelectedGroup('');
    setFilteredItems(items.data);
    setCurrentPage(1);
  }, [dispatch, items.data]);

  const handleResetAndToggle = useCallback((group) => {
    if (group) {
      filterByGroup(group);
    } else {
      resetFilter();
    }
    setSidebarVisible(false);
  }, [filterByGroup, resetFilter]);


  // Search and filter items
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
    setCurrentPage(1); // Reset to the first page
  };


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
  // const currentItems = filteredItems?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  // const currentItems = sortItems().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const currentItems = sortItems(filteredItems).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (option) => {
    setSortOption(option.value);
    const sorted = sortItems(filteredItems);
    setFilteredItems(sorted);
    setCurrentPage(1); // Reset to the first page
  };

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
    const maxVisiblePages = 1;
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
    <SafeAreaView style={styles.heroContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sidebarVisible && (
          <ScrollView style={styles1.sidebar}>
            <TouchableOpacity onPress={toggleSidebar} style={styles1.closeButton}>
              <LogoComponent />
              <Text style={styles1.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <View style={styles1.filterContainer}>
              <TouchableOpacity onPress={() => handleResetAndToggle(null)}>
                <Text style={styles1.sidebarItem}>Reset Filter</Text>
              </TouchableOpacity>
              {group.map((groupName, index) => (
                <TouchableOpacity key={index} onPress={() => handleResetAndToggle(groupName)}>
                  <Text style={styles1.sidebarItem}>Filter {groupName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        <LogoComponent />

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

        <View style={styles.heroFilter}>
          <View>
            <Pressable style={styles.filterButton} onPress={toggleSidebar}>
              <Text style={styles.filterText}>Filters</Text>
              <Ionicons name="filter-sharp" size={24} color="white" />
            </Pressable>
          </View>

          <View style={styles.filterContainer}>
            <Pressable >
            {/*
              <View >
                <View>
                  <Dropdown
                    style={styles.DropdownStyle}
                    data={options}
                    labelField="label"
                    valueField="value"
                    placeholder="Select items per page"
                    value={dropdownValue}
                    onChange={item => {
                      setDropdownValue(item.value);
                      setItemsPerPage(item.value); // Update the number of items per page
                      setCurrentPage(1); // Reset to the first page
                    }}
                    selectedTextStyle={styles.selectedText}
                  />
                </View>
              </View>
               */}
               
            <View>
            <Pressable >
              <View>
                <View>
                  <Dropdown
                    style={styles.DropdownStyle}
                    data={PRODUCT_SORT_OPTIONS}
                    labelField="label"
                    valueField="value"
                    placeholder="Select sort option"
                    value={sortOption}
                    onChange={handleSortChange}
                    selectedTextStyle={styles.selectedText}
                  />
                </View>
              </View>
            </Pressable>
          </View>
            </Pressable>

          </View>

        </View>

        <Text style={styles.Verticalline} />

        <View style={styles.heroTreanding}>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
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
                  {/*
                  <Image
                    style={styles.heroTopImage}
                    source={{ uri: item.productImages[0] }}
                  />
                   */}
                  <Image
                    style={styles.heroTopImage}
                    source={
                      item.productImages && item.productImages.length > 0
                        ? { uri: item.productImages[0] }
                        : require('../../assets/images/NOIMAGE.jpg') // Fallback to a default local image
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
              <Text
                style={{
                  fontSize: 14,
                  color: "#888",
                  textAlign: "center",
                  marginTop: 5,
                  lineHeight: 20,
                }}
              >
                We couldn't find any items matching your criteria. Try resetting your
                filters or modifying your search.
              </Text>

              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: "#fe0002",
                  paddingVertical: 12,
                  paddingHorizontal: 30,
                  borderRadius: 25,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 5,
                }}
                onPress={() => {
                  setSearchQuery("");
                  setFilteredItems(items.data);
                  setCurrentPage(1);
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Reset Filters
                </Text>
              </TouchableOpacity>
            </View>

          )}
        </View>


        <Text style={styles.Verticalline} />

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

export default ShopScreen;
