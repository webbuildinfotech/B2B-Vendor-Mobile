import { StyleSheet, Image } from 'react-native';

export default function DummyImageComponentForCart() {
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
        width: 140, // Make image responsive
        height: 140,
        borderRadius: 10,
        marginBottom: 5,
    },
});
