import { StyleSheet, Image, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function LogoComponent({ navigation, token }) {
    return (
        <View style={styles.LogoContainer}>
            <View style={styles.RedContainer}/>
            <Image
                source={require('../../assets/images/Big_Logo_Short.png')}
                style={styles.Main_Logo_image}
                resizeMode="contain"
            />
            <View style={styles.WhiteContainer} />
        </View>
    );
}

const styles = StyleSheet.create({
    LogoContainer: {
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
    },
    RedContainer: {
        backgroundColor: '#fe0002',
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    WhiteContainer: {
        backgroundColor: 'white',
        height: 40,
    },
    Main_Logo_image: {
        position: 'absolute',
        top: 10,
        left: 10,
        height: 50,
        width: 150,
        zIndex: 10,
    },
    cartIcon: {
        marginRight: 10,
        zIndex: 11,
    },
});
