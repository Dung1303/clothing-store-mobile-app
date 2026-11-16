
import type { Product } from '../types/product';

import {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProductsByCategory,
  searchProductsByNameOrCategory,
  fetchProductsByPriceRange,
} from '../repositories/productRepository';

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = async (): Promise<Product[]> => {
  return await fetchProducts();
};

// Lấy thông tin sản phẩm theo ID
export const getProductDetail = async (
  id: number,
): Promise<Product | null> => {
  return await fetchProductById(id);
};

// Thêm sản phẩm mới
export const createProduct = async (
  product: Omit<Product, 'id'>,
): Promise<void> => {
  if (!product.name.trim()) {
    throw new Error('Tên sản phẩm không được để trống');
  }

  if (product.price <= 0) {
    throw new Error('Giá sản phẩm phải lớn hơn 0');
  }

  if (!product.categoryId) {
    throw new Error('Vui lòng chọn danh mục sản phẩm');
  }

  return await addProduct(product);
};

// Cập nhật thông tin sản phẩm
export const editProduct = async (
  product: Product,
): Promise<void> => {
  if (!product.name.trim()) {
    throw new Error('Tên sản phẩm không được để trống');
  }

  if (product.price <= 0) {
    throw new Error('Giá sản phẩm phải lớn hơn 0');
  }

  return await updateProduct(product);
};

// Xóa sản phẩm
export const removeProduct = async (
  id: number,
): Promise<void> => {
  if (id <= 0) {
    throw new Error('ID sản phẩm không hợp lệ');
  }

  return await deleteProduct(id);
};

// Lọc sản phẩm theo danh mục
export const getProductsByCategory = async (
  categoryId: number,
): Promise<Product[]> => {
  return await fetchProductsByCategory(categoryId);
};

// Tìm kiếm sản phẩm theo tên hoặc danh mục
export const searchProducts = async (
  keyword: string,
): Promise<Product[]> => {
  return await searchProductsByNameOrCategory(keyword.trim());
};

// Lọc sản phẩm theo khoảng giá
export const filterProductsByPrice = async (
  minPrice: number,
  maxPrice: number,
): Promise<Product[]> => {
  if (minPrice < 0 || maxPrice < minPrice) {
    throw new Error('Khoảng giá không hợp lệ');
  }

  return await fetchProductsByPriceRange(minPrice, maxPrice);
};
