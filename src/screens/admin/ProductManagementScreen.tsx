
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';

import AdminScreenHeader from './AdminScreenHeader';

import type { Product } from '../../types/product';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getAllProducts,
  createProduct,
  editProduct,
  removeProduct,
} from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';

type Category = {
  id: number;
  name: string;
};

type Props = {
  navigation: {
    goBack: () => void;
  };
  route: {
    params?: {
      categoryId?: number;
      categoryName?: string;
    };
  };
};

const ProductManagementScreen = ({ route }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [defaultCategoryId, setDefaultCategoryId] = useState('');
  const [categoryContextName, setCategoryContextName] = useState<string | null>(
    null,
  );
  const [imageUri, setImageUri] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);

  const refreshProducts = async () => {
    try {
      setProducts(await getAllProducts());
    } catch (error) {
      console.error('Lỗi tải lại danh sách sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể tải lại danh sách sản phẩm');
    }
  };

  const requestedCategoryId = route.params?.categoryId;
  const requestedCategoryName = route.params?.categoryName;

  // Lấy dữ liệu và xác thực danh mục được truyền từ màn hình quản lý danh mục
  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);

        if (!isActive) {
          return;
        }

        setProducts(productData);
        setCategories(categoryData);

        if (
          requestedCategoryId === undefined &&
          requestedCategoryName === undefined
        ) {
          setCategoryId('');
          setDefaultCategoryId('');
          setCategoryContextName(null);
          return;
        }

        const selectedCategory =
          typeof requestedCategoryId === 'number' &&
          Number.isInteger(requestedCategoryId) &&
          requestedCategoryId > 0
            ? categoryData.find(
                category => category.id === requestedCategoryId,
              )
            : undefined;

        if (!selectedCategory) {
          setCategoryId('');
          setDefaultCategoryId('');
          setCategoryContextName(null);
          Alert.alert(
            'Danh mục không hợp lệ',
            'Danh mục được chọn không còn tồn tại. Vui lòng chọn danh mục khác.',
          );
          return;
        }

        const selectedId = String(selectedCategory.id);
        setCategoryId(selectedId);
        setDefaultCategoryId(selectedId);
        setCategoryContextName(selectedCategory.name);
      } catch (error) {
        console.error('Lỗi tải dữ liệu sản phẩm:', error);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm');
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [requestedCategoryId, requestedCategoryName]);

  // Chọn ảnh từ thư viện điện thoại
  const chooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: true,
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.7,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          'Lỗi',
          result.errorMessage || 'Không thể chọn ảnh',
        );
        return;
      }

      const asset = result.assets?.[0];

      if (!asset || !asset.base64) {
        Alert.alert(
          'Thông báo',
          'Không thể đọc dữ liệu ảnh. Vui lòng chọn lại.',
        );
        return;
      }

      const mimeType = asset.type || 'image/jpeg';

      const base64Image =
        `data:${mimeType};base64,${asset.base64}`;

      setImageUri(base64Image);

    } catch (error) {
      console.log('Lỗi chọn ảnh:', error);

      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
    }
  };

  // Xóa dữ liệu trên form
  const resetForm = () => {
    setName('');
    setPrice('');
    setCategoryId(defaultCategoryId);
    setImageUri('');
    setEditingId(null);
  };

  // Thêm hoặc cập nhật sản phẩm
  const handleSaveProduct = async () => {
    if (!name.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!price.trim() || Number(price) <= 0 || !Number.isFinite(Number(price))) {
      Alert.alert('Thông báo', 'Vui lòng nhập giá sản phẩm hợp lệ');
      return;
    }

    if (!categoryId) {
      Alert.alert('Thông báo', 'Vui lòng chọn danh mục');
      return;
    }

    if (!imageUri) {
      Alert.alert('Thông báo', 'Vui lòng chọn ảnh sản phẩm');
      return;
    }

    try {
      const productData = {
        name: name.trim(),
        price: Number(price),
        img: imageUri,
        categoryId: Number(categoryId),
      };

      if (editingId !== null) {
        await editProduct({
          id: editingId,
          ...productData,
        });

        Alert.alert('Thành công', 'Cập nhật sản phẩm thành công');
      } else {
        await createProduct(productData);

        Alert.alert('Thành công', 'Thêm sản phẩm thành công');
      }

      resetForm();
      await refreshProducts();

    } catch (error) {
      console.log('Lỗi lưu sản phẩm:', error);

      Alert.alert('Lỗi', 'Không thể lưu sản phẩm');
    }
  };

  // Đưa thông tin sản phẩm lên form để chỉnh sửa
  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setCategoryId(String(product.categoryId));
    setImageUri(product.img || '');

    // Cuộn lên đầu màn hình để sửa
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  // Xóa sản phẩm
  const handleDeleteProduct = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
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
              await removeProduct(id);

              Alert.alert('Thành công', 'Đã xóa sản phẩm');

              if (editingId === id) {
                resetForm();
              }

              await refreshProducts();
            } catch (error) {
              console.error('Lỗi xóa sản phẩm:', error);
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
            }
          },
        },
      ],
    );
  };

  const scrollRef = React.useRef<React.ElementRef<typeof ScrollView>>(null);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >

      <AdminScreenHeader
        title="Quản lý sản phẩm"
        subtitle={`Tổng số: ${products.length} sản phẩm`}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
      >

        <Text style={styles.heading}>
          {editingId !== null
            ? 'CẬP NHẬT SẢN PHẨM'
            : 'THÊM SẢN PHẨM MỚI'}
        </Text>

        {/* Chọn ảnh */}
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={chooseImage}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.cameraIcon}>＋</Text>
              <Text style={styles.imageText}>
                Chọn ảnh từ điện thoại
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {imageUri !== '' && (
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={chooseImage}
          >
            <Text style={styles.changeImageText}>
              Thay đổi ảnh
            </Text>
          </TouchableOpacity>
        )}

        {/* Tên sản phẩm */}
        <Text style={styles.label}>Tên sản phẩm</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập tên sản phẩm"
          value={name}
          onChangeText={setName}
        />

        {/* Giá */}
        <Text style={styles.label}>Giá sản phẩm (VNĐ)</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập giá sản phẩm"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        {/* Danh mục */}
        <Text style={styles.label}>Danh mục sản phẩm</Text>

        {editingId === null && categoryContextName !== null && (
          <Text style={styles.categoryContext}>
            Đang thêm sản phẩm vào danh mục: {categoryContextName}
          </Text>
        )}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(value) => setCategoryId(String(value))}
            enabled={editingId !== null || defaultCategoryId === ''}
          >
            <Picker.Item
              label="-- Chọn danh mục --"
              value=""
            />

            {categories.map(category => (
              <Picker.Item
                key={category.id}
                label={category.name}
                value={String(category.id)}
              />
            ))}
          </Picker>
        </View>

        {/* Nút lưu */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProduct}
        >
          <Text style={styles.saveButtonText}>
            {editingId !== null
              ? 'CẬP NHẬT SẢN PHẨM'
              : 'THÊM SẢN PHẨM'}
          </Text>
        </TouchableOpacity>

        {editingId !== null && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={resetForm}
          >
            <Text style={styles.cancelText}>
              Hủy chỉnh sửa
            </Text>
          </TouchableOpacity>
        )}

        {/* Danh sách sản phẩm */}
        <Text style={styles.listHeading}>
          DANH SÁCH SẢN PHẨM ({products.length})
        </Text>

        {products.map(product => (
          <View
            key={product.id}
            style={styles.productCard}
          >
            <Image
              source={{ uri: product.img }}
              style={styles.productImage}
              resizeMode="cover"
            />

            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {product.name}
              </Text>

              <Text style={styles.productPrice}>
                {product.price.toLocaleString('vi-VN')} đ
              </Text>

              <Text style={styles.productCategory}>
                Danh mục ID: {product.categoryId}
              </Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditProduct(product)}
                >
                  <Text style={styles.actionText}>
                    Sửa
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProduct(product.id)}
                >
                  <Text style={styles.actionText}>
                    Xóa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

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
    marginBottom: 15,
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
    marginBottom: 18,
  },

  imagePicker: {
    height: 190,
    borderWidth: 1,
    borderColor: '#287A50',
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePlaceholder: {
    alignItems: 'center',
  },

  cameraIcon: {
    fontSize: 40,
    color: '#287A50',
  },

  imageText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  changeImageButton: {
    alignSelf: 'center',
    padding: 10,
  },

  changeImageText: {
    color: '#287A50',
    fontWeight: '600',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginTop: 15,
    marginBottom: 7,
  },

  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    overflow: 'hidden',
  },

  categoryContext: {
    color: '#287A50',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  saveButton: {
    backgroundColor: '#287A50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 22,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },

  cancelText: {
    color: '#666666',
  },

  listHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#287A50',
    marginTop: 30,
    marginBottom: 15,
  },

  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },

  productImage: {
    width: 95,
    height: 115,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },

  productPrice: {
    color: '#E53935',
    fontWeight: 'bold',
    marginTop: 7,
  },

  productCategory: {
    fontSize: 12,
    color: '#777777',
    marginTop: 5,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },

  editButton: {
    backgroundColor: '#287A50',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 5,
  },

  deleteButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 5,
  },

  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ProductManagementScreen;
