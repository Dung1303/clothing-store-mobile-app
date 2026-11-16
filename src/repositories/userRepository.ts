
import { getDb } from '../database';

import type { User, UserInfo } from '../types/user';

// ==========================================
// 1. TÌM NGƯỜI DÙNG THEO USERNAME
// ==========================================

export const findUserByUsername = async (
  username: string,
): Promise<User | null> => {
  const db = getDb();

  const result = await db.execute(
    'SELECT * FROM users WHERE username = ?;',
    [username],
  );

  const users = (result.rows?._array as User[]) || [];

  return users.length > 0 ? users[0] : null;
};

// ==========================================
// 2. TÌM NGƯỜI DÙNG THEO ID
// ==========================================

export const findUserById = async (
  id: number,
): Promise<User | null> => {
  const db = getDb();

  const result = await db.execute(
    'SELECT * FROM users WHERE id = ?;',
    [id],
  );

  const users = (result.rows?._array as User[]) || [];

  return users.length > 0 ? users[0] : null;
};

// ==========================================
// 3. TẠO TÀI KHOẢN MỚI
// ==========================================

export const createUser = async (
  username: string,
  hashedPassword: string,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    `INSERT INTO users (username, password, role)
     VALUES (?, ?, ?);`,
    [username, hashedPassword, 'user'],
  );
};

// ==========================================
// 4. CẬP NHẬT TÊN ĐĂNG NHẬP
// ==========================================

export const updateUsername = async (
  userId: number,
  newUsername: string,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    'UPDATE users SET username = ? WHERE id = ?;',
    [newUsername, userId],
  );
};

// ==========================================
// 5. CẬP NHẬT MẬT KHẨU
// ==========================================

export const updatePassword = async (
  userId: number,
  hashedPassword: string,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    'UPDATE users SET password = ? WHERE id = ?;',
    [hashedPassword, userId],
  );
};

// ==========================================
// 6. LẤY DANH SÁCH TẤT CẢ NGƯỜI DÙNG
// ==========================================

export const getAllUsers = async (): Promise<UserInfo[]> => {
  const db = getDb();

  const result = await db.execute(
    `SELECT id, username, role
     FROM users
     ORDER BY id DESC;`,
  );

  return (result.rows?._array as UserInfo[]) || [];
};

// ==========================================
// 7. CẬP NHẬT VAI TRÒ NGƯỜI DÙNG
// ==========================================

export const updateUserRole = async (
  userId: number,
  role: 'user' | 'admin',
): Promise<void> => {
  const db = getDb();

  await db.execute(
    'UPDATE users SET role = ? WHERE id = ?;',
    [role, userId],
  );
};

// ==========================================
// 8. XÓA NGƯỜI DÙNG
// ==========================================

export const deleteUser = async (
  userId: number,
): Promise<void> => {
  const db = getDb();

  // Xóa chi tiết đơn hàng của người dùng
  await db.execute(
    `DELETE FROM order_items
     WHERE orderId IN (
       SELECT id FROM orders WHERE userId = ?
     );`,
    [userId],
  );

  // Xóa đơn hàng của người dùng
  await db.execute(
    'DELETE FROM orders WHERE userId = ?;',
    [userId],
  );

  // Xóa sản phẩm trong giỏ hàng của người dùng
  await db.execute(
    'DELETE FROM cart_items WHERE userId = ?;',
    [userId],
  );

  // Xóa tài khoản người dùng
  await db.execute(
    'DELETE FROM users WHERE id = ?;',
    [userId],
  );
};
