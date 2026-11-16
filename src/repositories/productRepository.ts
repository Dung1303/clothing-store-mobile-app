
import { getDb } from '../database';
import type { Product } from '../types/product';

// Lấy toàn bộ danh sách sản phẩm
export const fetchProducts = async (): Promise<Product[]> => {
  const db = getDb();

  const result = await db.execute(
    'SELECT * FROM products ORDER BY id DESC;',
  );

  return (result.rows?._array as Product[]) || [];
};

// Lấy thông tin một sản phẩm theo ID
export const fetchProductById = async (
  id: number,
): Promise<Product | null> => {
  const db = getDb();

  const result = await db.execute(
    'SELECT * FROM products WHERE id = ?;',
    [id],
  );

  const products = (result.rows?._array as Product[]) || [];

  return products.length > 0 ? products[0] : null;
};

// Thêm sản phẩm mới
export const addProduct = async (
  product: Omit<Product, 'id'>,
): Promise<void> => {
  const db = getDb();

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
};

// Cập nhật thông tin sản phẩm
export const updateProduct = async (
  product: Product,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    `UPDATE products
     SET name = ?, price = ?, img = ?, categoryId = ?
     WHERE id = ?;`,
    [
      product.name,
      product.price,
      product.img,
      product.categoryId,
      product.id,
    ],
  );
};

// Xóa sản phẩm theo ID
export const deleteProduct = async (id: number): Promise<void> => {
  const db = getDb();

  await db.execute(
    'DELETE FROM products WHERE id = ?;',
    [id],
  );
};

// Lọc sản phẩm theo danh mục
export const fetchProductsByCategory = async (
  categoryId: number,
): Promise<Product[]> => {
  const db = getDb();

  const result = await db.execute(
    'SELECT * FROM products WHERE categoryId = ? ORDER BY id DESC;',
    [categoryId],
  );

  return (result.rows?._array as Product[]) || [];
};

// Tìm kiếm sản phẩm theo tên hoặc tên danh mục
export const searchProductsByNameOrCategory = async (
  keyword: string,
): Promise<Product[]> => {
  const db = getDb();

  const result = await db.execute(
    `SELECT products.*
     FROM products
     LEFT JOIN categories
       ON products.categoryId = categories.id
     WHERE products.name LIKE ?
        OR categories.name LIKE ?
     ORDER BY products.id DESC;`,
    [`%${keyword}%`, `%${keyword}%`],
  );

  return (result.rows?._array as Product[]) || [];
};

// Lọc sản phẩm theo khoảng giá
export const fetchProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
): Promise<Product[]> => {
  const db = getDb();

  const result = await db.execute(
    `SELECT * FROM products
     WHERE price BETWEEN ? AND ?
     ORDER BY price ASC;`,
    [minPrice, maxPrice],
  );

  return (result.rows?._array as Product[]) || [];
};
