import { StyleSheet, Image } from 'react-native';

export default function LogoComponent() {
    return (
        <Image
            source={require('../../assets/images/SHORT_LOGO.png')}
            style={styles.Main_Logo_image}
            resizeMode="contain"
        />
    );
}

const styles = StyleSheet.create({
    Main_Logo_image: {
        height: 50,
        width: 150,
        // marginHorizontal: 10,
    },
});
