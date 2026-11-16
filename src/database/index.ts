import { open, type NitroSQLiteConnection } from 'react-native-nitro-sqlite';
import 'react-native-get-random-values';

let db: NitroSQLiteConnection | null = null;

// Chỉ quản lý và trả về kết nối SQLite dùng chung.
export const getDb = (): NitroSQLiteConnection => {
  if (db) {
    return db;
  }

  db = open({ name: 'myDatabase.db' });
  return db;
};
