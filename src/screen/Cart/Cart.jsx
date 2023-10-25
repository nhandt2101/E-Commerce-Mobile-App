import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Navigator from "../../component/navigative";

import { createTableCart, dropTableCart, getCart } from "../../db/cart";

export default function CartScreen({ navigation }) {
    const [products, setProducts] = useState(null);

    useEffect(() => {
        createTableCart();
        fetchData();
    }, []);

    // useEffect(() => {
    //     console.log("Product updated:", products);
    // }, [products]);

    const fetchData = async () => {
        try {
            const data = await getCart();
            console.log(data)
            setProducts(data);
        } catch (error) {
            console.error("Error retrieving data:", error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.productItem}>
            <View style={styles.productActions}>
                <Image source={{ uri: item.link_img }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.productDescription} numberOfLines={1}>
                        {item.describe}
                    </Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                    <TouchableOpacity style={styles.buyButton} onPress={() => addToCart(item)}>
                        <Text style={styles.buyButtonText}>Buy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
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
    productActions: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
      },
      productImage: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        marginRight: 10,
      },
      productInfo: {
        flex: 1,
        justifyContent: "center",
      },
      productName: {
        fontSize: 18,
        fontWeight: "bold",
      },
      productDescription: {
        fontSize: 14,
        color: "gray",
        marginBottom: 5,
      },
      productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "green",
        marginRight: 5,
      },
      buyButton: {
        backgroundColor: "blue",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
      buyButtonText: {
        color: "white",
        fontWeight: "bold",
      },
});
