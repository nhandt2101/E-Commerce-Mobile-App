import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import HomeScreen from './src/screen/Home/Home';
import LoginScreen from './src/screen/Login/Login';
import Register from './src/screen/Register/Register';
import HomeSalesman from './src/screen/Home/HomeSalesman';
import CartScreen from './src/screen/Cart/Cart';
import Customer from './src/screen/Customer/Customer';
import ShoppingCartScreen from './src/screen/Cart/Shopping';
import productDetails from './src/screen/Cart/ProductDetails';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <StatusBar
          backgroundColor="#ffffff"
          barStyle="dark-content"
        />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: true,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="HomeSalesman" component={HomeSalesman} />
          <Stack.Screen name="Account" component={Customer} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Shopping" component={ShoppingCartScreen} />
          <Stack.Screen name="ProductDetails" component={productDetails}/>
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;
