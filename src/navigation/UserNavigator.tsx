
import React from 'react';
import { Text } from 'react-native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/user/HomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import CartScreen from '../screens/user/CartScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';

import type { Product } from '../types/product';
import OrderHistoryScreen from '../screens/user/OrderHistoryScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

// Điều hướng của trang chủ
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: {
    product: Product;
  };
};

// Điều hướng của giỏ hàng và thanh toán
export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
};

const Tab = createBottomTabNavigator();

const HomeStackNavigator =
  createNativeStackNavigator<HomeStackParamList>();

const CartStackNavigator =
  createNativeStackNavigator<CartStackParamList>();

// Stack trang chủ
const HomeStack = () => {
  return (
    <HomeStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
    >
      <HomeStackNavigator.Screen
        name="Home"
        component={HomeScreen}
      />

      <HomeStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </HomeStackNavigator.Navigator>
  );
};

// Stack giỏ hàng và thanh toán
const CartStack = () => {
  return (
    <CartStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
    >
      <CartStackNavigator.Screen
        name="Cart"
        component={CartScreen}
      />

      <CartStackNavigator.Screen
        name="Checkout"
        component={CheckoutScreen}
      />
    </CartStackNavigator.Navigator>
  );
};

// Bottom Tab người dùng
const UserNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#287A50',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Trang chủ',
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⌂</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          title: 'Giỏ hàng',
          tabBarLabel: 'Giỏ hàng',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🛒</Text>
          ),
        }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          title: 'Đơn hàng',
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📦</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Tài khoản',
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default UserNavigator;
