import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, Pressable, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemById } from "../../BackendApis/itemsApi";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { formatNumber } from "../../utils";
import { addToCart } from "../../../redux/CartReducer";
import LogoComponent from "../../components/Logo/LogoComponent";
import { useAuth } from "../../components/AuthToken/AuthContext";
import { Feather } from '@expo/vector-icons';

const ProductInfoScreen = () => {
  const route = useRoute();
  const { token } = useAuth();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { id, PreviousRoute, subCategory, category } = route.params;
  const [item, setItem] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addItemToCart = (item) => {
    setAddedToCart(true);
    const itemWithQuantity = { ...item, quantity: 1 };
    dispatch(addToCart(itemWithQuantity));
    // dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };
  const cart = useSelector((state) => state.cart.cart);

  useEffect(() => {
    const getItemDetails = async () => {
      try {
        const data = await fetchItemById(id);
        setItem(data.data);
      } catch (err) {
        setError('Failed to fetch item details');
      } finally {
        setLoading(false);
      }
    };

    getItemDetails();
  }, [id]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent errorMessage={error} onRetry={() => getItemDetails()} />;
  }

  const handleReturn = () => {
    const previousRoute =
      PreviousRoute === "CategoryScreen"
        ? "Home"
        : PreviousRoute === "SubCategoryScreen"
          ? "CategoryScreen"
          : PreviousRoute;

    navigation.navigate(PreviousRoute, { category: category || '', subCategory: subCategory || '', PreviousRoute: previousRoute });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View >
        <LogoComponent />
        <Feather
          name="shopping-cart"
          size={24}
          color="#fff"
          style={styles.cartIcon}
          onPress={() => {
            if (token) {
              navigation.navigate('VendorCart', {
                params: {
                  PreviousRoute: 'Info',
                  id: id,
                },
              });
              // navigation.navigate('VendorCart');
            } else {
              navigation.navigate('CustomerCart', {
                // PreviousRoute: 'Info',
                params: {
                  PreviousRoute: 'Info',
                  id: id,
                },
              });
              // navigation.navigate('CustomerCart');
            }
          }}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.productImages && item.productImages.length > 0 ? (
          item.productImages.map((imageUri, index) => (
            <ImageBackground
              key={index}
              style={styles.imageBackground}
              source={{ uri: imageUri }}
            />
          ))
        ) : (
          <View style={styles.noImageContainer}>
            <Image
              style={styles.heroTopImage}
              source={
                require('../../assets/images/NOIMAGE.jpg')
              }
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.MainContainer}>
        <Text style={styles.separator} />
        <TouchableOpacity
          onPress={() => {
            handleReturn();
          }}>
          <Text style={styles.backText}><Feather name="chevron-left" size={20} color="black" /> Back</Text>
        </TouchableOpacity>
        <Text style={styles.productTitle}>{item.itemName}</Text>
        <Text style={styles.productPrice}>₹ {formatNumber(item.sellingPrice)}</Text>
        <Text style={styles.productsubDescription}>{item.description}</Text>


        {token ? ("") : (

          <View style={styles.BottomButton}>
            <Pressable
              style={[
                styles.cartButton,
                addedToCart ? { backgroundColor: 'green' } : {}
              ]}
              onPress={() => addItemToCart(item)}
            >
              {addedToCart ? (
                <View>
                  <Text style={styles.byeNowText}>Added to Cart</Text>
                </View>
              ) : (
                <Text style={styles.byeNowText}>Add to Cart</Text>
              )}
            </Pressable>
            <Pressable
              style={styles.buyNowButton}
              onPress={() => {
                addItemToCart(item);
                // navigation.navigate('CustomerCart');
                navigation.navigate('CustomerCart', {
                  // PreviousRoute: 'Info',
                  params: {
                    PreviousRoute: 'Info',
                    id: id,
                  },
                });
              }}
            >
              <Text style={styles.byeNowText}>Buy Now</Text>
            </Pressable>

          </View>
        )}

        <Text style={styles.separator} />

        <View style={styles.Classifications}>
          <Text style={styles.heading}>Classifications</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{item.subGroup1}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>SubCategory</Text>
            <Text style={styles.value}>{item.subGroup2}</Text>
          </View>
        </View>


        <View style={styles.Classifications}>
          <Text style={styles.heading}>Additional Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Alias</Text>
            <Text style={styles.value}>{item.alias || "NA"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Part Number</Text>
            <Text style={styles.value}>{item.partNo || "NA"}</Text>
          </View>
        </View>

        <View style={styles.Classifications}>
          <Text style={styles.heading}>Tax & Unit Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>GST Rate</Text>
            <Text style={styles.value}>{item.gstRate || "NA"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Base Unit</Text>
            <Text style={styles.value}>{item.baseUnit || "NA"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alternate Unit</Text>
            <Text style={styles.value}>{item.alternateUnit || "NA"}</Text>
          </View>
        </View>

        <View style={styles.Classifications}>
          <Text style={styles.heading}>Conversion & Dimensions</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Taxability</Text>
            <Text style={styles.value}>{item.Taxable || "NA"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Conversion</Text>
            <Text style={styles.value}>{item.conversion || "NA"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Denominator</Text>
            <Text style={styles.value}>{item.denominator || "NA"}</Text>
          </View>
        </View>

        <Text style={styles.separator} />

      </View>
    </ScrollView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 30,
  },

  cartIcon: {
    position: "absolute",
    right: 15,
    top: 10,
    zIndex: 11,
  },

  imageBackground: {
    width: 400,
    height: 400,
    // marginTop: 25,
    marginRight: 10,
    resizeMode: "contain",
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: "#1C252E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    height: 400,
    width: 400,
  },

  heroTopImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },

  messageText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
  },
  MainContainer: {
    marginHorizontal: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#919eab33',
    borderStyle: 'dashed',
  },
  productsubDescription: {
    marginTop: 7,
    marginBottom: 10,
    fontSize: 14,
    color: "#637381",
    fontWeight: "700",
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    color: "#1C252E",
  },
  productPrice: {
    marginVertical: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#1C252E",
  },
  BottomButton: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartButton: {
    // backgroundColor: "#e3a812",
    backgroundColor: "#fe0002",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: "49%",
    height: 55,
  },
  buyNowButton: {
    backgroundColor: "#1C252E",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: "49%",
    height: 55,
  },
  byeNowText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  Classifications: {
    marginVertical: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
  },

  backText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
