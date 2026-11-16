import React, { useEffect, useState, useRef } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Pressable,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';

import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';

import { getAllProducts } from '../../services/productService';
import { getDb } from '../../database';

import type { Product } from '../../types/product';
import type { Category } from '../../types/category';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
};
const BANNER_WIDTH = Dimensions.get('window').width - 30;

const bannerImages = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000',
    title: 'NEW COLLECTION',
    subtitle: 'Khám phá phong cách mới',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000',
    title: 'FASHION STYLE',
    subtitle: 'Tự tin thể hiện cá tính',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000',
    title: 'TRENDING NOW',
    subtitle: 'Cập nhật xu hướng thời trang',
  },
];

const HomeScreen = ({ navigation }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const bannerRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerIndexRef = useRef(0);

  // Tự động chuyển banner sau mỗi 3,5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (bannerIndexRef.current + 1) % bannerImages.length;

      bannerIndexRef.current = nextIndex;
      setBannerIndex(nextIndex);

      bannerRef.current?.scrollTo({
        x: nextIndex * BANNER_WIDTH,
        animated: true,
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  // Cập nhật vị trí khi người dùng tự vuốt banner
  const handleBannerScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);

    bannerIndexRef.current = index;
    setBannerIndex(index);
  };

  const [categories, setCategories] = useState<Category[]>([]);

  const [keyword, setKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Hiện / ẩn khung lọc giá
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, signOut } = useAuth();

  // Lấy dữ liệu sản phẩm và danh mục từ SQLite
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const db = getDb();

      const productData = await getAllProducts();

      const categoryResult = await db.execute(
        'SELECT * FROM categories ORDER BY id ASC;',
      );

      const categoryData = (categoryResult.rows?._array as Category[]) || [];

      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      console.error('Error loading home data:', err);
      setError('Không thể tải dữ liệu sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Kiểm tra khoảng giá
  const min = minPrice.trim() === '' ? null : Number(minPrice);
  const max = maxPrice.trim() === '' ? null : Number(maxPrice);

  const invalidPriceRange =
    (min !== null && (!Number.isFinite(min) || min < 0)) ||
    (max !== null && (!Number.isFinite(max) || max < 0)) ||
    (min !== null &&
      max !== null &&
      Number.isFinite(min) &&
      Number.isFinite(max) &&
      min > max);

  // Có đang lọc theo giá không (để hiện chấm báo trên nút)
  const hasPriceFilter = minPrice.trim() !== '' || maxPrice.trim() !== '';

  // Lọc sản phẩm theo tên, danh mục và giá
  const filteredProducts = products.filter(product => {
    const category = categories.find(item => item.id === product.categoryId);

    const searchText = keyword.trim().toLowerCase();

    const matchedKeyword =
      searchText === '' ||
      product.name.toLowerCase().includes(searchText) ||
      (category?.name.toLowerCase().includes(searchText) ?? false);

    const matchedCategory =
      selectedCategoryId === null || product.categoryId === selectedCategoryId;

    const matchedMinPrice = min === null || product.price >= min;
    const matchedMaxPrice = max === null || product.price <= max;

    return (
      !invalidPriceRange &&
      matchedKeyword &&
      matchedCategory &&
      matchedMinPrice &&
      matchedMaxPrice
    );
  });

  // Hiển thị sản phẩm
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() =>
        navigation.navigate('ProductDetail', {
          product: item,
        })
      }
    />
  );

  // Phần giao diện phía trên danh sách sản phẩm
  const renderListHeader = () => (
    <View>
      {/* Banner Carousel */}
      <View style={styles.bannerContainer}>
        <ScrollView
          ref={bannerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleBannerScroll}
          scrollEventThrottle={16}
        >
          {bannerImages.map(item => (
            <ImageBackground
              key={item.id}
              source={{ uri: item.image }}
              style={styles.banner}
              imageStyle={styles.bannerImage}
              resizeMode="cover"
            >
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerLabel}>{item.title}</Text>

                <Text style={styles.bannerTitle}>
                  FASHION{'\n'}COLLECTION
                </Text>

                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>

                <View style={styles.bannerTag}>
                  <Text style={styles.bannerTagText}>EXPLORE NOW</Text>
                </View>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        {/* Dấu chấm chỉ vị trí ảnh */}
        <View style={styles.bannerDots}>
          {bannerImages.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.bannerDot,
                bannerIndex === index && styles.bannerDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Hàng tìm kiếm + nút lọc giá */}
      <View style={styles.searchRow}>
        <View style={styles.searchBarWrapper}>
          <SearchBar keyword={keyword} onChangeKeyword={setKeyword} />
        </View>

        <Pressable
          style={[
            styles.filterButton,
            (showFilters || hasPriceFilter) && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text
            style={[
              styles.filterButtonText,
              (showFilters || hasPriceFilter) && styles.filterButtonTextActive,
            ]}
          >
            ₫
          </Text>
          {hasPriceFilter && <View style={styles.filterDot} />}
        </Pressable>
      </View>

      {/* Khoảng giá (chỉ hiện khi bấm nút ₫) */}
      {showFilters && (
        <View style={styles.priceCard}>
          <View style={styles.priceInputRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Từ giá"
              placeholderTextColor="#AAAAAA"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />

            <Text style={styles.priceSeparator}>—</Text>

            <TextInput
              style={styles.priceInput}
              placeholder="Đến giá"
              placeholderTextColor="#AAAAAA"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>

          {invalidPriceRange && (
            <Text style={styles.priceError}>
              Khoảng giá không hợp lệ. Giá thấp nhất không được lớn hơn giá cao
              nhất.
            </Text>
          )}
        </View>
      )}

      {/* Danh mục dạng chip cuộn ngang */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={[
            styles.chip,
            selectedCategoryId === null && styles.chipActive,
          ]}
          onPress={() => setSelectedCategoryId(null)}
        >
          <Text
            style={[
              styles.chipText,
              selectedCategoryId === null && styles.chipTextActive,
            ]}
          >
            Tất cả
          </Text>
        </Pressable>

        {categories.map(category => {
          const active = selectedCategoryId === category.id;

          return (
            <Pressable
              key={category.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() =>
                setSelectedCategoryId(active ? null : category.id)
              }
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Tiêu đề sản phẩm */}
      <View style={styles.productHeader}>
        <Text style={styles.productTitle}>Sản phẩm nổi bật</Text>

        <View style={styles.productCountBadge}>
          <Text style={styles.productCount}>
            {filteredProducts.length} sản phẩm
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header user={user} title="Cửa hàng quần áo" onLogout={signOut} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#8B654B"
          style={styles.loading}
        />
      ) : error !== '' ? (
        <Text style={styles.message}>{error}</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          ListHeaderComponent={renderListHeader}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.message}>
              Không tìm thấy sản phẩm phù hợp.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },

  // Banner Carousel
  bannerContainer: {
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },

  banner: {
    width: BANNER_WIDTH,
    height: 150,
    justifyContent: 'center',
  },

  bannerImage: {
    borderRadius: 18,
  },

  bannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  bannerLabel: {
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  bannerTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  bannerSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 6,
  },

  bannerTag: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },

  bannerTagText: {
    color: '#49372B',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  bannerDots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  bannerDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginHorizontal: 3.5,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  bannerDotActive: {
    width: 20,
    backgroundColor: '#FFFFFF',
  },

  // Hàng tìm kiếm
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
  },

  searchBarWrapper: {
    flex: 1,
    marginRight: 10,
  },

  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DED4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#49372B',
    borderColor: '#49372B',
  },

  filterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B654B',
  },

  filterButtonTextActive: {
    color: '#FFFFFF',
  },

  filterDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E67E22',
  },

  // Khung khoảng giá
  priceCard: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE7DF',
  },

  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priceInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FAF8F5',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E8DED4',
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#49372B',
  },

  priceSeparator: {
    marginHorizontal: 10,
    color: '#A99B8D',
  },

  priceError: {
    fontSize: 11,
    color: '#C0392B',
    marginTop: 8,
  },

  // Chip danh mục
  chipRow: {
    paddingHorizontal: 15,
    paddingBottom: 12,
  },

  chip: {
    paddingHorizontal: 14,
    height: 34,
    justifyContent: 'center',
    borderRadius: 17,
    marginRight: 8,
    backgroundColor: '#EFEAE4',
  },

  chipActive: {
    backgroundColor: '#49372B',
  },

  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#76695E',
  },

  chipTextActive: {
    color: '#FFFFFF',
  },

  // Products
  productHeader: {
    marginHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#49372B',
  },

  productCountBadge: {
    backgroundColor: '#EFE6DC',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  productCount: {
    fontSize: 11,
    color: '#795A43',
    fontWeight: '600',
  },

  productList: {
    paddingHorizontal: 15,
    paddingBottom: 25,
  },

  productRow: {
    justifyContent: 'space-between',
  },

  loading: {
    marginTop: 50,
  },

  message: {
    textAlign: 'center',
    color: '#8B8178',
    marginTop: 30,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;