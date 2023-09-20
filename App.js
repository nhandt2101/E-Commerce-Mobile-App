import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import LoginScreen from './src/screen/Login/Login';
import HomeScreen from './src/screen/Home/Home';
import Register from './src/screen/Register/Register';

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
          initialRouteName="Register"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;