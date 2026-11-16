
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';

import {
  getCart,
  changeCartQuantity,
  deleteCartItem,
} from '../../services/cartService';

import type { CartItem } from '../../repositories/cartRepository';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { CartStackParamList } from '../../navigation/UserNavigator';

const CartScreen = () => {
  const { user } = useAuth();
  const navigation =
  useNavigation<NativeStackNavigationProp<CartStackParamList>>();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Lấy dữ liệu giỏ hàng từ SQLite
  const loadCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getCart(user.id);

      setCartItems(data);
    } catch (error) {
      console.error('Lỗi tải giỏ hàng:', error);
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Tự động tải lại giỏ hàng khi mở tab
  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart]),
  );

  // Tăng hoặc giảm số lượng sản phẩm
  const updateQuantity = async (
    productId: number,
    quantity: number,
  ) => {
    if (!user || updating) {
      return;
    }

    try {
      setUpdating(true);

      await changeCartQuantity(user.id, productId, quantity);

      await loadCart();
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng sản phẩm.');
    } finally {
      setUpdating(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (productId: number) => {
    if (!user) {
      return;
    }

    Alert.alert(
      'Xóa sản phẩm',
      'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
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
              await deleteCartItem(user.id, productId);

              await loadCart();
            } catch (error) {
              console.error('Lỗi xóa sản phẩm:', error);
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm.');
            }
          },
        },
      ],
    );
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Tính tổng số lượng
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Hiển thị từng sản phẩm
  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.img }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.productPrice}>
            {item.price.toLocaleString('vi-VN')} đ
          </Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              disabled={updating}
              onPress={() =>
                updateQuantity(item.productId, item.quantity - 1)
              }
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={styles.quantityButton}
              disabled={updating}
              onPress={() =>
                updateQuantity(item.productId, item.quantity + 1)
              }
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveItem(item.productId)}
        >
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Checkout sẽ được tích hợp ở bước tiếp theo
  const handleCheckout = () => {
  if (cartItems.length === 0) {
    Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống.');
    return;
  }

  navigation.navigate('Checkout');
};

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#287A50" />
          <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>

        <Text style={styles.headerSubtitle}>
          {totalQuantity} sản phẩm
        </Text>
      </View>

      {/* Giỏ hàng trống */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>

          <Text style={styles.emptyTitle}>
            Giỏ hàng đang trống
          </Text>

          <Text style={styles.emptyDescription}>
            Hãy khám phá và thêm sản phẩm yêu thích vào giỏ hàng nhé!
          </Text>
        </View>
      ) : (
        <>
          {/* Danh sách sản phẩm */}
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Tổng tiền */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Tổng số lượng
              </Text>

              <Text style={styles.summaryValue}>
                {totalQuantity} sản phẩm
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Tổng tiền</Text>

              <Text style={styles.totalPrice}>
                {totalPrice.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              activeOpacity={0.8}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Tiến hành thanh toán
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#222222',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 5,
  },

  listContent: {
    padding: 15,
  },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },

  productImage: {
    width: 90,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },

  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 8,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },

  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 12,
  },

  deleteButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },

  deleteText: {
    fontSize: 12,
    color: '#E53935',
  },

  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#777777',
  },

  summaryValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
  },

  checkoutButton: {
    backgroundColor: '#222222',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 65,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333333',
  },

  emptyDescription: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#777777',
    fontSize: 14,
  },
});

export default CartScreen;
