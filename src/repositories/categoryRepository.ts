
import {getDb} from '../database';
import type {Category} from '../types/category';

export type CategoryWithProductCount = Category & {
  productCount: number;
};

// Lấy danh sách danh mục kèm số lượng sản phẩm
export const fetchCategories = async (): Promise<
  CategoryWithProductCount[]
> => {
  const db = getDb();

  const result = await db.execute(`
    SELECT
      c.id,
      c.name,
      COUNT(p.id) AS productCount
    FROM categories c
    LEFT JOIN products p ON p.categoryId = c.id
    GROUP BY c.id, c.name
    ORDER BY c.id DESC;
  `);

  return (result.rows?._array as CategoryWithProductCount[]) || [];
};

// Kiểm tra danh mục theo ID
export const fetchCategoryById = async (
  id: number,
): Promise<Category | null> => {
  const db = getDb();

  const result = await db.execute(
    'SELECT * FROM categories WHERE id = ?;',
    [id],
  );

  const rows = (result.rows?._array as Category[]) || [];

  return rows[0] || null;
};

// Kiểm tra tên danh mục
export const findCategoryByName = async (
  name: string,
): Promise<Category | null> => {
  const db = getDb();

  const result = await db.execute(
    'SELECT * FROM categories WHERE LOWER(TRIM(name)) = LOWER(TRIM(?));',
    [name],
  );

  const rows = (result.rows?._array as Category[]) || [];

  return rows[0] || null;
};

// Thêm danh mục
export const addCategory = async (
  name: string,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    'INSERT INTO categories (name) VALUES (?);',
    [name],
  );
};

// Sửa danh mục
export const updateCategory = async (
  id: number,
  name: string,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    'UPDATE categories SET name = ? WHERE id = ?;',
    [name, id],
  );
};

// Đếm số sản phẩm thuộc danh mục
export const countProductsInCategory = async (
  id: number,
): Promise<number> => {
  const db = getDb();

  const result = await db.execute(
    'SELECT COUNT(*) AS total FROM products WHERE categoryId = ?;',
    [id],
  );

  const rows =
    (result.rows?._array as Array<{total: number}>) || [];

  return rows[0]?.total ?? 0;
};

// Xóa danh mục
export const deleteCategory = async (
  id: number,
): Promise<void> => {
  const db = getDb();

  await db.execute(
    'DELETE FROM categories WHERE id = ?;',
    [id],
  );
};
