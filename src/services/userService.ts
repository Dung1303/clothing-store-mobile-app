
import bcrypt from 'bcryptjs';

import {
  findUserById,
  findUserByUsername,
  updateUsername,
  updatePassword,
} from '../repositories/userRepository';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../repositories/userRepository';

// Cập nhật tên đăng nhập
export const changeUsername = async (
  userId: number,
  newUsername: string,
): Promise<void> => {
  const username = newUsername.trim();

  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  if (!username) {
    throw new Error('Tên đăng nhập không được để trống');
  }

  if (username.length < 3) {
    throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự');
  }

  const existingUser = await findUserByUsername(username);

  if (existingUser && existingUser.id !== userId) {
    throw new Error('Tên đăng nhập đã được sử dụng');
  }

  await updateUsername(userId, username);
};

// Đổi mật khẩu
export const changeUserPassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  if (!currentPassword || !newPassword) {
    throw new Error('Vui lòng nhập đầy đủ mật khẩu');
  }

  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  if (currentPassword === newPassword) {
    throw new Error('Mật khẩu mới phải khác mật khẩu hiện tại');
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error('Không tìm thấy tài khoản');
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new Error('Mật khẩu hiện tại không chính xác');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await updatePassword(userId, hashedPassword);
};

import type { UserInfo } from '../types/user';

// Lấy danh sách người dùng
export const getUsers = async (): Promise<UserInfo[]> => {
  return await getAllUsers();
};

// Thay đổi vai trò người dùng
export const changeUserRole = async (
  userId: number,
  role: 'user' | 'admin',
): Promise<void> => {
  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  if (role !== 'user' && role !== 'admin') {
    throw new Error('Vai trò không hợp lệ');
  }

  await updateUserRole(userId, role);
};

// Xóa người dùng
export const removeUser = async (
  userId: number,
): Promise<void> => {
  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  await deleteUser(userId);
};
