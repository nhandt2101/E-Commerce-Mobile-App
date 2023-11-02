import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Navigator from '../../component/navigative';

import { getData } from "../../component/store";
import { FlatList } from 'native-base';

const Customer = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [txt, setTxt] = useState("Loading....");

  const fetchData = async () => {
    try {
      const data_user = await getData("@user");
      setUser(data_user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleProfile = async () => {
    navigation.navigate('ChangeProfile');
  }

  return (
    <View style={styles.container}>
      {user !== null ? (
        <>
          <View style={styles.userInfo}>
            <Image
              style={styles.profileImage}
              source={require("../../image/user.png")}
            />
            <View style={styles.userInfoText}>
              <Text style={styles.infoText}>
                <Text style={styles.labelText}>Name:</Text> {user.name}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.labelText}>Address:</Text> {user.address}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.labelText}>Email:</Text> {user.email}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.labelText}>Age:</Text> {user.age}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.editButton, styles.section]}
            onPress={() => handleProfile()}
          >
            <Text style={styles.editButtonText}>Sửa thông tin</Text>
          </TouchableOpacity>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => console.log("Theo dõi đơn hàng")}
            >
              <Text style={styles.sectionButtonText}>Theo dõi đơn hàng</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => console.log("Các sản phẩm đã mua")}
            >
              <Text style={styles.sectionButtonText}>Các sản phẩm đã mua</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.editButton, styles.section]}
            onPress={() => navigation.navigate('Login')}
          >
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
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  userInfoText: {
    flex: 1,
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
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionButton: {
    backgroundColor: '#ebebeb',
    padding: 10,
    borderRadius: 5,
  },
  sectionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
  },
  labelText: {
    fontWeight: 'bold',
  }
});

export default Customer;