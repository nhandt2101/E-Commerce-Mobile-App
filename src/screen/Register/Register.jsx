import React, { useState, useEffect } from 'react';
import { Center, Box, Heading, VStack, FormControl, Input, Button, Text, HStack } from 'native-base';
import { CheckBox } from 'react-native-elements';

import { createTableUser, dropTableUser, insertUser } from '../../db/user';

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
    async function initializeDatabase() {
      await createTableUser();
    }
    initializeDatabase();
  }, []);

  const handleSignUp = async () => {
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

          <CheckBox
            title='Tài khoản người bán hàng'
            checked={isSelected}
            onPress={() => setSelection(!isSelected)}
          />

          <Button mt={2} colorScheme="indigo" onPress={handleSignUp}>
            Sign up
          </Button>
        </VStack>
        <HStack space={1} alignItems="center" mt={2}>
          <Text>Bạn đã có tài khoản?</Text>
          <Text fontSize="md" color="indigo.500" onPress={handleLogIn}>
            Đăng nhập
          </Text>
        </HStack>
      </Box>
    </Center>
  );
};
