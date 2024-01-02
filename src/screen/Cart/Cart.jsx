import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Navigator from "../../component/navigative";

import { getCart, deleteCart, createTableCart } from "../../db/cart";
import { getData } from "../../component/store";
import { calculateShippingCost } from "../../db/shipCost";
import { insertOrder, createTableOrder } from "../../db/order";

export default function CartScreen({ navigation }) {
    const [products, setProducts] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [totalPrice, setTotalPrice] = useState("0đ");
    const [totalProduct, setTotalProduct] = useState("0đ");
    const [totalShip, setTotalShip] = useState("0đ");
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function initializeDatabase() {
            try {
              await createTableOrder();
              console.log("done")
            } catch (error) {
              console.error("Error initializing database:", error);
            }
          }
        initializeDatabase();
      }, []);

    useEffect(() => {
        fetchData();
        if (user == null) getuser();
    }, [user]);

    const getuser = async () => {
        try {
            const data_user = await getData("@user");
            setUser(data_user);
            console.log(data_user);
        } catch (error) {
            console.error("Error retrieving data3:", error);
        }
    }

    const fetchData = async () => {
        if (user != null) {
            try {
                const data = await getCart(user.id);
                setProducts(data);
            } catch (error) {
                console.error("Error retrieving data4:", error);
            }
        }
    };

    const calculateTotalPrice = async (updatedProducts) => {
        let totalPro = 0;
        let totalShipCost = 0;

        for (let i = 0; i < updatedProducts.length; ++i) {
            if (updatedProducts[i].isSelect) {
                const priceString = updatedProducts[i].price.replace(/[^0-9]/g, "");
                const price = parseInt(priceString);
                totalPro += price * updatedProducts[i].quantity;
                // totalShipCost += calculateShippingCost(user.address, updatedProducts[i].address_sale)
                totalShipCost += await calculateShippingCost(user.address, "Ho chi minh, Viet Nam")
            }
        }

        let formattedTotalPro = totalPro.toLocaleString("vi-VN");
        let displayTotalPro = formattedTotalPro + "đ";
        setTotalProduct(displayTotalPro);

        // console.log(totalShipCost)

        let formattedTotalShip = totalShipCost.toLocaleString("vi-VN");
        let displayTotalShip = formattedTotalShip + "đ";
        setTotalShip(displayTotalShip);

        let formattedTotal = (totalPro + totalShipCost).toLocaleString("vi-VN");
        let displayTotal = formattedTotal + "đ";
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

    const buyProducts = async () => {
        try {
            for (let i = 0; i < products.length; ++i) {
                if (products[i].isSelect) {
                    await insertOrder(
                        products[i].productName, 
                        products[i].price, 
                        products[i].describe, 
                        products[i].link_img. 
                        products[i].quantity, 
                        products[i].sale_id, 
                        user.id
                    );
                } 
            }
    
            await deleteProducts();

            alert("done")

            console.log("done");
        } catch (e) {
            console.log("buyProducts",e);
        }
        
    }

    const buyProduct = async (item) => {
        
        try {
            await deleteItem(item);
            await insertOrder(
                item.productName,
                item.price,
                item.describe,
                item.link_img,  
                item.quantity,
                item.sale_id,
                user.id
            );

            alert("done")
            
            console.log("done");
        } catch (e) {
            console.log("buyProduct", e);
        }
        
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
                                <TouchableOpacity style={styles.buyButton} onPress={() => buyProduct(item)}>
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
                        <TouchableOpacity style={styles.buyButton} onPress={() => buyProducts()}>
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
                <Text style={styles.totalPriceText}>Total Product: {totalProduct} {'\n'} </Text>
                <Text style={styles.totalPriceText}>Total Shipping: {totalShip} {'\n'}</Text>
                <Text style={styles.totalPriceText}>Total Price: {totalPrice} {'\n'}</Text>
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
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    totalPriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'right',
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
