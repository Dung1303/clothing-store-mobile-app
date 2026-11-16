import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { UserInfo } from '../types/user';
import {
  getUserSession,
  saveUserSession,
  removeUserSession,
} from '../services/sessionService';

type AuthContextType = {
  user: UserInfo | null;
  loading: boolean;
  signIn: (user: UserInfo) => Promise<void>;
  signOut: () => Promise<void>;
  updateAuthUser: (user: UserInfo) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra phiên đăng nhập khi mở ứng dụng
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedUser = await getUserSession();
        setUser(savedUser);
      } catch (error) {
        console.error('Lỗi khôi phục phiên đăng nhập:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // Đăng nhập và lưu phiên
  const signIn = async (userInfo: UserInfo) => {
    await saveUserSession(userInfo);
    setUser(userInfo);
  };
  // Cập nhật thông tin người dùng trong phiên đăng nhập
  const updateAuthUser = async (userInfo: UserInfo) => {
    await saveUserSession(userInfo);
    setUser(userInfo);
  };

  // Đăng xuất và xóa phiên
  const signOut = async () => {
    try {
      await removeUserSession();
      console.log('Đã xóa phiên đăng nhập');
    } catch (error) {
      console.error('Lỗi xóa phiên đăng nhập:', error);
    } finally {
      // Luôn cập nhật trạng thái đăng xuất
      setUser(null);
      console.log('Đã đăng xuất, user = null');
    }
  };


  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signOut, updateAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook để các màn hình lấy thông tin đăng nhập
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }

  return context;
};