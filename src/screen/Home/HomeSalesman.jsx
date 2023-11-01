import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Image } from "react-native";

import Navigator from "../../component/navigative";
import { getBySale, deleteProduct, insertProduct } from "../../db/product";
import { getData } from "../../component/store";

const SellerScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [newProduct, setNewProduct] = useState({ productName: "", price: "", describe: "", link_img: "" });

  useEffect(() => {
    fetchData();
  }, [products]);

  useEffect(() => {
    getuser();
  }, [user]);

  const getuser = async () => {
    try {
      let data = await getData("@user");
      setUser(data);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  const fetchData = async () => {
    if (user == null) {
      return;
    }
    try {
      console.log(user.id);
      let data = await getBySale(user.id);
      setProducts(data);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price) {
      try {
        await insertProduct(newProduct.productName, newProduct.price, newProduct.describe, newProduct.link_img, user.id)
        setNewProduct({ productName: "", price: "", describe: "", link_img: "" });

        alert("done");
      } catch (error) {
        console.error("Error retrieving data:", error);
        alert("error");
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId.id);

      alert("done");
    } catch (error) {
      console.error("Error retrieving data:", error);
      alert("error");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productItem}>
        <View style={styles.productActions}>
          <View style={styles.productActions}>
            <TouchableOpacity>
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
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProduct(item)}>
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={newProduct.productName}
          onChangeText={(text) => setNewProduct({ ...newProduct, productName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newProduct.describe}
          onChangeText={(text) => setNewProduct({ ...newProduct, describe: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Link image"
          value={newProduct.link_img}
          onChangeText={(text) => setNewProduct({ ...newProduct, link_img: text })}
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
      {products.length === 0 ? (
        <>
          <FlatList />
          <Text></Text>
        </>
      ) : (
        <>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.productList}
          />
        </>
      )}
      <Navigator></Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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
});

export default SellerScreen;
