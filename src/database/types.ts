export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

// Dùng cho những nơi không cần nhận mật khẩu đã hash.
export type SafeUser = Omit<User, 'password'>;
