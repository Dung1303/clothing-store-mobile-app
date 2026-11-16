import * as bcrypt from 'bcryptjs';
import { getDb } from './index';

export const seedData = async (): Promise<void> => {
  const db = getDb();

  try {
    // 1. Kiểm tra và thêm danh mục mẫu
    const categoryResult = await db.execute(
      'SELECT COUNT(*) AS total FROM categories;',
    );

    const categoryCount =
      (categoryResult.rows?._array as Array<{ total: number }> | undefined)?.[0]
        ?.total ?? 0;

    if (categoryCount === 0) {
      const categories = ['Áo thun', 'Áo sơ mi', 'Quần jeans', 'Váy'];

      for (const name of categories) {
        await db.execute(
          'INSERT INTO categories (name) VALUES (?);',
          [name],
        );
      }
    }

    // 2. Lấy danh sách danh mục để xác định categoryId
    const categoryRows = await db.execute(
      'SELECT id, name FROM categories;',
    );

    const categories =
      (categoryRows.rows?._array as Array<{ id: number; name: string }>) || [];

    const getCategoryId = (name: string): number | null =>
      categories.find(category => category.name === name)?.id ?? null;

    // 3. Kiểm tra và thêm sản phẩm mẫu
    const productResult = await db.execute(
      'SELECT COUNT(*) AS total FROM products;',
    );

    const productCount =
      (productResult.rows?._array as Array<{ total: number }> | undefined)?.[0]
        ?.total ?? 0;

    if (productCount === 0) {
      const products = [
        {
          name: 'Áo thun basic trắng',
          price: 150000,
          img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          categoryId: getCategoryId('Áo thun'),
        },
        {
          name: 'Áo thun basic đen',
          price: 160000,
          img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500',
          categoryId: getCategoryId('Áo thun'),
        },
        {
          name: 'Áo sơ mi nam',
          price: 250000,
          img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
          categoryId: getCategoryId('Áo sơ mi'),
        },
        {
          name: 'Áo sơ mi nữ',
          price: 230000,
          img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500',
          categoryId: getCategoryId('Áo sơ mi'),
        },
        {
          name: 'Quần jeans xanh',
          price: 350000,
          img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
          categoryId: getCategoryId('Quần jeans'),
        },
        {
          name: 'Quần jeans đen',
          price: 380000,
          img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
          categoryId: getCategoryId('Quần jeans'),
        },
        {
          name: 'Váy nữ thanh lịch',
          price: 320000,
          img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
          categoryId: getCategoryId('Váy'),
        },
        {
          name: 'Váy nữ mùa hè',
          price: 290000,
          img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500',
          categoryId: getCategoryId('Váy'),
        },
      ];

      for (const product of products) {
        if (product.categoryId !== null) {
          await db.execute(
            `INSERT INTO products (name, price, img, categoryId)
             VALUES (?, ?, ?, ?);`,
            [
              product.name,
              product.price,
              product.img,
              product.categoryId,
            ],
          );
        }
      }
    }

    // 4. Đồng bộ tài khoản Admin mặc định cho bài thực hành.
    // Mỗi lần initDatabase() chạy, mật khẩu Admin được đặt về Admin@123.
    // Điều này giúp sửa cả trường hợp database cũ đang lưu mật khẩu không đúng.
    const adminUsername = 'admin@gmail.com';
    const defaultAdminPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);

    const adminResult = await db.execute(
      'SELECT id FROM users WHERE username = ? LIMIT 1;',
      [adminUsername],
    );

    const admins = (adminResult.rows?._array as Array<{ id: number }> | undefined) ?? [];

    if (admins.length === 0) {
      await db.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?);',
        [adminUsername, hashedPassword, 'admin'],
      );
    } else {
      await db.execute(
        'UPDATE users SET password = ?, role = ? WHERE id = ?;',
        [hashedPassword, 'admin', admins[0].id],
      );
    }

    // Đọc lại dữ liệu từ SQLite và xác minh hash trước khi cho phép vào app.
    const verifyResult = await db.execute(
      'SELECT password, role FROM users WHERE username = ? LIMIT 1;',
      [adminUsername],
    );
    const verifiedRows = (verifyResult.rows?._array as Array<{
      password: string;
      role: string;
    }> | undefined) ?? [];
    const savedAdmin = verifiedRows[0];

    if (
      !savedAdmin ||
      savedAdmin.role !== 'admin' ||
      !(await bcrypt.compare(defaultAdminPassword, savedAdmin.password))
    ) {
      throw new Error('Không thể đồng bộ tài khoản Admin mặc định trong SQLite.');
    }

    console.log('Admin account verified successfully:', adminUsername);

    console.log('Seed data initialized successfully');
  } catch (error) {
    console.error('Seed data error:', error);
    throw error;
  }
};