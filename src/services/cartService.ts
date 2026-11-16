
import {
  fetchCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from '../repositories/cartRepository';

import type { CartItem } from '../repositories/cartRepository';

// Lấy giỏ hàng
export const getCart = async (
  userId: number,
): Promise<CartItem[]> => {
  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  return await fetchCart(userId);
};

// Thêm sản phẩm vào giỏ hàng
export const addProductToCart = async (
  userId: number,
  productId: number,
  quantity: number = 1,
): Promise<void> => {
  if (userId <= 0 || productId <= 0) {
    throw new Error('Thông tin người dùng hoặc sản phẩm không hợp lệ');
  }

  if (quantity <= 0 || !Number.isInteger(quantity)) {
    throw new Error('Số lượng sản phẩm phải là số nguyên lớn hơn 0');
  }

  return await addToCart(userId, productId, quantity);
};

// Thay đổi số lượng sản phẩm
export const changeCartQuantity = async (
  userId: number,
  productId: number,
  quantity: number,
): Promise<void> => {
  if (userId <= 0 || productId <= 0) {
    throw new Error('Thông tin không hợp lệ');
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error('Số lượng không hợp lệ');
  }

  return await updateCartQuantity(userId, productId, quantity);
};

// Xóa sản phẩm
export const deleteCartItem = async (
  userId: number,
  productId: number,
): Promise<void> => {
  if (userId <= 0 || productId <= 0) {
    throw new Error('Thông tin không hợp lệ');
  }

  return await removeFromCart(userId, productId);
};

// Xóa toàn bộ giỏ hàng
export const deleteAllCartItems = async (
  userId: number,
): Promise<void> => {
  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  return await clearCart(userId);
};
