import * as bcrypt from 'bcryptjs';

import {
  findUserByUsername,
  findUserById,
  createUser,
} from '../repositories/userRepository';

import type { UserInfo } from '../types/user';

// Đăng ký tài khoản
export const register = async (
  username: string,
  password: string,
): Promise<UserInfo> => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    throw new Error('Vui lòng nhập tên đăng nhập');
  }

  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  const existingUser = await findUserByUsername(trimmedUsername);

  if (existingUser) {
    throw new Error('Tên đăng nhập đã tồn tại');
  }

  // Mã hóa mật khẩu trước khi lưu vào database
  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser(trimmedUsername, hashedPassword);

  const newUser = await findUserByUsername(trimmedUsername);

  if (!newUser) {
    throw new Error('Không thể tạo tài khoản');
  }

  return {
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
  };
};

// Đăng nhập
export const login = async (
  username: string,
  password: string,
): Promise<UserInfo> => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername || !password) {
    throw new Error('Vui lòng nhập đầy đủ thông tin');
  }

  const user = await findUserByUsername(trimmedUsername);

  if (!user) {
    throw new Error('Tài khoản không tồn tại');
  }

  // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new Error('Mật khẩu không chính xác');
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
};

// Lấy thông tin người dùng theo ID
export const getUserInfo = async (
  id: number,
): Promise<UserInfo | null> => {
  if (id <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  const user = await findUserById(id);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
};