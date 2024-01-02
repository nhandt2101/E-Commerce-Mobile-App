import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList as RNFlatList } from 'react-native';
import Navigator from '../../component/navigative';
import { FlatList } from 'native-base';

import { getData } from "../../component/store";
import { getCart } from "../../db/cart";
import { getOrder } from '../../db/order';

const Customer = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [txt, setTxt] = useState("Loading....");
  const [products, setProducts] = useState(null);

  const fetchData = async () => {
    try {
      const data_user = await getData("@user");
      setUser(data_user);
    } catch (error) {
      console.error(error);
    }
  };

  const getDataProduct = async () => {
    if (user != null) {
      try {
        const data = await getOrder(user.id);
        setProducts(data);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    }
  };

  useEffect(() => {
    if (user == null) fetchData();
  }, [user]);

  useEffect(() => {
    getDataProduct();
  }, [user]);

  const handleProfile = () => {
    navigation.navigate('ChangeProfile');
  };

  const OrderItem = ({ order }) => (
    <View style={styles.productItem}>
      <View style={styles.productActions}>
        <Image source={{ uri: order.link_img }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{`Product: ${order.productName}`}</Text>
          <Text style={styles.productDescription} numberOfLines={1}>{`Description: ${order.describe}`}</Text>
          <Text style={styles.productPrice}>{`Price: ${order.price}`}</Text>
          <View style={styles.productRow}>
            <Text style={styles.quantityText}>{`Quantity: ${order.quantity}`}</Text>
            <Text style={styles.orderStatus}>{`Order Status: ${getOrderStatus(order)}`}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const getOrderStatus = (order) => {
    const currentTime = new Date().getTime();
    const orderTime = new Date(order.createAt).getTime();
    const timeDifference = currentTime - orderTime;

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const sevenDaysInMilliseconds = 7 * oneDayInMilliseconds;

    if (timeDifference <= oneDayInMilliseconds) {
      return 'Đang đóng gói';
    } else if (timeDifference > oneDayInMilliseconds && timeDifference <= sevenDaysInMilliseconds) {
      return 'Đang vận chuyển';
    } else if (timeDifference > sevenDaysInMilliseconds) {
      return 'Sản phẩm đã mua';
    } else {
      return 'Unknown Status';
    }
  };

  return (
    <View style={styles.container}>
      {user !== null ? (
        <>
          <View style={styles.userInfo}>
            <Image style={styles.profileImage} source={require("../../image/user.png")} />
            <View style={styles.userInfoText}>
              <Text style={styles.infoText}><Text style={styles.labelText}>Name:</Text> {user.name}</Text>
              <Text style={styles.infoText}><Text style={styles.labelText}>Address:</Text> {user.address}</Text>
              <Text style={styles.infoText}><Text style={styles.labelText}>Email:</Text> {user.email}</Text>
              <Text style={styles.infoText}><Text style={styles.labelText}>Age:</Text> {user.age}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.editButton, styles.section]} onPress={handleProfile}>
            <Text style={styles.editButtonText}>Sửa thông tin</Text>
          </TouchableOpacity>

          <RNFlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OrderItem order={item} />}
          />

          <TouchableOpacity style={[styles.editButton, styles.section]} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.editButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.loadingText}>{txt}</Text>
      )}
      <FlatList />
      <Navigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  userInfoText: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
  },
  productItem: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  checkboxSelected: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginRight: 5,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  quantityText: {
    fontSize: 14,
    marginRight: 10,
  },
  orderStatus: {
    fontSize: 14,
    color: 'blue',
  },
  labelText: {
    fontWeight: 'bold',
  },
});

export default Customer;
