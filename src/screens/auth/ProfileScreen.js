import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction, setUser } from '../../../redux/authReducer'; // Adjust the import path as necessary
import { getAllOrder } from "../../BackendApis/orderApi";
import { authLogout, fetchUserDataById } from "../../BackendApis/userApi";
import useAuthToken from "../../components/AuthToken/useAuthToken";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import { useAuth } from "../../components/AuthToken/AuthContext";


const ProfileScreen = () => {

  const { userData } = useAuthToken();
      const { token, clearToken } = useAuth();

  const parsedUserData = JSON.parse(userData);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#00CED1",
      },
      headerLeft: () => (
        <Image
          style={{ width: 140, height: 120, resizeMode: "contain" }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c518.png",
          }}
        />
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 12 }}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <AntDesign name="search1" size={24} color="black" />
        </View>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        getOrderData();
      }
      // setLoading(false);
    }, [token])
  );

  const getOrderData = async () => {
    setLoading(true);
    try {
      setOrders([]);

      // Delay for 1 seconds (1000 milliseconds)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = await getAllOrder();
      setOrders(data);


    } catch (err) {
      // console.log("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get Address and filter based on the selected group
  const getAddrsssData = async () => {
    try {
      const data = await fetchUserDataById(parsedUserData.id);
      setUser(data);
      // Ensure data is an array
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // setAddress([data]);
      } else if (Array.isArray(data)) {
        // setAddress(data);
      } else {
        console.log("Fetched data is not an array:", data);
        // setAddress([]);
      }
    } catch (err) {
      console.log("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    if (parsedUserData?.id) {
      getAddrsssData();
    }
  }, [parsedUserData]);


  const handleLogout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.multiRemove(['authToken', 'userId', 'userData']);

      clearToken();
      setLoading(false);
    } catch (err) {
      console.error('Failed to Logout:', err);
      setError('Failed to Logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><LoadingComponent /></View>;
  }
  return (
    <ScrollView style={{ marginTop: 55, backgroundColor: "#F5F5F5" }}>
      <ScrollView style={{ padding: 15, flex: 1 }}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : token ? (
          token ? (
            <>
              {/* Welcome Section */}
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome, {parsedUserData?.name}</Text>
              </View>

              {/* User Details Section */}
              {user && (
                <View style={styles.userDetailsContainer}>
                  <Text style={styles.sectionTitle}>Your Details</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{user?.data?.name || "N/A"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{user?.data?.email || "N/A"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Mobile:</Text>
                    <Text style={styles.value}>{user?.data?.mobile || "N/A"}</Text>
                  </View>
                  {user?.data?.address && (
                    <View style={styles.addressContainer}>
                      <Text style={styles.label}>Address:</Text>
                      <Text style={styles.addressValue}>{user?.data?.address}</Text>
                    </View>
                  )}
                  
                </View>

              )}

              {/* Action Buttons */}
              {/*
              <View style={styles.actionButtons}>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Your Orders</Text>
                </Pressable>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Your Account</Text>
                </Pressable>
              </View>
              */}

              <View style={styles.actionButtons}>
              {/*
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Buy Again</Text>
                </Pressable>
                */}
                <Pressable style={styles.logoutButton} onPress={() => handleLogout()}>
                  <Text style={styles.buttonText}>Logout</Text>
                </Pressable>
              </View>

              {/* Orders Section */}
              {/*
                <View style={styles.ordersContainer}>
                  <Text style={styles.sectionTitle}>Your Orders</Text>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <Pressable style={styles.orderCard} key={order?.id}>
                        <View style={styles.orderDetails}>
                          <Text style={styles.productDetail}>
                            Date: {new Date(order?.createdAt).toLocaleDateString()}
                          </Text>
                          <Text style={styles.productDetail}>
                            Total Price: ₹{order?.totalPrice}
                          </Text>
                          <Text style={styles.productDetail}>
                            Delivery: {order?.delivery}
                          </Text>
                        </View>
                        {order?.orderItems?.map((item) => (
                          <View style={styles.productContainer} key={item.id}>
                            {item.product ? (
                              <View style={styles.orderProductContainer}>
                                <Image
                                  source={{
                                    uri: item.product.productImages[0] || "https://via.placeholder.com/100",
                                  }}
                                  style={styles.productImage}
                                />
                                <View style={styles.productInfo}>
                                  <Text style={styles.productName}>{item.product.itemName}</Text>
                                  <Text style={styles.productPrice}>₹{item.product.sellingPrice}</Text>
                                  <Text style={styles.productQuantity}>
                                    Quantity: {item.quantity}
                                  </Text>
                                </View>
                              </View>
                            ) : (
                              <Text style={styles.noProductText}>
                                No product details available
                              </Text>
                            )}
                          </View>
                        ))}
                      </Pressable>
                    ))
                  ) : (
                    <Text style={styles.noOrdersText}>No orders found</Text>
                  )}
                </View>
                */}
            </>
          ) : (
            <View style={styles.loginContainer}>
              <Text style={styles.noOrdersText}>Your account is not verified.</Text>
              <View style={styles.actionButtons}>
                <Pressable onPress={() => navigation.navigate("Login")} style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Register")} style={styles.button}>
                  <Text style={styles.buttonText}>Register</Text>
                </Pressable>
              </View>
            </View>
          )
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.noOrdersText}>You are not logged in</Text>
            <View style={styles.actionButtons}>
              <Pressable onPress={() => navigation.navigate("Login")} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate("Register")} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );


};

const styles = StyleSheet.create({
  welcomeContainer: {
    backgroundColor: "#00CED1",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  userDetailsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C252E",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#555",
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1C252E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  ordersContainer: {
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderProductContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C252E",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
  },
  productQuantity: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
  },
  addressContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressValue: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
    lineHeight: 20,
  },

});


export default ProfileScreen;
