
import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import AdminScreenHeader from './AdminScreenHeader';

import type { UserInfo } from '../../types/user';

import {
  getUsers,
  changeUserRole,
  removeUser,
} from '../../services/userService';

import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

const UserManagementScreen = () => {
  const {user} = useAuth();

  const [users, setUsers] = useState<UserInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Tải danh sách người dùng
  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.log('Lỗi tải người dùng:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    }
  };

  // Tự động tải lại khi quay về màn hình
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, []),
  );

  // Làm mới danh sách
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  // Thay đổi vai trò
  const handleChangeRole = (selectedUser: UserInfo) => {
    if (selectedUser.id === user?.id) {
      Alert.alert(
        'Thông báo',
        'Bạn không thể thay đổi vai trò tài khoản đang đăng nhập.',
      );
      return;
    }

    const newRole =
      selectedUser.role === 'admin' ? 'user' : 'admin';

    Alert.alert(
      'Xác nhận thay đổi vai trò',
      `Bạn có muốn chuyển ${selectedUser.username} thành ${newRole === 'admin' ? 'Admin' : 'User'
      } không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              await changeUserRole(selectedUser.id, newRole);

              Alert.alert('Thành công', 'Đã cập nhật vai trò');

              await loadUsers();
            } catch (error) {
              Alert.alert(
                'Lỗi',
                error instanceof Error
                  ? error.message
                  : 'Không thể cập nhật vai trò',
              );
            }
          },
        },
      ],
    );
  };

  // Xóa người dùng
  const handleDeleteUser = (selectedUser: UserInfo) => {
    if (selectedUser.id === user?.id) {
      Alert.alert(
        'Thông báo',
        'Bạn không thể xóa tài khoản đang đăng nhập.',
      );
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa tài khoản ${selectedUser.username} không?\n\nCác đơn hàng và giỏ hàng liên quan cũng sẽ bị xóa.`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeUser(selectedUser.id);

              Alert.alert('Thành công', 'Đã xóa người dùng');

              await loadUsers();
            } catch (error) {
              Alert.alert(
                'Lỗi',
                error instanceof Error
                  ? error.message
                  : 'Không thể xóa người dùng',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <AdminScreenHeader
        title="Quản lý người dùng"
        subtitle={`Tổng số: ${users.length} tài khoản`}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >

        <Text style={styles.heading}>
          DANH SÁCH NGƯỜI DÙNG
        </Text>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Tổng số tài khoản: {users.length}
          </Text>

          <Text style={styles.summaryText}>
            User: {users.filter(item => item.role === 'user').length}
          </Text>

          <Text style={styles.summaryText}>
            Admin: {users.filter(item => item.role === 'admin').length}
          </Text>
        </View>

        {users.length === 0 ? (
          <Text style={styles.emptyText}>
            Chưa có người dùng nào.
          </Text>
        ) : (
          users.map(item => (
            <View
              key={item.id}
              style={styles.userCard}
            >
              <View style={styles.userHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.username.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.username}>
                    {item.username}
                  </Text>

                  <Text style={styles.userId}>
                    Mã người dùng: {item.id}
                  </Text>

                  <View
                    style={[
                      styles.roleBadge,
                      item.role === 'admin'
                        ? styles.adminBadge
                        : styles.userBadge,
                    ]}
                  >
                    <Text style={styles.roleText}>
                      {item.role === 'admin' ? 'ADMIN' : 'USER'}
                    </Text>
                  </View>
                </View>
              </View>

              {item.id === user?.id ? (
                <Text style={styles.currentAccount}>
                  Tài khoản đang đăng nhập
                </Text>
              ) : (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.roleButton}
                    onPress={() => handleChangeRole(item)}
                  >
                    <Text style={styles.actionText}>
                      Đổi vai trò
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteUser(item)}
                  >
                    <Text style={styles.actionText}>
                      Xóa
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  backButton: {
    marginBottom: 18,
  },

  backText: {
    color: '#287A50',
    fontWeight: '600',
    fontSize: 14,
  },

  heading: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#287A50',
    marginBottom: 15,
  },

  summary: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 18,
    gap: 7,
  },

  summaryText: {
    color: '#444444',
    fontSize: 14,
    fontWeight: '600',
  },

  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 13,
    elevation: 2,
  },

  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCEFE3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#287A50',
    fontSize: 20,
    fontWeight: 'bold',
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
  },

  username: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 15,
  },

  userId: {
    color: '#888888',
    fontSize: 12,
    marginTop: 4,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 7,
  },

  adminBadge: {
    backgroundColor: '#E5EAFB',
  },

  userBadge: {
    backgroundColor: '#DCEFE3',
  },

  roleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#287A50',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },

  roleButton: {
    flex: 1,
    backgroundColor: '#287A50',
    padding: 11,
    borderRadius: 7,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#E53935',
    padding: 11,
    borderRadius: 7,
    alignItems: 'center',
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  currentAccount: {
    color: '#287A50',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 15,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 30,
  },
});

export default UserManagementScreen;
