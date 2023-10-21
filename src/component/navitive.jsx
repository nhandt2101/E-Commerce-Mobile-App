import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screen/Home/Home";
import CartScreen from "../screen/Cart/Cart";
import Customer from "../screen/Customer/Customer";
import LoginScreenSale from "../screen/LoginSalesman/LoginSalesman";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account" component={Customer} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;