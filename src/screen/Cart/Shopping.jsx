import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Navigator from "../../component/navigative";

import { getData } from "../../component/store";


export default function ShoppingCartScreen({ navigation }) {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("Product updated:", product);
    }, [product]);

    const fetchData = async () => {
        try {
            const data = await getData("@product");
            setProduct(data);
        } catch (error) {
            console.error("Error retrieving data:", error);
        }
    };

    return (
        <View style={styles.container}>
            {product != null ? (
                <>
                    <Text style={styles.title}>{product.productName}</Text>
                    <View style={styles.content}>
                        <View key={product.id} style={styles.productContainer}>
                            <Image source={{ uri: product.link_img }} style={styles.productImage} />
                            <View>
                                <Text style={styles.productPrice}>Price: {product.price}</Text>
                                <TouchableOpacity style={styles.buyButton}>
                                    <Text style={styles.buyButtonText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    <Navigator />
                </>
            ) : (
                <>
                    <Text>Loading...</Text>
                    <Navigator />
                </>

            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    content: {
        flex: 1,
        alignItems: "center",
    },
    productContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    productImage: {
        width: 300,
        height: 300,
        resizeMode: "cover",
        marginBottom: 5,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    productPrice: {
        fontSize: 26,
        fontWeight: "bold",
        color: "green",
        marginRight: 5,
        alignItems: "center",
    },
    buyButton: {
        backgroundColor: "blue",
        padding: 8,
        borderRadius: 5,
        alignItems: "center",
        width: 300,
    },
    buyButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 28,
    },
});