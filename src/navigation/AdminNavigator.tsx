import React from 'react';
import { Text } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Màn hình phía người dùng
import HomeScreen from '../screens/user/HomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';

// Màn hình đăng ký và đăng nhập
import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Màn hình quản trị
import AdminHome from '../screens/admin/AdminHome';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import CategoryManagementScreen from '../screens/admin/CategoryManagementScreen';
import ProductManagementScreen from '../screens/admin/ProductManagementScreen';
import OrderManagementScreen from '../screens/admin/OrderManagementScreen';

import type { HomeStackParamList } from './UserNavigator';

// Các màn hình trong Admin Stack
type AdminStackParamList = {
  AdminHome: undefined;
  UserManagement: undefined;
  CategoryManagement: undefined;
  ProductManagement:
    | {
        categoryId?: number;
        categoryName?: string;
      }
    | undefined;
  OrderManagement: undefined;
};

// Các màn hình trong Admin Bottom Tab
type AdminTabParamList = {
  UserHomeTab: undefined;
  AdminTab: undefined;
  SignupTab: undefined;
  LoginTab: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

const UserHomeStackNavigator =
  createNativeStackNavigator<HomeStackParamList>();

const AdminStackNavigator =
  createNativeStackNavigator<AdminStackParamList>();

// ==========================================
// 1. STACK TRANG CHỦ USER
// ==========================================

const UserHomeStack = () => {
  return (
    <UserHomeStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <UserHomeStackNavigator.Screen
        name="Home"
        component={HomeScreen}
      />

      <UserHomeStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </UserHomeStackNavigator.Navigator>
  );
};

// ==========================================
// 2. STACK QUẢN LÝ ADMIN
// ==========================================

const AdminManagementStack = () => {
  return (
    <AdminStackNavigator.Navigator
      initialRouteName="AdminHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Trang chủ Admin */}
      <AdminStackNavigator.Screen
        name="AdminHome"
        component={AdminHome}
      />

      {/* Quản lý người dùng */}
      <AdminStackNavigator.Screen
        name="UserManagement"
        component={UserManagementScreen}
      />

      {/* Quản lý danh mục */}
      <AdminStackNavigator.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
      />

      {/* Quản lý sản phẩm */}
      <AdminStackNavigator.Screen
        name="ProductManagement"
        component={ProductManagementScreen}
      />

      {/* Quản lý đơn hàng */}
      <AdminStackNavigator.Screen
        name="OrderManagement"
        component={OrderManagementScreen}
      />
    </AdminStackNavigator.Navigator>
  );
};

// ==========================================
// 3. BOTTOM TAB DÀNH CHO ADMIN
// ==========================================

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="AdminTab"
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
      {/* Tab Home User */}
      <Tab.Screen
        name="UserHomeTab"
        component={UserHomeStack}
        options={{
          title: 'Home User',
          tabBarLabel: 'Home User',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>
              ⌂
            </Text>
          ),
        }}
      />

      {/* Tab Home Admin */}
      <Tab.Screen
        name="AdminTab"
        component={AdminManagementStack}
        options={{
          title: 'Home Admin',
          tabBarLabel: 'Home Admin',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 19 }}>
              ▦
            </Text>
          ),
        }}
      />

      {/* Tab đăng ký */}
      <Tab.Screen
        name="SignupTab"
        component={SignupScreen as React.ComponentType<any>}
        options={{
          title: 'Đăng ký',
          tabBarLabel: 'Sign up',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 19 }}>
              ＋
            </Text>
          ),
        }}
      />

      {/* Tab đăng nhập */}
      <Tab.Screen
        name="LoginTab"
        component={LoginScreen as React.ComponentType<any>}
        options={{
          title: 'Đăng nhập',
          tabBarLabel: 'Login',
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

export default AdminNavigator;