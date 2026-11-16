
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';

import {
  changeUsername,
  changeUserPassword,
} from '../../services/userService';

const ProfileScreen = () => {
  const { user, signOut, updateAuthUser } = useAuth();

  const [editingUsername, setEditingUsername] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [username, setUsername] = useState(user?.username || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);

  // Cập nhật tên đăng nhập
  const handleUpdateUsername = async () => {
    if (!user || saving) {
      return;
    }

    try {
      setSaving(true);

      await changeUsername(user.id, username);

      await updateAuthUser({
        ...user,
        username: username.trim(),
      });

      setEditingUsername(false);

      Alert.alert('Thành công', 'Tên đăng nhập đã được cập nhật.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể cập nhật tên đăng nhập.';

      Alert.alert('Lỗi', message);
    } finally {
      setSaving(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async () => {
    if (!user || saving) {
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setSaving(true);

      await changeUserPassword(
        user.id,
        currentPassword,
        newPassword,
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setChangingPassword(false);

      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đổi mật khẩu.';

      Alert.alert('Lỗi', message);
    } finally {
      setSaving(false);
    }
  };

  // Đăng xuất
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
              await signOut();
            } catch (error) {
              console.error('Lỗi đăng xuất:', error);
              Alert.alert('Lỗi', 'Không thể đăng xuất.');
            }
          },
        },
      ],
    );
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tiêu đề */}
        <Text style={styles.headerTitle}>
          Hồ sơ cá nhân
        </Text>

        {/* Thông tin tài khoản */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.profileUsername}>
            {user.username}
          </Text>

          <Text style={styles.profileRole}>
            {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
          </Text>
        </View>

        {/* Thông tin đăng nhập */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Thông tin tài khoản
          </Text>

          <Text style={styles.label}>
            Tên đăng nhập
          </Text>

          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            editable={editingUsername && !saving}
            autoCapitalize="none"
            placeholder="Nhập tên đăng nhập"
          />

          {editingUsername ? (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setUsername(user.username);
                  setEditingUsername(false);
                }}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>
                  Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleUpdateUsername}
                disabled={saving}
              >
                <Text style={styles.primaryButtonText}>
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => {
                setUsername(user.username);
                setEditingUsername(true);
                setChangingPassword(false);
              }}
            >
              <Text style={styles.outlineButtonText}>
                Chỉnh sửa tên đăng nhập
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Đổi mật khẩu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Bảo mật
          </Text>

          {changingPassword ? (
            <>
              <Text style={styles.label}>
                Mật khẩu hiện tại
              </Text>

              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Nhập mật khẩu hiện tại"
              />

              <Text style={styles.label}>
                Mật khẩu mới
              </Text>

              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Nhập mật khẩu mới"
              />

              <Text style={styles.label}>
                Xác nhận mật khẩu mới
              </Text>

              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Nhập lại mật khẩu mới"
              />

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setChangingPassword(false);
                  }}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>
                    Hủy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleChangePassword}
                  disabled={saving}
                >
                  <Text style={styles.primaryButtonText}>
                    {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => {
                setChangingPassword(true);
                setEditingUsername(false);
              }}
            >
              <Text style={styles.outlineButtonText}>
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Đăng xuất */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#E5F2E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#287A50',
  },
  profileUsername: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222',
  },
  profileRole: {
    fontSize: 13,
    color: '#777777',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#287A50',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 7,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    color: '#222222',
    backgroundColor: '#FFFFFF',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#287A50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#287A50',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#287A50',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#444444',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FCEAEA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  logoutButtonText: {
    color: '#D43F3F',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
