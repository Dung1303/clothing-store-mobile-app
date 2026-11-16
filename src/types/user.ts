export type User = {
  id: number;
  username: string;
  password: string;
  role: 'user' | 'admin';
};

// Thông tin người dùng trả về cho giao diện,
// không bao gồm mật khẩu.
export type UserInfo = {
  id: number;
  username: string;
  role: 'user' | 'admin';
};