import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, Dimensions } from "react-native";
import ReactNativeInputSearchBar from "react-native-input-search-bar";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

// Sample product data
const products = [
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
  {
    id: "3",
    name: "Product 1",
    image: "https://example.com/product1.jpg",
    price: "$10.99",
    description: "abc abc abc abc abc abc abc abc abc abc abc abc abc",
  },
  {
    id: "4",
    name: "Product 2",
    image: "https://example.com/product2.jpg",
    price: "$15.99",
    description: "abc abc abc abc abc abc abc abc abc abc abc abc abc",
  },
  {
    id: "5",
    name: "Product 1",
    image: "https://example.com/product1.jpg",
    price: "$10.99",
    description: "abc abc abc abc abc abc abc abc abc abc abc abc abc",
  },
  {
    id: "6",
    name: "Product 2",
    image: "https://example.com/product2.jpg",
    price: "$15.99",
    description: "abc abc abc abc abc abc abc abc abc abc abc abc abc",
  },
  {
    id: "7",
    name: "Product 1",
    image: "https://example.com/product1.jpg",
    price: "$10.99",
    description: "abc abc abc abc abc abc abc abc abc abc abc abc abc",
  },
  {
    id: "8",
    name: "Product 2",
    image: "https://example.com/product2.jpg",
    price: "$15.99",
    description: "abc abc abc abc abc abc abc abc abc abc abc abc abc",
  },
];

export default function HomeScreen({ route }) {
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  const navigation = useNavigation();

  const onSubmitSearch = (val) => {
    setQuery(val);
  };

  const getNumColumns = () => {
    const screenWidth = Dimensions.get("window").width;
    return screenWidth > 600 ? 3 : 2;
  };

  const [numColumns, setNumColumns] = useState(getNumColumns());

  useEffect(() => {
    const updateLayout = () => {
      setNumColumns(getNumColumns());
    };

    Dimensions.addEventListener("change", updateLayout);

    // Clean up the event listener when the component unmounts
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  }, []); // Truyền một mảng rỗng để đảm bảo useEffect chỉ chạy một lần khi component được tạo.

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription} numberOfLines={1}>
        {item.description.length > 30
          ? item.description.substring(0, 30) + "..."
          : item.description}
      </Text>
      <View style={styles.productActions}>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ReactNativeInputSearchBar
        onSubmitSearch={onSubmitSearch}
        onActiveSearch={setActiveSearch}
        inputTextStyle={{}}
        buttonStyle={{
          paddingHorizontal: 20,
          borderWidth: 0.3,
          borderRadius: 20,
        }}
        buttonTextStyle={{}}
        searchToolContainerStyle={{ height: 40 }}
        inputContainerStyle={{
          backgroundColor: "white",
          borderWidth: 0.3,
          borderRadius: 20,
        }}
        inputProps={{
          placeholder: "Please enter your search query",
          onChangeText: (text) => setQuery(text),
          value: query.toString(),
        }}
        buttonText="Search"
      />

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  productDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  productActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginRight: 5,
  },
  buyButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  productList: {
    paddingHorizontal: 10,
  },
  productItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flex: 1,
    margin: 5,
    alignItems: "center",
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
