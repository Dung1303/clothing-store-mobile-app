
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import type { UserInfo } from '../types/user';

type Props = {
  user: UserInfo | null;
  title?: string;
  onLogout: () => void;
};

const Header = ({
  user,
  title = 'Cửa hàng quần áo',
  onLogout,
}: Props) => {
  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await onLogout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(
                'Lỗi',
                'Không thể đăng xuất. Vui lòng thử lại.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>{title}</Text>

        {user ? (
          <Text style={styles.username} numberOfLines={1}>
            Xin chào, {user.username}
            {user.role === 'admin' ? ' (Admin)' : ''}
          </Text>
        ) : (
          <Text style={styles.username}>
            Chào mừng bạn đến với cửa hàng
          </Text>
        )}
      </View>

      {user && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Đăng xuất"
        >
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 70,
    backgroundColor: '#287A50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftContent: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  username: {
    fontSize: 13,
    color: '#FFFFFF',
  },

  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    color: '#287A50',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default Header;
