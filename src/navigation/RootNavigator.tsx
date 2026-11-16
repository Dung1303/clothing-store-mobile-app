
import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';

import { useAuth } from '../contexts/AuthContext';

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#287A50" />
      </View>
    );
  }

  // Chưa đăng nhập
  if (!user) {
    return <AuthNavigator key="auth" />;
  }

  // Tài khoản Admin
  if (user.role === 'admin') {
    return <AdminNavigator key="admin" />;
  }

  // Tài khoản User
  return <UserNavigator key="user" />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default RootNavigator;
