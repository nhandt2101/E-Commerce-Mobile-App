import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

const Customer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          style={styles.profileImage}
          source={require("../../image/user.png")}
        />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>John Doe</Text>
        </View>
      </View>
      <Text style={styles.bio}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
      <Button

        title="Information"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />

      <Button

        title="Information"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />

      <Button

        title="Information"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />

      <Button

        title="Information"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
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
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 75,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Customer;
