
import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';

type Props = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const AdminHome = ({ navigation }: Props) => {
  const { user, signOut } = useAuth();

  const menus = [
    {
      title: 'Quản lý người dùng',
      desc: 'Xem danh sách, cập nhật vai trò và xóa tài khoản',
      icon: '👥',
      screen: 'UserManagement',
      color: '#EAF2FF',
    },
    {
      title: 'Quản lý danh mục',
      desc: 'Thêm, sửa, xóa loại sản phẩm',
      icon: '🗂️',
      screen: 'CategoryManagement',
      color: '#F1ECFF',
    },
    {
      title: 'Quản lý sản phẩm',
      desc: 'Thêm, cập nhật và xóa sản phẩm',
      icon: '👕',
      screen: 'ProductManagement',
      color: '#E7F5EC',
    },
    {
      title: 'Quản lý đơn hàng',
      desc: 'Xem đơn hàng và cập nhật trạng thái',
      icon: '📦',
      screen: 'OrderManagement',
      color: '#FFF1E6',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        user={user}
        title="Quản trị cửa hàng"
        onLogout={signOut}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.heading}>
          Xin chào quản trị viên!
        </Text>

        <Text style={styles.subtitle}>
          Quản lý và theo dõi hoạt động cửa hàng của bạn.
        </Text>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>
            TRUNG TÂM QUẢN TRỊ
          </Text>
          <Text style={styles.summaryText}>
            Chọn một chức năng bên dưới để bắt đầu.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Chức năng quản lý
        </Text>

        {menus.map(item => (
          <TouchableOpacity
            key={item.screen}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.color },
              ]}
            >
              <Text style={styles.icon}>{item.icon}</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {item.title}
              </Text>

              <Text style={styles.cardDescription}>
                {item.desc}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.footer}>
          Hệ thống quản lý cửa hàng quần áo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#215E40',
    marginTop: 8,
  },
  subtitle: {
    color: '#718078',
    fontSize: 14,
    marginTop: 7,
    lineHeight: 21,
  },
  summary: {
    backgroundColor: '#287A50',
    borderRadius: 14,
    padding: 18,
    marginTop: 22,
    marginBottom: 24,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryText: {
    color: '#E5F1E9',
    fontSize: 13,
    marginTop: 7,
  },
  sectionTitle: {
    color: '#26352C',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 13,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  icon: {
    fontSize: 26,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#26352C',
  },
  cardDescription: {
    fontSize: 12,
    color: '#78827B',
    marginTop: 5,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 27,
    color: '#287A50',
    marginLeft: 7,
  },
  footer: {
    textAlign: 'center',
    color: '#929B95',
    fontSize: 12,
    marginTop: 15,
  },
});

export default AdminHome;
