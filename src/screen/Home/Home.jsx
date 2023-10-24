import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, Dimensions, TextInput } from "react-native";

import Navigator from "../../component/navigative";
import { getAllProduct } from '../../db/product';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  const [products, setProducts] = useState([]);

  const getProductsFromDatabase = async () => {
    try {
      const productData = await getAllProduct();
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products from the database:", error);
    }
  };

  const onSubmitSearch = () => {
    setActiveSearch(true);
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

    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  }, []);

  useEffect(() => {
    getProductsFromDatabase();
  }, []);

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

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSubmitSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
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
});
