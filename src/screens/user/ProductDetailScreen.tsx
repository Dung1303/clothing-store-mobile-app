
import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { getDb } from '../../database';

import type { Category } from '../../types/category';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/UserNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { addProductToCart } from '../../services/cartService';

type ProductDetailScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'ProductDetail'
>;

const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenProps) => {
  // Nhận thông tin sản phẩm từ màn hình trước
  const { user } = useAuth();
  const { product } = route.params;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin danh mục của sản phẩm
  const loadCategory = useCallback(async () => {
    try {
      const db = getDb();

      const result = await db.execute(
        'SELECT * FROM categories WHERE id = ?;',
        [product.categoryId],
      );

      const categories =
        (result.rows?._array as Category[]) || [];

      if (categories.length > 0) {
        setCategory(categories[0]);
      }
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  }, [product.categoryId]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  // Xử lý khi nhấn nút thêm vào giỏ hàng

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.',
      );
      return;
    }

    try {
      await addProductToCart(user.id, product.id, 1);

      Alert.alert(
        'Thành công',
        `Đã thêm "${product.name}" vào giỏ hàng!`,
      );
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error);

      Alert.alert(
        'Lỗi',
        'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hình ảnh sản phẩm */}
        <Image
          source={{ uri: product.img }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Thông tin sản phẩm */}
        <View style={styles.content}>
          <Text style={styles.productName}>
            {product.name}
          </Text>

          <Text style={styles.price}>
            {product.price.toLocaleString('vi-VN')} đ
          </Text>

          <View style={styles.divider} />

          {/* Thông tin chi tiết */}
          <Text style={styles.sectionTitle}>
            Thông tin sản phẩm
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã sản phẩm</Text>
            <Text style={styles.value}>SP{product.id}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Danh mục</Text>

            {loading ? (
              <ActivityIndicator size="small" color="#333333" />
            ) : (
              <Text style={styles.value}>
                {category?.name || 'Chưa phân loại'}
              </Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá bán</Text>
            <Text style={styles.value}>
              {product.price.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Mô tả */}
          <Text style={styles.sectionTitle}>
            Mô tả sản phẩm
          </Text>

          <Text style={styles.description}>
            {product.name} là sản phẩm thời trang dành cho
            những ai yêu thích phong cách đơn giản và hiện đại.
            Sản phẩm phù hợp để sử dụng trong nhiều dịp khác nhau.
          </Text>
        </View>
      </ScrollView>

      {/* Nút thêm vào giỏ hàng */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomLabel}>Giá sản phẩm</Text>
          <Text style={styles.bottomPriceText}>
            {product.price.toLocaleString('vi-VN')} đ
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>
            Thêm vào giỏ hàng
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 35,
  },

  backText: {
    fontSize: 35,
    color: '#222222',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  headerPlaceholder: {
    width: 35,
  },

  productImage: {
    width: '100%',
    height: 350,
    backgroundColor: '#F2F2F2',
  },

  content: {
    padding: 20,
  },

  productName: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#222222',
  },

  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: '#888888',
  },

  value: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },

  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 23,
    textAlign: 'justify',
  },

  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },

  bottomPrice: {
    flex: 1,
  },

  bottomLabel: {
    fontSize: 12,
    color: '#888888',
  },

  bottomPriceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 5,
  },

  addButton: {
    backgroundColor: '#222222',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
