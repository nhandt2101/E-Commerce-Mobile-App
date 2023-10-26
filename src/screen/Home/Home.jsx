import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, Dimensions, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navigator from "../../component/navigative";
import { createTableProduct, dropTableProduct, getAllProduct, insertProduct, findProduct, findProductTrue } from '../../db/product';
import data from "../../db/products.json";
import { getData, storeData } from "../../component/store";

export default function HomeScreen({ navigation }) {
  const navigation2 = useNavigation();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [txt, setTxt] = useState("Loadding...");

  // const getProductsFromDatabase = async () => {
  //   try {
  //     const productData = await getAllProduct();
  //     setProducts(productData);
  //   } catch (error) {
  //     console.error("Error fetching products from the database:", error);
  //     setTxt("Khong tim thay san pham");
  //     setProducts([]);
  //   }
  // };

  const onSubmitSearch = async () => {
<<<<<<< HEAD
    console.log(query.length);
=======
    // console.log(query);
>>>>>>> c70b606d7b1ed267e4c273ec3f3b2c852c75bddd

    try {
      const data = await findProductTrue(query);
      setProducts([...data]);
      // console.log(products)
    } catch (e) {
      console.log(e);
      setProducts([]);
    }
  }

  const taodb = () => {
    // dropTableProduct()
    //   .then(() => {
    //   })
    //   .catch((error) => {
    //     console.error("Error dropping table:", error);
    //   });

<<<<<<< HEAD
    createTableProduct();
    for (let i = 0; i < data.length; ++i) {
      insertProduct(data[i].name, data[i].price, data[i].describe, data[i].link_img, 0)
      console.log(data[i]['sale_id']);
    }
  };
=======
    
  // };
>>>>>>> c70b606d7b1ed267e4c273ec3f3b2c852c75bddd

  const getNumColumns = () => {
    const screenWidth = Dimensions.get("window").width;
    return screenWidth > 600 ? 3 : 2;
  };

  const [numColumns, setNumColumns] = useState(getNumColumns());

  useEffect(() => {
<<<<<<< HEAD
    // onSubmitSearch();
=======
    onSubmitSearch();
>>>>>>> c70b606d7b1ed267e4c273ec3f3b2c852c75bddd
    // getProductsFromDatabase();
  }, [])

  const addToCart = async (product) => {
    try {
      storeData("@product", product);
      navigation.navigate('Shopping');
    } catch (error) {
      console.error("Error store data:", error);
    }

  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <TouchableOpacity onPress={() => navigation2.navigate("productDetails")}>
      <Image source={{ uri: item.link_img }} style={styles.productImage} />
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.productDescription} numberOfLines={1}>
        {item.describe.length > 30
          ? item.describe.substring(0, 30) + "..."
          : item.describe}
      </Text>
        <View style={styles.productActions}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <TouchableOpacity style={styles.buyButton} onPress={() => addToCart(item)}>
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
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

      {/* <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
      /> */}

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
