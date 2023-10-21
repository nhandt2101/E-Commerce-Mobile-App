import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function Navigator() {
    const navigation = useNavigation();
    return (
        <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={styles.buttonContent}>
            <Icon name="home" size={24} color="white" />
            <Text style={styles.buttonText}>Home</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate("Messages")}
        >
          <View style={styles.buttonContent}>
            <Icon name="envelope" size={24} color="white" />
            <Text style={styles.buttonText}>Messages</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <View style={styles.buttonContent}>
            <Icon name="shopping-cart" size={24} color="white" />
            <Text style={styles.buttonText}>Cart</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate("Account")}
        >
          <View style={styles.buttonContent}>
            <Icon name="user" size={24} color="white" />
            <Text style={styles.buttonText}>Account</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "black",
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    bottomBarButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    buttonContent: {
      flexDirection: "column",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      marginTop: 5,
      marginBottom: 5,
    },
  });
  