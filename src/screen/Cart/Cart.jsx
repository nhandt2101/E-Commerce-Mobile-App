import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Navigator from "../../component/navigative";

import { getCart, deleteCart } from "../../db/cart";
import { getData, storeData } from "../../component/store";

export default function CartScreen({ navigation }) {
    const [products, setProducts] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [totalPrice, setTotalPrice] = useState("0đ");
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        getuser();
    }, [user]);

    const getuser = async () => {
        try {
            const data_user = await getData("@user");
            setUser(data_user);
        } catch (error) {
            console.error("Error retrieving data:", error);
        }
    }

    const fetchData = async () => {
        if(user != null) {
            try {
                console.log(user.id)
                const data = await getCart(user.id);
                setProducts(data);
            } catch (error) {
                console.error("Error retrieving data:", error);
            }
        }
        
    };

    const calculateTotalPrice = (updatedProducts) => {
        let total = 0;

        for (let i = 0; i < updatedProducts.length; ++i) {
            if (updatedProducts[i].isSelect) {
                const priceString = updatedProducts[i].price.replace(/[^0-9]/g, "");
                const price = parseInt(priceString);
                total += price * updatedProducts[i].quantity;
                console.log(price);
            }
        }

        const formattedTotal = total.toLocaleString("vi-VN");
        const displayTotal = formattedTotal + "đ";
        console.log(displayTotal);

        setTotalPrice(displayTotal);
    };

    const deleteItem = async (item) => {
        try {
            await deleteCart(item.id);
        } catch (e) {
            console.log("error");
        }
    }

    const toggleProductSelection = (item) => {
        const updatedProducts = products.map((product) => {
            if (product.id === item.id) {
                return {
                    ...product,
                    isSelect: !product.isSelect,
                };
            }
            return product;
        });

        let dem = 0;
        updatedProducts.map((product) => {
            dem += product.isSelect;
        })

        if (dem == products.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }

        setProducts(updatedProducts);
        calculateTotalPrice(updatedProducts);
    };

    const toggleSelectAll = () => {
        let x = !selectAll
        setSelectAll(x);

        const updatedProducts = products.map((product) => {
            return {
                ...product,
                isSelect: x,
            };
        });

        setProducts(updatedProducts);
        calculateTotalPrice(updatedProducts);
    };

    const deleteProducts = async () => {
        let updatedProducts = []
        for (let i = 0; i < products.length; ++i) {
            if (products[i].isSelect) {
                await deleteItem(products[i]);
            } else {
                updatedProducts.push(products[i]);
            }
        }

        setProducts(updatedProducts);
    }

    const renderItem = ({ item }) => (
        <View style={styles.productItem}>
            <View style={styles.productItem}>
                <View style={styles.productActions}>
                    <View style={styles.productActions}>
                        <TouchableOpacity onPress={() => toggleProductSelection(item)}>
                            <View
                                style={[
                                    styles.checkbox,
                                    item.isSelect ? styles.checkboxSelected : null,
                                ]}
                            />
                        </TouchableOpacity>
                        <Image source={{ uri: item.link_img }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.productName}</Text>
                            <Text style={styles.productDescription} numberOfLines={1}>
                                {item.describe}
                            </Text>
                            <Text style={styles.productPrice}>{item.price}</Text>
                            <View style={styles.productRow}>
                                <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
                                <TouchableOpacity style={styles.buyButton} onPress={() => console.log(item)}>
                                    <Text style={styles.buyButtonText}>Buy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item)}>
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.selectAllRow}>
                <TouchableOpacity onPress={() => toggleSelectAll()} style={styles.selectAllContainer}>
                    <View
                        style={[
                            styles.checkbox,
                            selectAll ? styles.checkboxSelected : null,
                        ]}
                    />
                    {selectAll ? <Text style={styles.selectAllText}>Bỏ chọn tất cả</Text> : <Text style={styles.selectAllText}>Chọn tất cả</Text>}
                </TouchableOpacity>
                <View style={styles.actionsContainer}>
                    <View style={styles.productRow}>
                        <TouchableOpacity style={styles.buyButton} onPress={() => console.log("Not things")}>
                            <Text style={styles.buyButtonText}>Buy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProducts()}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

            <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceText}>Total Price: {totalPrice}</Text>
            </View>
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
        width: 130,
        height: 130,
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
    productRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    quantityText: {
        fontSize: 14,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: "red",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "black",
        marginRight: 10,
    },
    checkboxSelected: {
        backgroundColor: "black",
    },

    selectAllButton: {
        backgroundColor: "blue",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    selectAllButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    deleteSelectedButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteSelectedButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    selectAllContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    totalPriceContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    totalPriceText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    selectAllRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        justifyContent: "space-between",
    },
    selectAllContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    selectAllText: {
        marginLeft: 10,
    },
    actionsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
