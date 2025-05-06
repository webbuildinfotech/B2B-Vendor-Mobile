import { StyleSheet, Image, View,Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function LogoComponent({ navigation, token }) {

      const cartItems = useSelector((state) => state.cart.cart);
    
    return (
        <View style={styles.LogoContainer}>
            {/* Red Header with cart icon aligned right */}
            <View style={styles.RedContainer}>
                <View style={styles.RedContent}>
                    <Feather
                        name="shopping-cart"
                        size={24}
                        color="#fff"
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

                    <View
                        style={{
                            position: 'absolute',
                            top: -10,
                            right: 40,
                            backgroundColor: '#ffff',
                            borderRadius: 10,
                            width: 20,
                            height: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>
                            {cartItems.length}
                        </Text>
                    </View>

                       {/* User Icon */}
                       <Feather
                        name="user"
                        size={24}
                        color="#fff"
                        style={{ marginLeft: 15 }}  // Adds some space between icons
                        onPress={() => {
                            if (token) {
                                navigation.navigate('UserProfile');
                            } else {
                                navigation.navigate('Login');
                            }
                        }}
                    />
                    
                </View>
            </View>

            {/* White Section */}
            <View style={styles.WhiteContainer} />

            {/* Floating Logo on the left */}
            <Image
                source={require('../../assets/images/Big_Logo_Short.png')}
                style={styles.Main_Logo_image}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    LogoContainer: {
        width: '100%',
        position: 'relative',
    },
    RedContainer: {
        backgroundColor: '#fe0002',
        height: 60,
        justifyContent: 'center',
    },
    RedContent: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    WhiteContainer: {
        backgroundColor: 'white',
        height: 40,
    },
    Main_Logo_image: {
        position: 'absolute',
        top: 25, // halfway between red and white
        left: 10, // float on the left
        height: 60,
        width: 160,
        zIndex: 10,
        borderWidth: 3,  // White border
        borderColor: '#fff',  // White border color
        borderRadius: 10,  // Optional rounded corners
    },
});
