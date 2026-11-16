
import { getDb } from '../database';

// Kiểu dữ liệu của một sản phẩm trong giỏ hàng
export type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

// 1. Lấy danh sách sản phẩm trong giỏ hàng
export const fetchCart = async (
  userId: number,
): Promise<CartItem[]> => {
  const db = getDb();

  const result = await db.execute(
    `SELECT
      cart_items.id,
      cart_items.userId,
      cart_items.productId,
      cart_items.quantity,
      products.name,
      products.price,
      products.img,
      products.categoryId
    FROM cart_items
    INNER JOIN products
      ON cart_items.productId = products.id
    WHERE cart_items.userId = ?
    ORDER BY cart_items.id DESC;`,
    [userId],
  );

  return (result.rows?._array as CartItem[]) || [];
};

// 2. Thêm sản phẩm vào giỏ hàng
// Nếu sản phẩm đã tồn tại thì tăng số lượng
export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number = 1,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    `INSERT INTO cart_items (userId, productId, quantity)
     VALUES (?, ?, ?)
     ON CONFLICT(userId, productId)
     DO UPDATE SET quantity = quantity + excluded.quantity;`,
    [userId, productId, quantity],
  );
};


// 3. Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartQuantity = async (
  userId: number,
  productId: number,
  quantity: number,
): Promise<void> => {
  const db = getDb();

  if (quantity <= 0) {
    await removeFromCart(userId, productId);
    return;
  }

  await db.execute(
    `UPDATE cart_items
     SET quantity = ?
     WHERE userId = ? AND productId = ?;`,
    [quantity, userId, productId],
  );
};

// 4. Xóa một sản phẩm khỏi giỏ hàng
export const removeFromCart = async (
  userId: number,
  productId: number,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    `DELETE FROM cart_items
     WHERE userId = ? AND productId = ?;`,
    [userId, productId],
  );
};

// 5. Xóa toàn bộ giỏ hàng của người dùng
export const clearCart = async (
  userId: number,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    `DELETE FROM cart_items WHERE userId = ?;`,
    [userId],
  );
};
