
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import { getOrderHistory } from '../../services/orderService';

import type { OrderHistory } from '../../repositories/orderRepository';

const OrderHistoryScreen = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Tải lịch sử đơn hàng
  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getOrderHistory(user.id);

      setOrders(data);
    } catch (error) {
      console.error('Lỗi tải lịch sử đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Tự động tải lại khi mở tab
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  // Hiển thị trạng thái đơn hàng
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xác nhận';

      case 'Processing':
        return 'Đang xử lý';

      case 'Shipped':
        return 'Đang giao hàng';

      case 'Confirmed':
        return 'Đã xác nhận';

      case 'Shipping':
        return 'Đang giao hàng';

      case 'Completed':
        return 'Hoàn thành';

      case 'Cancelled':
        return 'Đã hủy';

      default:
        return status;
    }
  };

  // Hiển thị một đơn hàng
  const renderOrder = ({ item }: { item: OrderHistory }) => {
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>
              Đơn hàng #{item.id}
            </Text>

            <Text style={styles.orderDate}>
              Ngày đặt: {item.createdAt}
            </Text>
          </View>

          <Text style={styles.status}>
            {getStatusText(item.status)}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Sản phẩm
        </Text>

        {item.items.map(product => (
          <View
            key={product.itemId}
            style={styles.productRow}
          >
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {product.productName}
              </Text>

              <Text style={styles.productQuantity}>
                Số lượng: {product.quantity}
              </Text>
            </View>

            <Text style={styles.productPrice}>
              {(product.price * product.quantity).toLocaleString('vi-VN')} đ
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Tổng tiền
          </Text>

          <Text style={styles.totalPrice}>
            {item.totalAmount.toLocaleString('vi-VN')} đ
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#287A50" />

          <Text style={styles.loadingText}>
            Đang tải lịch sử đơn hàng...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Lịch sử đơn hàng
        </Text>

        <Text style={styles.headerSubtitle}>
          Theo dõi những đơn hàng bạn đã đặt
        </Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>📦</Text>

          <Text style={styles.emptyTitle}>
            Chưa có đơn hàng
          </Text>

          <Text style={styles.emptyDescription}>
            Những đơn hàng bạn đã đặt sẽ xuất hiện tại đây.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },
  header: {
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#222222',
  },
  headerSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: '#777777',
  },
  listContent: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  orderDate: {
    marginTop: 5,
    fontSize: 12,
    color: '#777777',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#287A50',
    backgroundColor: '#E8F4EC',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  productQuantity: {
    marginTop: 4,
    fontSize: 12,
    color: '#888888',
  },
  productPrice: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#287A50',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  loadingText: {
    marginTop: 10,
    color: '#777777',
  },
  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default OrderHistoryScreen;
