import { StyleSheet } from 'react-native';

// Color Constants
const colors = {
    background: '#fe0002',
    activeDoteColor: "#ec293362",
    textColor: "#1C252E",
    logoColor: '#007ACC',
    buttonColor: '#ff9900',
    linkColor: '#007185',
    white: '#FFFFFF',
    lightGray: '#EAEAEA',
    grayBackground: '#807f7fc2',
    darkGray: '#333',
    bgBlue: '#00CED1',
    purple: '#7F00FF',
};

const styles = StyleSheet.create({

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    loadingOverlay: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        shadowColor: colors.textColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },

    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: colors.background,
    },

    errorContainer: {
        backgroundColor: '#ffe6e6',
        borderColor: '#fe0002',
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },

    errorText: {
        flex: 1,
        fontSize: 16,
        color: '#fe0002',
        marginLeft: 10,
    },

    dismissButton: {
        backgroundColor: '#fe0002',
        borderRadius: 5,
        padding: 5,
        marginLeft: 10,
    },

    dismissButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },


    heroContainer: {
        flex: 1,

        backgroundColor: colors.white,
        marginTop: 5,
    },
    Main_Logo_image: {
        width: 150,
        height: 50,

    },

    cartIcon: {
        position: "absolute",
        right: 15,
        top: 10,
        zIndex: 11,
    },


    Verticalline: {
        height: 2,
        borderColor: colors.white,
        borderWidth: 2,

    }, mainBox: {
        backgroundColor: "#f5f5f5", // Light gray for a subtle background
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },

    productTopSearch: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        paddingVertical: 7,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        paddingVertical: 10,
    },

    searchIcon: {
        backgroundColor:"red",
        borderRadius: 25,
        padding: 8,
        borderLeftWidth: 1,
        borderLeftColor: "#ddd",
    },

    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },

    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        backgroundColor: colors.activeDoteColor,
        margin: 5,
        display: "none",
    },
    activeDot: {
        backgroundColor: colors.background,
    },

    mainCategoryBox: {
        backgroundColor: colors.grayBackground,
    },

    categoryListBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        marginBottom: 10,
        marginHorizontal: 12,
    },

    categoryContainer: {
        width: '30.83%',
        marginBottom: 10,
        margin: 4,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.background,
        borderWidth: 1,
    },


    productListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    productColumn: {
        width: '50%',

    },

    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },

    productContainer: {
        flex: 1 / 2,
        margin: 7,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderColor: '#ddd',
        borderWidth: 1,
    },

    categoryImage: {
        width: '100%',
        height: 80,
        borderRadius: 10,
        marginBottom: 5,
    },

    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 5,
    },

    productPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
    },

    productDes: {
        fontSize: 12,
        marginTop: 5,
    },


    productText: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textColor,
        marginHorizontal: 16,
        marginVertical: 10,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
    },

    productListTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 2,
    },

    productTextAndIcon: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.background,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    viewAllText: {
        // fontSize: 18,
        fontWeight: '700',
        color: colors.background,

    },

    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textColor,
    },
    productName: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textColor,
    },
    productDescription: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textColor,
    },

    buttonContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    showMoreButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        borderRadius: 1,
    },
    showMoreText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    showLessButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        borderRadius: 1,
    },
    showLessText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    counterContainer: {
        alignItems: 'center',
    },
    counterText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default styles;
