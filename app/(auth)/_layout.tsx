import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const AuthLayout = () => {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Create account' }} />
    </Stack>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
