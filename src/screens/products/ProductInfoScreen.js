import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AirbnbRating } from 'react-native-ratings';
import { fetchItemById } from "../../BackendApis/itemsApi"; // Ensure this is correctly importing your API function
import LoadingComponent from "../../components/Loading/LoadingComponent";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { formatNumber } from "../../utils";
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { setProductDetails } from "../../../redux/productAndAddressReducer";
import { addToCart } from "../../../redux/CartReducer";

const ProductInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { id } = route.params;

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

  // Default rating to 2 if item has no rating
  const rating = item.rating || 2

  // const handleBuyNowPress = () => {
  //   dispatch(setProductDetails(item, 1));
  //   navigation.navigate('CustomerCart');
  // };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            {/*
              <Text style={styles.messageText}>No Images Available</Text>
              */}
          </View>
        )}
      </ScrollView>

      <View style={styles.MainContainer}>
        <Text style={styles.separator} />
        <Text style={styles.productTitle}>{item.itemName}</Text>
        <Text style={styles.productsubDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>₹ {formatNumber(item.sellingPrice)}</Text>

        <View style={styles.starContainer}>
        {/*
          <AirbnbRating
            count={5}
            defaultRating={rating}
            size={30}
            isDisabled={false}
            selectedColor="#FF3030"
            unSelectedColor="#E0E0E0"
            showRating={false}
            starStyle={styles.starStyle}
          />
        */}
        </View>



        <View style={styles.BottomButton}>
          <Pressable
            style={[
              styles.cartButton,
              addedToCart ? { backgroundColor: 'green' } : {} // Apply green background if addedToCart is true
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
              addItemToCart(item); // Add item to cart first
              navigation.navigate('CustomerCart'); // Then navigate to the cart
            }}
          >
            <Text style={styles.byeNowText}>Buy Now</Text>
          </Pressable>

        </View>

        {/*
          <Text style={styles.separator} />
          <View style={styles.BottomTextContainer}>
            <BottomTextComponent icon={<Entypo name="plus" size={24} color="#637381" />} text="Compare" />
            <BottomTextComponent icon={<AntDesign name="heart" size={20} color="#637381" />} text="Favorite" />
            <BottomTextComponent icon={<Ionicons name="share-social-sharp" size={20} color="#637381" />} text="Share" />
          </View>
  
          <View style={styles.BottomLastContainer}>
            <BottomInfoComponent icon={<MaterialIcons name="verified" size={40} color="#FF3030" />} title="100% original" description="Chocolate bar candy canes ice cream toffee cookie halvah." />
            <BottomInfoComponent icon={<MaterialCommunityIcons name="clock" size={40} color="#FF3030" />} title="10 days replacement" description="Marshmallow biscuit donut dragée fruitcake wafer." />
            <BottomInfoComponent icon={<MaterialIcons name="verified-user" size={40} color="#FF3030" />} title="Year warranty" description="Cotton candy gingerbread cake I love sugar sweet." />
          </View>
          */}

      </View>
    </ScrollView>
  );
};

const BottomTextComponent = ({ icon, text }) => (
  <View style={styles.BottomTextComponent}>
    {icon}
    <Text style={styles.BottomText}>{text}</Text>
  </View>
);

const BottomInfoComponent = ({ icon, title, description }) => (
  <View style={styles.BottomTextLastComponent}>
    {icon}
    <Text style={styles.BottomLastText}>{title}</Text>
    <Text style={styles.BottomContentText}>{description}</Text>
  </View>
);

export default ProductInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 23,
  },
  imageBackground: {
    width: 400,
    height: 400,
    marginTop: 25,
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
    width: '100%',              // Use full width of the container
    height: 300,                // Set a height for the image (you can adjust as needed)
    resizeMode: 'cover',        // Ensure the image covers the entire space
    // marginHorizontal: 10,       // Add horizontal margins for better spacing
    // marginTop: 10,              // Add some top margin
    borderWidth: 5,             // Border width
    borderColor: '#fff',       // White border color
    borderRadius: 12,          // Rounded corners
    overflow: 'hidden',         // Make sure the image doesn't overflow the rounded corners
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
    fontSize: 22,
    fontWeight: "700",
    color: "#1C252E",
  },
  starContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  starStyle: {
    marginHorizontal: 3,
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
  BottomTextComponent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  BottomText: {
    color: "#637381",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 3,
  },
  BottomTextContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  BottomLastContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  BottomTextLastComponent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  BottomLastText: {
    fontSize: 25,
    fontWeight: "500",
  },
  BottomContentText: {
    color: "#637381",
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
    marginLeft: 25,
    marginRight: 25,
  },
});
