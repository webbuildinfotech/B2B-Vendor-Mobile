// styles.js
import { StyleSheet } from 'react-native';

// Color Constants
const colors = {
    background: '#fe0002',
    logoColor: '#007ACC',
    buttonColor: '#ff9900',
    linkColor: '#007185',
    white: '#FFFFFF',
    lightGray: '#EAEAEA',
    lightBack: '#F6F7F8',
    darkGray: '#333',
    bgBlue: '#00CED1',
    purple: '#7F00FF',
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.white,
    },
    Logo_image: {
        height: 50,
        width: 150,
    },
    Main_Logo_image: {
        height: 50,
        width: 150,
        marginHorizontal: 10,
    },
    Verticalline: {
        height: 1,
        borderColor: colors.lightBack,
        borderWidth: 1,
        marginVertical: 5,
    },
    logo: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        width: '100%',
    },
    input: {
        height: 50,
        paddingHorizontal: 10,
        flex: 1,
    },
    input1: {
        height: 100,
        paddingHorizontal: 10,
        flex: 1,
        fontSize: 25,
    },
    button: {
        backgroundColor: colors.buttonColor,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    link: {
        color: colors.linkColor,
        textAlign: 'center',
        marginBottom: 10,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signInText: {
        marginRight: 5,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signUpText: {
        marginRight: 5,
    },
    inputIcon: {
        marginLeft: 10,
    },



    heroContainer: {
        flex: 1,

        backgroundColor: colors.white,
        marginTop: 5,
    },
    cartIcon: {
      position: "absolute",
      right: 15,
      top: 10,
      zIndex: 11,
    },
    mainBox: {
        backgroundColor: colors.lightBack,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.white,
        elevation: 3,
        shadowColor: colors.white,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderRadius: 10,
    },
    headerLogo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.logoColor,
    },
    heroTopView: { backgroundColor: colors.bgBlue, padding: 10, flexDirection: 'row', alignItems: "center" },


    heroTopShop: {
        marginTop: 50,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'left',
        marginHorizontal: 10,
    },
    heroTopSearch: {
        backgroundColor: colors.white,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 50,
        marginTop: 10,
        marginHorizontal: 10,
        width:"75%",
        marginBottom:10,
    },
    
    productTopSearch: {
        backgroundColor: colors.white,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 50,
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom:10,
    },
    dropdownContainer: {
        width: 100,
        marginLeft: 173,
    },
    DropdownStyle: {
        backgroundColor: colors.white,
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 5,
        minWidth: 250,
        alignSelf: 'flex-end',
    },
    MainDropdownStyle: {
        backgroundColor: colors.white,
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 5,
        minWidth: "95%",
        alignSelf: 'flex-end',
        marginVertical:10,
        marginHorizontal:10,
    },
    selectedText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },

    heroPressable: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        gap: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 16,
        color: '#333',
    },

    filterContainer: {
        // marginRight: 10,
        // paddingVertical: 10,
        
        marginTop: 10,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    backText:{
        fontSize: 18,
        fontWeight: 'bold',
    },

    filterButton: {
        marginTop: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    sortButton: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    filterText: {
        fontSize: 18,
        color: colors.white,
        fontWeight: 'bold',
    },
    sortText: {
        fontSize: 18,
        color: colors.white,
        fontWeight: 'bold',
    },
    sortByText: {

        fontSize: 18,
        color: colors.white,
        fontWeight: 'medium',
    },



    heroSearchIcon: { paddingLeft: 10 },
    heroTopNavBar: { backgroundColor: colors.white },
    icon: {
        padding: 10,
    },
    categoryList: {
        paddingVertical: 10,
    },
    category: {
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: colors.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: colors.white,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        padding: 10,
        height: 120,
        width: 100,
    },
    categoryImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginBottom: 5,
    },
    categoryTitle: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.darkGray,
        fontSize: 10,
    },
    featuredSection: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
        elevation: 3,
        shadowColor: colors.white,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.logoColor,
    },

    heroTreanding: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",

        paddingHorizontal: 10,
        backgroundColor: colors.lightBack,
        paddingVertical: 20,
    },

    ResendButtonText: {
        color: colors.logoColor,
        alignItems: 'center',
    },

    heroTopImage: {
        width: '90%',
        marginLeft: 8,
        marginTop: 8,
        padding: 10,
        height: 120,
        borderRadius: 12,
        marginBottom: 5,
    },

    heroProductView: {
        backgroundColor: '#fff',
        borderColor: colors.background,
        borderWidth: 1,
        borderRadius: 10,

    },

    heroProductBottom: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        marginBottom: 10,
        marginTop: 5,

        alignItems: 'center',
    },
    heroProductTitle: {
        marginLeft: 14,
        marginTop: 5,
        color: "#1C252E",
        fontSize: 13,
        fontWeight: "bold",
    },

    heroProductColor: {
        height: 12,
        width: 12,
        borderRadius: 7,
    },

    paginationControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    pageNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,

    },
    activePage: {
        backgroundColor: '#1C252E',
    },
    activePageText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
    pageText: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#1C252E',
    },
    paginationArrow: {
        fontSize: 20,
        marginHorizontal: 10,
        color: '#1C252E',
    },

    heading: {
        fontSize: 20,
        fontWeight: "bold",
    },
    form: {
        marginVertical: 0,
    },
    AddAddressinput: {

        borderColor: "#D0D0D0",
        borderColor: "#D0D0D0",



        marginTop: 10,
    },
    addButton: {
        marginVertical: 30,
        backgroundColor: "#0C68E9",
        padding: 13,
        borderRadius: 5,
        alignItems: "center",
    },

    addButtonDisabled: {
        backgroundColor: "#B0BEC5",
    },

    addButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    addressCard: {
        borderWidth: 1,
        borderColor: "#D0D0D0",
        padding: 10,
        marginVertical: 10,
    },
    addressHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    addressName: {
        fontSize: 15,
        fontWeight: "bold",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 10,
        marginTop: 7,
    },
    editButton: {
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
        borderWidth: 0.9,
        borderColor: "#D0D0D0",
    },
    removeButton: {
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
        borderWidth: 0.9,
        borderColor: "#D0D0D0",
    },
    loginButton: {
        backgroundColor: "#28A745",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },

    emptyLastBox: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-start",
        gap: 3,



        paddingVertical: 5,

        borderColor: "#C0C0C0",

    },
    emptyLastText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1C252E',
    },
});

export default styles;
