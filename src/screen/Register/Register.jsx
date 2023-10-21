import React, { useState, useEffect } from 'react';
import { Center, Box, Heading, VStack, FormControl, Input, Button, Text, HStack } from 'native-base';
import * as SQLite from 'expo-sqlite';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('')

  const db = SQLite.openDatabase('Mobile.db');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
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

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     // Drop the 'users' table if it exists
  //     tx.executeSql(
  //       `DROP TABLE IF EXISTS users`,
  //       [],
  //       (_, result) => {
  //         // Table dropped successfully or did not exist
  //         console.log('Table dropped successfully or did not exist.');
          
  //         // Now, create the 'users' table
  //         tx.executeSql(
  //           `CREATE TABLE IF NOT EXISTS users (
  //             id INTEGER PRIMARY KEY NOT NULL,
  //             name TEXT DEFAULT 'abc abc',
  //             age INTEGER DEFAULT 18,
  //             email TEXT NOT NULL,
  //             password TEXT NOT NULL
  //           );`,
  //           [],
  //           (_, result) => {
  //             // Xử lý sau khi cơ sở dữ liệu được tạo hoặc đã tồn tại
  //           },
  //           (_, error) => {
  //             console.error('Lỗi tạo cơ sở dữ liệu:', error);
  //           }
  //         );
  //       },
  //       (_, error) => {
  //         console.error('Lỗi xóa bảng:', error);
  //       }
  //     );
  //   }, []);
  // });

  const handleLogIn = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = async () => {
    setError('')
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp')
      return;
    }

    if (password.length < 8) { 
      setError('Mật khẩu phải nhiều hơn 8 ký tự.')
      return;
    }
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO users (email, password) VALUES (?, ?)', [email, password],
        (_, result) => {
          if (result.rowsAffected > 0) {
            alert('Đăng ký thành công.');
            handleLogIn();
          } else {
            alert('Đăng ký thất bại. Vui lòng thử lại.');
          }
        },
        (_, error) => {
          console.error('Lỗi thêm người dùng:', error);
          alert('Đăng ký thất bại. Vui lòng thử lại.');
        }
      )
    })
  };

  return (
    <Center flex={1}>
      <Box safeArea p={2} w="100%" h="100%" bg="white" rounded="lg" justifyContent="center">
        <Heading size="lg" color="coolGray.800" _dark={{ color: 'warmGray.50' }} fontWeight="semibold" textAlign="center">
          Welcome
        </Heading>
        <VStack space={3} mt={5}>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input placeholder="Email" value={email} onChangeText={text => setEmail(text)} />
          </FormControl>

          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input placeholder="Password" type="password" value={password} onChangeText={text => setPassword(text)} />
            <FormControl.HelperText _text={{ fontSize: 'xs' }}>
              Password phải có trên 8 ký tự và phải có ký tự in hoa, in thường và ký tự số
            </FormControl.HelperText>

            {error !== '' && (
              <Text color="red.500" fontSize="sm" mt={2}>
                {error}
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChangeText={text => setConfirmPassword(text)} />
          </FormControl>
          <Button mt={2} colorScheme="indigo" onPress={handleSignUp}>
            Sign up
          </Button>
        </VStack>
        <HStack mt="6" justifyContent="center">
            <Text fontSize="md" color="indigo.500" onPress={() => navigation.navigate('RegisterSalesman')}>Đăng ký tài khoản người bán hàng</Text> 
        </HStack>
        <HStack space={1} alignItems="center" mt={2}>
          <Text>Bạn đã có tài khoản?</Text>
          <Text fontSize="md" color="indigo.500" onPress={handleLogIn}>
            Đăng nhập
          </Text>
        </HStack>
      </Box>
    </Center>
  );
}