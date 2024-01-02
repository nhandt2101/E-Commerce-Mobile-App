import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, Dimensions, TextInput, ScrollView } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import Navigator from "../../component/navigative";
import { findProductCombined, createTableAndLoadData, createTableProduct } from '../../db/product';
import { storeData } from "../../component/store";

export default function HomeScreen({ navigation }) {

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [txt, setTxt] = useState("Loading...");

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await createTableProduct();
        await createTableAndLoadData();
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    }
    initializeDatabase();
  }, []);

  const onSubmitSearch = async () => {
    try {
      const data = await findProductCombined(query);
      setProducts([...data]);
      if (data.length === 0) {
        setTxt("Sorry! No products found.");
      }
    } catch (e) {
      console.log(e);
      setTxt("Sorry! No products found.");
      setProducts([]);
    }
  }

  const getNumColumns = () => {
    const screenWidth = Dimensions.get("window").width;
    return screenWidth > 600 ? 3 : 2;
  };
  const images = [
    "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
  ];

  const [numColumns, setNumColumns] = useState(getNumColumns());

  useEffect(() => {
    onSubmitSearch();
  }, [query])

  const addToCart = async (product) => {
    try {
      storeData("@product", product);
      navigation.navigate('Shopping');
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <TouchableOpacity onPress={() => addToCart(item)}>
        <Image source={{ uri: item.link_img }} style={styles.productImage} />
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.describe.length > 60 ? item.describe.substring(0, 60) + "..." : item.describe}
        </Text>
      </TouchableOpacity>
      <View style={styles.productActions}>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity style={styles.buyButton} onPress={() => addToCart(item)}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
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
      <ScrollView>
        <SliderBox
          images={images}
          autoPlay
          circleLoop
          dotColor={"#13274F"}
          inactiveDotColor="#90A4AE"
          ImageComponentStyle={{ width: "100%" }}
        />

        {products.length === 0 ? (
          <Text style={styles.emptyText}>{txt}</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            contentContainerStyle={styles.productList}
          />
        )}

      </ScrollView>
      <Navigator />
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
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginRight: 5,
    marginLeft: 15,
    borderRadius: 20,
    paddingLeft: 15,
  },
  searchButton: {
    backgroundColor: "#ee4d2d",
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
    textAlign: "center"
  },
  productActions: {
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ee4d2d",
    marginRight: 5,
  },
  buyButton: {
    display: "absolute",
    backgroundColor: "#ee4d2d",
    padding: 8,
    borderRadius: 5,
    // marginTop: 5
    // bottom: 10
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  productList: {
    paddingHorizontal: 10,
  },
  productItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flex: 1,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 300
  },
  productImage: {
    width: 120,
    height: 120,
    alignItems: "center",
    textAlign: "center",
    resizeMode: "cover",
    marginBottom: 5,
    borderRadius: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    lineHeight: 18,
    maxHeight: 36, 
    overflow: 'hidden', 
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
