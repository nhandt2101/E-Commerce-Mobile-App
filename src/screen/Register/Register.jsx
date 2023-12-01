import React, { useState, useEffect } from 'react';
import { Text } from 'native-base';
import { CheckBox } from 'react-native-elements';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { createTableUser, insertUser } from '../../db/user';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSelected, setSelection] = useState(false);

  const handleLogIn = () => {
    navigation.navigate('Login');
  };

  useEffect(() => {
    createTableUser();
  }, []);

  const handleSignUp = async () => {
    console.log("done");
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải nhiều hơn 8 ký tự.');
      return;
    }

    try {
      await insertUser(email, password, isSelected);
      alert('Đăng ký thành công.');
      handleLogIn();
    } catch (error) {
      alert('Đăng ký thất bại. Vui lòng thử lại.');
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 150, height: 100 }}
          source={{
            uri: "https://www.logolynx.com/images/logolynx/4c/4c1e9d4c49f1ee74f3bb871a181fea10.png?fbclid=IwAR1tP9XGFKwI2qT8BQPXfkOwGoK-KMagmKWmwV0Esit9IeSz67oecIbnohk",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Register to your Account
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="Email"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Password"
            />
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="confirm Password"
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me logged in</Text>

          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>
        <CheckBox
          style={{
            marginLeft: 20,
          }}
          title='Tài khoản người bán hàng'
          checked={isSelected}
          onPress={() => setSelection(!isSelected)}
        />

        <View style={{ marginTop: 80 }} />

        <Pressable
          onPress={handleSignUp}
          style={{
            width: 200,
            backgroundColor: "blue",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Register
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};