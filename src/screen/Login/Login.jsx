import React, { useState, useEffect } from 'react';
import { Center, Box, Heading, VStack, FormControl, Input, Button, HStack, Link, Text } from 'native-base';

import { createTableUser, getUser, dropTableUser } from '../../db/user';
import { storeData } from '../../component/store';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function initializeDatabase() {
      await createTableUser();
    }
    initializeDatabase();
  }, []);

  const handleLogin = async () => {
    try {
      const user = await getUser(email, password);
      storeData('@user', user);

      if (user.isSale === 1) {
        navigation.navigate('HomeSalesman');
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      alert('Sai tên đăng nhập hoặc mật khẩu.');
    }
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

          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200" }}>
              Bạn chưa có tài khoản?{" "}
            </Text>
            <Link _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }} onPress={() => navigation.navigate('Register')}>
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  )
}