
import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdminScreenHeader from './AdminScreenHeader';

import {
  getAllCategories,
  createCategory,
  editCategory,
  removeCategory,
} from '../../services/categoryService';

import type { CategoryWithProductCount } from '../../repositories/categoryRepository';

type Props = {
  navigation: {
    goBack: () => void;
    navigate: (
      screen: 'ProductManagement',
      params: { categoryId: number; categoryName: string },
    ) => void;
  };
};

const CategoryManagementScreen = ({ navigation }: Props) => {
  const [categories, setCategories] = useState<
    CategoryWithProductCount[]
  >([]);

  const [name, setName] = useState('');
  const [editing, setEditing] =
    useState<CategoryWithProductCount | null>(null);

  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories]),
  );

  const resetForm = () => {
    setName('');
    setEditing(null);
    Keyboard.dismiss();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setLoading(true);

      if (editing) {
        await editCategory(editing.id, name);
        Alert.alert('Thành công', 'Đã cập nhật danh mục');
      } else {
        await createCategory(name);
        Alert.alert('Thành công', 'Đã thêm danh mục');
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      Alert.alert(
        'Không thể lưu',
        error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: CategoryWithProductCount) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa danh mục "${item.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeCategory(item.id);

              if (editing?.id === item.id) {
                resetForm();
              }

              await loadCategories();

              Alert.alert('Thành công', 'Đã xóa danh mục');
            } catch (error) {
              Alert.alert(
                'Không thể xóa',
                error instanceof Error ? error.message : 'Đã xảy ra lỗi',
              );
            }
          },
        },
      ],
    );
  };

  const renderCategory = ({
    item,
  }: {
    item: CategoryWithProductCount;
  }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryMainRow}>
        <View style={styles.categoryIcon}>
          <Text style={styles.categoryIconText}>▤</Text>
        </View>

        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>
            {item.name}
          </Text>

          <Text style={styles.productCount}>
            {item.productCount} sản phẩm
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setEditing(item);
            setName(item.name);
          }}
        >
          <Text style={styles.editText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addProductButton}
        onPress={() =>
          navigation.navigate('ProductManagement', {
            categoryId: item.id,
            categoryName: item.name,
          })
        }
      >
        <Text style={styles.addProductText}>+ Thêm sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AdminScreenHeader
        title="Quản lý danh mục"
        subtitle={`Tổng số: ${categories.length} danh mục`}
      />
      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editing ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập tên danh mục"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>
                {editing ? 'Cập nhật' : 'Thêm danh mục'}
              </Text>
            )}
          </TouchableOpacity>

          {editing && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={resetForm}
            >
              <Text style={styles.cancelText}>
                Hủy chỉnh sửa
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.listHeading}>
          <Text style={styles.listTitle}>
            Danh sách danh mục
          </Text>

          <Text style={styles.total}>
            {categories.length} danh mục
          </Text>
        </View>

        <FlatList
          data={categories}
          keyExtractor={item => String(item.id)}
          renderItem={renderCategory}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Chưa có danh mục nào.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 16,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#26352C',
    marginBottom: 14,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E7E2',
    borderRadius: 9,
    paddingHorizontal: 13,
    color: '#26352C',
  },
  saveButton: {
    height: 46,
    borderRadius: 9,
    backgroundColor: '#287A50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 13,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 10,
  },
  cancelText: {
    color: '#777777',
  },
  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 23,
    marginBottom: 12,
  },
  listTitle: {
    color: '#26352C',
    fontSize: 17,
    fontWeight: 'bold',
  },
  total: {
    color: '#287A50',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 25,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  categoryMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#E8F5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 23,
    color: '#287A50',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 11,
  },
  categoryName: {
    color: '#26352C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productCount: {
    color: '#8A938C',
    fontSize: 12,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#E8F5EC',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 7,
    marginRight: 6,
  },
  editText: {
    color: '#287A50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#FDECEC',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 7,
  },
  deleteText: {
    color: '#D94343',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addProductButton: {
    alignItems: 'center',
    backgroundColor: '#E8F5EC',
    borderRadius: 7,
    marginTop: 10,
    paddingVertical: 9,
  },
  addProductText: {
    color: '#287A50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#888888',
    marginTop: 30,
  },
});

export default CategoryManagementScreen;
