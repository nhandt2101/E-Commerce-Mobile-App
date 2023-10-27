import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import Navigator from "../../component/navigative";
import Icon from "react-native-vector-icons/FontAwesome";
import { getData, storeData } from "../../component/store";
import { insertCart} from "../../db/cart";
import { findProduct } from "../../db/product";


export default function ProductDetails({ navigation }) {
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState(null);
    const [user, setUser] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        fetchData();
    }, [product]);

    const fetchData = async () => {
        try {
            const data = await getData("@product");
            const data_user = await getData("@user");
            const data_2 = await findProduct(data.productName, 30)
            setProduct(data);
            setUser(data_user);
            setProducts([...data_2])
        } catch (error) {
            console.error("Error retrieving data:", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const addToCart = async (item) => {
        try {
            const { describe, link_img, price, productName, sale_id } = item;
            insertCart(productName, price, describe, link_img, quantity,  sale_id, user.id );
            alert("done");
        } catch (e) {
            alert('Vui lòng thử lại.');
            console.log(e);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.productItem} onPress={() => {
            storeData("@product", item);
            setProduct(null);
            setIsAddingToCart(true);
        }}>
            <Image source={{ uri: item.link_img }} style={styles.productImage} />
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
                {item.describe.length > 30 ? item.describe.substring(0, 30) + "..." : item.describe}
            </Text>
            <Text style={styles.productPrice}>{item.price}</Text>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            {product != null ? (
                <>  
                    <ScrollView style={{flex:1,}}>
                        <View style={styles.content}>
                            <View key={product.id} style={styles.productContainer}>
                                <Image source={{ uri: product.link_img }} style={styles.productImage} />
                            </View>
                            <View style={{marginLeft: 5, marginRight:5,}}> 
                                <Text>{product.productName}</Text>
                                <Text style={{fontWeight:"bold", color:"red"}}>Price: {product.price}</Text>
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
                                <Text>Description: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
                            </View>
                        </View> 
                        <View style={{flexDirection: "row", marginTop:20,}}>
                            <TextInput
                                style={styles.commentText}
                                placeholder="  Danh gia san pham"
                            />
                            <TouchableOpacity >
                                <Image source={require('../../../assets/send.png')} style={styles.commentButton}/>
                            </TouchableOpacity>
                        </View>
                        <ScrollView max>
                            <View style={{flexDirection: "row", marginLeft:10}}>
                                <Icon name="user" size={30} color="blue"/>
                                <Text style={styles.fakeComment}> Very nice</Text>
                            </View>
                            <View style={{flexDirection: "row", marginLeft:10}}>
                                <Icon name="user" size={30} color="blue"/>
                                <Text style={styles.fakeComment}> Oh my Goddddddddddddddd!!!!!!!!!!!!!!!!!</Text>
                            </View>
                            <View style={{flexDirection: "row", marginLeft:10}}>
                                <Icon name="user" size={30} color="blue"/>
                                <Text style={styles.fakeComment}> ạkfkjashfkjasncjaksvnajncasjb svjbbbbbbbbbbbbbjkakkkkkkkkkkádasdasa</Text>
                            </View>
                        </ScrollView>
                        
                        {products != null ? (
                            <ScrollView>
                                <Text style={styles.sectionTitle}>Sản phẩm tương tự</Text>
                                <FlatList
                                    data={products}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    numColumns={2}
                                    contentContainerStyle={styles.productList}
                                />
                            </ScrollView>
                        ) : (
                            <Text></Text>
                        )}
                    </ScrollView>
                    <Navigator/>
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
    },
    productContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    productImage: {
        width: 150,
        height: 150,
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
    productItem: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
        padding: 10,
        backgroundColor: "#f3f3f3",
        borderRadius: 5,
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
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
    productDescription: {
        fontSize: 12,
        textAlign: "center",
        marginBottom: 5,
    },
    buyButton: {
        backgroundColor: 'blue',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 4,
    },
    productList: {
        paddingHorizontal: 10,
    },
    commentText: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        marginRight: 5,
        marginLeft: 10,
        borderRadius: 10,
        flex : 1,
    },
    commentButton: {
        height : 30,
        width : 30,
        marginTop : 5,
        marginRight : 10,
    },
    buyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fakeComment: {
        borderColor: "gray",
        flex : 1,
        minHeight: 30,
        borderWidth : 1,
        marginRight: 10,
        marginBottom : 10, 
        marginLeft: 10,
        borderRadius: 10,
    },
});