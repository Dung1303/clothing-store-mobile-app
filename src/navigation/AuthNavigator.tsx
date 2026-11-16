import React from 'react';
import { Text } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/user/HomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';

import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';

import type { HomeStackParamList } from './UserNavigator';

// Khai báo các màn hình của Bottom Tab dành cho khách
type AuthTabParamList = {
  Home: undefined;
  Signup: undefined;
  Login: undefined;
};

const Tab = createBottomTabNavigator<AuthTabParamList>();

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

// Stack trang chủ dành cho khách chưa đăng nhập
const GuestHomeStack = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
      />

      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </HomeStack.Navigator>
  );
};

// Bottom Tab dành cho người chưa đăng nhập
const AuthNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#287A50',
        tabBarInactiveTintColor: '#8A938D',
        tabBarStyle: {
          height: 62,
          paddingBottom: 7,
          paddingTop: 5,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5EBE6',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* Tab trang chủ */}
      <Tab.Screen
        name="Home"
        component={GuestHomeStack}
        options={{
          title: 'Trang chủ',
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>
              ⌂
            </Text>
          ),
        }}
      />

      {/* Tab đăng ký */}
      <Tab.Screen
        name="Signup"
        component={SignupScreen as React.ComponentType<any>}
        options={{
          title: 'Đăng ký',
          tabBarLabel: 'Đăng ký',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 19 }}>
              ＋
            </Text>
          ),
        }}
      />

      {/* Tab đăng nhập */}
      <Tab.Screen
        name="Login"
        component={LoginScreen as React.ComponentType<any>}
        options={{
          title: 'Đăng nhập',
          tabBarLabel: 'Đăng nhập',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 19 }}>
              ♙
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AuthNavigator;