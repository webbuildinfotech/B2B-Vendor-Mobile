import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { UserContext } from './UserContext';
import { AuthProvider } from './src/components/AuthToken/AuthContext';
import StackNavigator from './navigation/StackNavigator';
import store from './store';

// const ToastWithRef = forwardRef((props, ref) => {
//   return <Toast {...props} ref={ref} />;
// });

const App = () => {
  return (
    <Provider store={store}>
      <UserContext>
        <View style={styles.container}>
          <AuthProvider>
            <StackNavigator />
            <Toast />
            {/* Toast setup
              <ToastWithRef ref={(ref) => Toast.setRef(ref)} />
               */}
          </AuthProvider>
        </View>
      </UserContext>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
