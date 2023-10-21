import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const SellerScreen = ({ navigation }) => {
  const [products, setProducts] = useState([
    { id: "1", name: "Product 1", price: "$10.99" },
    { id: "2", name: "Product 2", price: "$15.99" },
    // ... thêm các sản phẩm khác nếu cần
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      setProducts([...products, { id: String(products.length + 1), ...newProduct }]);
      setNewProduct({ name: "", price: "" });
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={newProduct.name}
          onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={newProduct.price}
          onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.productList}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
  },
  productList: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 10,
    width: "100%"
  },
  bottomBarButton: {
    flex: 1,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginTop: 5,
  },
});

export default SellerScreen;
