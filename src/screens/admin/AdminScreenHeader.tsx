
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';

type Props = {
  title: string;
  subtitle: string;
};

const AdminScreenHeader = ({title, subtitle}: Props) => {
  const navigation = useNavigation<any>();
  const {user, signOut} = useAuth();

  const goToAdminHome = () => {
    // Quay về màn hình đầu tiên của Admin Stack
    navigation.popToTop();
  };

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={goToAdminHome}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>
            ‹ Trang chủ Admin
          </Text>
        </TouchableOpacity>

        {user && (
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#287A50',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.17)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#287A50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },
  subtitle: {
    color: '#E5F1E9',
    fontSize: 13,
    marginTop: 5,
  },
});

export default AdminScreenHeader;
