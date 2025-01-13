import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TextInput } from 'react-native-paper';
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import styles from "../../assets/cssFile";
import { addAddress } from "../../../redux/productAndAddressReducer";
import { addVendorAddress } from "../../BackendApis/userApi";
import { useAuth } from "../../components/AuthToken/AuthContext";

const AddAddressScreen = () => {
  const address = useSelector((state) => state.productAndAddress.address);
  const { token } = useAuth();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    mobile: "",
    street_address: "",
    state: "",
    zip_code: "",
    country: "",
  });


  useEffect(() => {
    if (address) {
      setNewAddress({
        name: address.name || "",
        mobile: address.mobile || "",
        street_address: address.street_address || "",
        state: address.state || "",
        zip_code: address.zip_code || "",
        country: address.country || "",
      });
    }
  }, [address]);

  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState({});


  const handleAddAddress = async () => {
    const isEmptyField = Object.values(newAddress).some(
      (field) => field.trim() === ""
    );

    if (isEmptyField) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }



    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newAddress.mobile)) {
      Toast.show({
        type: "error",
        text1: "Invalid Mobile",
        text2: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    if (newAddress.name.trim().length < 3) {
      Toast.show({
        type: "error",
        text1: "Invalid Name",
        text2: "Name should be at least 3 characters long",
      });
      return;
    }

    const zipCodeRegex = /^[0-9]{5}$/;
    if (!zipCodeRegex.test(newAddress.zip_code)) {
      Toast.show({
        type: "error",
        text1: "Invalid Zip Code",
        text2: "Please enter a valid zip code",
      });
      return;
    }


    if (newAddress.country.trim().length < 3) {
      Toast.show({
        type: "error",
        text1: "Invalid Country",
        text2: "Please enter a valid country name",
      });
      return;
    }

    if (newAddress.state.trim().length < 2) {
      Toast.show({
        type: "error",
        text1: "Invalid State",
        text2: "Please enter a valid state",
      });
      return;
    }

    setLoading(true);

    try {
      if (token) {

        await addVendorAddress(newAddress);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Address added successfully!",
        });
        navigation.navigate("VendorConfirm");
      } else {

        dispatch(addAddress(newAddress));
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Address stored locally!",
        });
        navigation.navigate("OrderConfirm");
      }


      setNewAddress({
        mobile: "",
        street_address: "",
        state: "",
        zip_code: "",
        country: "",
      });
    } catch (error) {
      console.log("Error adding address:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add address. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to add address: ${error.response.data.message || 'Please try again.'}`,
      });
    } else if (error.request) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No response from the server. Please check your network connection and try again.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Unexpected error: ${error.message}`,
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={styles.heading}>Add Your Address</Text>

        {/*
          <Pressable style={styles.emptyLastBox}
            onPress={() => navigation.navigate("Cart")}
          >
            <Feather name="chevron-left" size={20} color="#1C252E" />
            <Text style={styles.emptyLastText}>Back</Text>
          </Pressable>
        */}
        {/* Add Address Form */}
        <View style={styles.form}>

          <TextInput
            label="Name"
            value={newAddress.name}
            onFocus={() => setFocus({ ...focus, name: true })}
            onBlur={() => setFocus({ ...focus, name: false })}
            onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
            mode="outlined"
            style={styles.AddAddressinput}
            theme={{
              colors: {
                primary: focus.name ? "#0C68E9" : "#000",
                text: focus.name ? "#0C68E9" : "#000",
                placeholder: focus.name ? "#0C68E9" : "#000",
                underlineColor: "transparent",
                background: "white",
              },
            }}
          />
          <TextInput
            label="Mobile"
            value={newAddress.mobile}
            onFocus={() => setFocus({ ...focus, mobile: true })}
            onBlur={() => setFocus({ ...focus, mobile: false })}
            onChangeText={(text) => setNewAddress({ ...newAddress, mobile: text })}
            mode="outlined"
            style={styles.AddAddressinput}
            keyboardType="phone-pad"
            theme={{
              colors: {
                primary: focus.mobile ? '#0C68E9' : '#000',
                text: focus.mobile ? '#0C68E9' : '#000',
                placeholder: focus.mobile ? '#0C68E9' : '#000',
                underlineColor: 'transparent',
                background: 'white',
              },
            }}
          />
          <TextInput
            label="Street Address"
            value={newAddress.street_address}
            onFocus={() => setFocus({ ...focus, street_address: true })}
            onBlur={() => setFocus({ ...focus, street_address: false })}
            onChangeText={(text) => setNewAddress({ ...newAddress, street_address: text })}
            mode="outlined"
            style={styles.AddAddressinput}
            theme={{
              colors: {
                primary: focus.street_address ? '#0C68E9' : '#000',
                text: focus.street_address ? '#0C68E9' : '#000',
                placeholder: focus.street_address ? '#0C68E9' : '#000',
                underlineColor: 'transparent',
                background: 'white',
              },
            }}
          />
          <TextInput
            label="State"
            value={newAddress.state}
            onFocus={() => setFocus({ ...focus, state: true })}
            onBlur={() => setFocus({ ...focus, state: false })}
            onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
            mode="outlined"
            style={styles.AddAddressinput}
            theme={{
              colors: {
                primary: focus.state ? '#0C68E9' : '#000',
                text: focus.state ? '#0C68E9' : '#000',
                placeholder: focus.state ? '#0C68E9' : '#000',
                underlineColor: 'transparent',
                background: 'white',
              },
            }}
          />
          <TextInput
            label="Zip Code"
            value={newAddress.zip_code}
            onFocus={() => setFocus({ ...focus, zip_code: true })}
            onBlur={() => setFocus({ ...focus, zip_code: false })}
            onChangeText={(text) => setNewAddress({ ...newAddress, zip_code: text })}
            mode="outlined"
            style={styles.AddAddressinput}
            keyboardType="numeric"
            theme={{
              colors: {
                primary: focus.zip_code ? '#0C68E9' : '#000',
                text: focus.zip_code ? '#0C68E9' : '#000',
                placeholder: focus.zip_code ? '#0C68E9' : '#000',
                underlineColor: 'transparent',
                background: 'white',
              },
            }}
          />
          <TextInput
            label="Country"
            value={newAddress.country}
            onFocus={() => setFocus({ ...focus, country: true })}
            onBlur={() => setFocus({ ...focus, country: false })}
            onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
            mode="outlined"
            style={styles.AddAddressinput}
            theme={{
              colors: {
                primary: focus.country ? '#0C68E9' : '#000',
                text: focus.country ? '#0C68E9' : '#000',
                placeholder: focus.country ? '#0C68E9' : '#000',
                underlineColor: 'transparent',
                background: 'white',
              },
            }}
          />

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              loading && styles.addButtonDisabled, // If loading, apply disabled style
              pressed && !loading && { opacity: 0.8 }, // Visual feedback on press
            ]}
            onPress={handleAddAddress}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>
              {loading ? "Adding..." : "Add Address"}
            </Text>
          </Pressable>

        </View>
      </View>
    </ScrollView>
  );
};

export default AddAddressScreen;
