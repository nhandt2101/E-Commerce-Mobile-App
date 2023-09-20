import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "";
import HomeScreen from "../screen/Home/Home";
import LoginScreen from "../screen/Login/Login";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={LoginScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;