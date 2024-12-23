import { StyleSheet, Image } from 'react-native';

export default function DummyImageComponentForInfo() {
    return (
        <Image
            source={require('../../assets/images/DummyImage.jpg')}
            style={styles.productImage}
            resizeMode="contain"
        />
    );
}

const styles = StyleSheet.create({
    productImage: {
        width: "100%",
        height: 400,
        marginTop: 25,
        // marginRight: 10,
        // marginVertical:10,
        // resizeMode: "contain",
    },
});
