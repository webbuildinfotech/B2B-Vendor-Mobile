import { StyleSheet, Image } from 'react-native';

export default function DummyImageComponent() {
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
        width: '100%', // Make image responsive
        height: 120,
        borderRadius: 10,
        marginBottom: 5,
    },
});
