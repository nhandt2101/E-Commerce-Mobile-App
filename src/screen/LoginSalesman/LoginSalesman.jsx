import React, { useState, useEffect } from 'react';
import { Center, Box, Heading, VStack, FormControl, Input, Button, HStack, Link, Text } from 'native-base';
import * as SQLite from 'expo-sqlite';

export default function LoginSalesman({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const db = SQLite.openDatabase('Mobile.db');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS salesman (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT DEFAULT 'abc abc',
          age INTEGER DEFAULT 18,
          email TEXT NOT NULL,
          password TEXT NOT NULL
      );`,
        [],
        (_, result) => {
          // Xử lý sau khi cơ sở dữ liệu được tạo hoặc đã tồn tại
        },
        (_, error) => {
          console.error('Lỗi tạo cơ sở dữ liệu:', error);
        }
      );
    });
  }, []);

  const handleLogin = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id FROM salesman WHERE email = ? AND password = ?',
        [email, password],
        (_, result) => {
          if (result.rows.length > 0) {
            // User with matching email and password found
            console.log(result.rows.item(0)); // Access the first result
            const userID = result.rows.item(0)
            navigation.navigate('Home', { userID });
          } else {
            // No user found with matching email and password
            alert('Sai tên đăng nhập hoặc mật khẩu.');
          }
        },
        (_, error) => {
          console.error('Lỗi thêm người dùng:', error);
          alert('error');
        }
      );
    });
  };
  

  return (
    <Center flex={1}>
      <Box safeArea p={2} w="100%" h="100%" bg="white" rounded="lg" justifyContent="center">
        <Heading size="lg" color="coolGray.800" _dark={{ color: 'warmGray.50' }} fontWeight="semibold" textAlign="center">
          Welcome
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              type="password"
            />
            <Link _text={{ fontSize: "xs", fontWeight: "500", color: "indigo.500" }} alignSelf="flex-end" mt="1">
              Forget Password?
            </Link>
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={handleLogin}>
            Sign in
          </Button>

          {/* Sign up */}
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200" }}>
              Bạn chưa có tài khoản?{" "}
            </Text>
            <Link _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }} onPress={() => navigation.navigate('Register')}>
              Sign Up
            </Link>
          </HStack>
          <HStack mt="6" justifyContent="center">
            <Link _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }} onPress={() => navigation.navigate('Login')}>
              Đăng nhập tài khoản người dùng
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  )
}