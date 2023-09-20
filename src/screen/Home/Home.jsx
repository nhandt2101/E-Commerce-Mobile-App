import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import ReactNativeInputSearchBar from "react-native-input-search-bar";

const products = [
  // Sample data for products
  // ...
];

export default function HomeScreen({ route }) {
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  const [numColumns, setNumColumns] = useState(getNumColumns());

  // Function to get the number of columns based on screen orientation
  function getNumColumns() {
    const screenWidth = Dimensions.get("window").width;
    return screenWidth > 600 ? 5 : 2; // Adjust this threshold as needed
  }

  useEffect(() => {
    // Listen for changes in screen dimensions (e.g., device rotation)
    const updateLayout = () => {
      setNumColumns(getNumColumns());
    };

    Dimensions.addEventListener("change", updateLayout);

    // Clean up the event listener when the component unmounts
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  }, []);

  const onSubmitSearch = (val) => {
    setQuery(val);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ReactNativeInputSearchBar
        onSubmitSearch={onSubmitSearch}
        onActiveSearch={setQuery}
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
        contentContainerStyle={styles.productList} // Define a style for the product list container
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  productItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flex: 1,
    margin: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  buyButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  productList: {
    paddingHorizontal: 10, // Adjust spacing as needed
  },
});
