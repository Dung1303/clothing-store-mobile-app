import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserInfo } from '../types/user';

const SESSION_KEY = 'loggedInUser';

// Lưu thông tin người dùng sau khi đăng nhập thành công
export const saveUserSession = async (
  user: UserInfo,
): Promise<void> => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

// Lấy thông tin người dùng đã đăng nhập
export const getUserSession = async (): Promise<UserInfo | null> => {
  const data = await AsyncStorage.getItem(SESSION_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as UserInfo;
  } catch (error) {
    console.warn('Invalid saved user session; clearing it.', error);
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }
};

// Đăng xuất
export const removeUserSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY);
};