import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Navigator from "../../component/navigative";

import { getData } from "../../component/store";
import { insertCart, dropTableCart, createTableCart } from "../../db/cart";


export default function ShoppingCartScreen({ navigation }) {
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);

    // useEffect(() => {
    //     console.log("Product updated:", product);
    // }, [product]);

    // useEffect(() => {
    //     console.log("User updated:", user);
    // }, [user]);

    const fetchData = async () => {
        try {
            const data = await getData("@product");
            const data_user = await getData("@user");
            setProduct(data);
            setUser(data_user);
        } catch (error) {
            console.error("Error retrieving data:", error);
        }
    };

    const addToCart = (item) => {
        const { describe, link_img, price, productName, sale_id } = item;
        insertToCart(describe, link_img, price, productName, sale_id, user.id, quantity);
    };

    const insertToCart = async (describe, link_img, price, productName, sale_id, user_id, quantity) => {
        try {
            await insertCart(productName, price, describe, link_img, quantity, sale_id, user_id);
            console.log("done");
        } catch (error) {
            alert('Vui lòng thử lại.');
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            {product != null ? (
                <>
                    <Text style={styles.title}>{product.productName}</Text>
                    <View style={styles.content}>
                        <View key={product.id} style={styles.productContainer}>
                            <Image source={{ uri: product.link_img }} style={styles.productImage} />
                            <Text style={styles.productPrice}>Price: {product.price}</Text>

                            <View style={styles.quantityContainer}>
                                <View style={styles.quantityButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => setQuantity(quantity - 1)}
                                        disabled={quantity === 1}
                                    >
                                        <Text style={styles.quantityButtonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => setQuantity(quantity + 1)}
                                    >
                                        <Text style={styles.quantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.buyButton}>
                                    <Text style={styles.buyButtonText} onPress={() => addToCart(product)}>Add to Cart</Text>
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
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    quantityButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    quantityButton: {
        backgroundColor: '#DDDDDD',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
    quantityButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
    buyButton: {
        backgroundColor: 'blue',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 4,
    },
    buyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});