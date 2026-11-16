import {
  createOrder,
  type CreatedOrder,
} from '../repositories/orderRepository';
import {
  fetchOrderHistory,
  type OrderHistory,
} from '../repositories/orderRepository';

export const checkout = async (
  userId: number,
): Promise<CreatedOrder> => {
  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  return await createOrder(userId);
};
// Lấy lịch sử đơn hàng của người dùng
export const getOrderHistory = async (
  userId: number,
): Promise<OrderHistory[]> => {
  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  return await fetchOrderHistory(userId);
};