import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, Dimensions, TextInput } from "react-native";

import Navigator from "../../component/navigative";
import { createTableProduct, dropTableProduct, findProductCombined } from '../../db/product';
import data from "../../db/products.json";
import { getData, storeData } from "../../component/store";

export default function HomeScreen({ navigation }) {

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [txt, setTxt] = useState("Loadding...");

  useEffect(() => {
    async function initializeDatabase() {
      await createTableProduct();
    }
    initializeDatabase();
  });

  const onSubmitSearch = async () => {
    try {
      const data = await findProductCombined(query);
      setProducts([...data]);
      if (products.length === 0) {
        setTxt("Sorry! No find products.")
      }
    } catch (e) {
      console.log(e);
      setTxt("Sorry! No find products.")
      setProducts([]);
    }
  }

  const getNumColumns = () => {
    const screenWidth = Dimensions.get("window").width;
    return screenWidth > 600 ? 3 : 2;
  };

  const [numColumns, setNumColumns] = useState(getNumColumns());

  useEffect(() => {
    onSubmitSearch();
  }, [query])

  const addToCart = async (product) => {
    try {
      storeData("@product", product);
      navigation.navigate('Shopping');
    } catch (error) {
      console.error("Error store data:", error);
    }

  };

  const productDetails = async (product) => {
    try {
      storeData("@product", product);
      navigation.navigate('ProductDetails');
    } catch (error) {
      console.error("Error store data:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <TouchableOpacity onPress={() => productDetails(item)}>
        <Image source={{ uri: item.link_img }} style={styles.productImage} />
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {item.describe.length > 30 ? item.describe.substring(0, 30) + "..." : item.describe}
        </Text>
      </TouchableOpacity>
      <View style={styles.productActions}>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity style={styles.buyButton} onPress={() => addToCart(item)}>
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

      {products.length === 0 ? (
        <Text>{txt}</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.productList}
        />
      )}

      <Navigator></Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 33,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 5,
    marginLeft: 15,
    borderRadius: 8
  },
  searchButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
    marginRight: 15,
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
