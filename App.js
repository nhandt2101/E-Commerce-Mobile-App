import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import LoginScreen from './src/screen/Login/Login';
import HomeScreen from './src/screen/Home/Home';
import Register from './src/screen/Register/Register';
import LoginSalesman from './src/screen/LoginSalesman/LoginSalesman';
import RegisterSalesman from './src/screen/RegisterSalesman/RegisterSalesman';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      {/* Rest of your code */}
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
          <Stack.Screen name="LoginSalesman" component={LoginSalesman} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="RegisterSalesman" component={RegisterSalesman} />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;