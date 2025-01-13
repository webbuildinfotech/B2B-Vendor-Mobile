import { StyleSheet } from 'react-native';

// Color Constants
const colors = {
    background: '#f5f5f5',
    primary: '#fe0002',
    white: '#FFFFFF',
    darkText: '#333',
    lightGray: '#EAEAEA',
    buttonText: '#FFFFFF',
    cardBackground: '#FFFFFF',
    buttonBackground: '#007ACC',
    dropdownBorder: '#ccc',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        marginBottom: 30,
    },
    
    cartIcon: {
        position: "absolute",
        right: 15,
        top: 10,
        zIndex: 11,
    },

    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },

    mainCard: {
        padding: 20,
    },
    
  cartButton: {
    backgroundColor: "#fe0002",
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
    contentContainer: {
        padding: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkText,
        marginBottom: 8,
        marginTop: 16,
    },
    dropdownContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.dropdownBorder,
        borderRadius: 8,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dropdown: {
        backgroundColor: colors.white,
        borderRadius: 8,
    },

    // product

    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    details: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007ACC',
    },

    cartIconContainer: {
        // position: 'absolute',
        // right: 20,
        // top: "100%",
        backgroundColor: colors.white,
        padding: 5,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 10,
    },


});

export default styles;
