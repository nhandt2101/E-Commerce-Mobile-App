import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Navigator from "../../component/navigative";

const productsInCart = [
    {
        id: "1",
        name: "Product 1",
        image: "https://example.com/product1.jpg",
        price: "$10.99",
        description: "abc abc abc abc abc abc abc abc abc abc abc abc abc",
    },
    {
        id: "2",
        name: "Product 2",
        image: "https://example.com/product2.jpg",
        price: "$15.99",
        description: "abc abc abc abc abc abc abc abc abc abc abc abc abc",
    },
    // Add more products as needed
];

export default function CartScreen({ route }) {
    const renderItem = ({ item }) => (
        <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDescription} numberOfLines={1}>
                {item.description.length > 30
                    ? item.description.substring(0, 30) + "..."
                    : item.description}
            </Text>
            <Text style={styles.productPrice}>{item.price}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={productsInCart}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Navigator></Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    productItem: {
        backgroundColor: "#ffffff",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        marginBottom: 5,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    productDescription: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "green",
    },
});
