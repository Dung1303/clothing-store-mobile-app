
import {
  fetchCategories,
  fetchCategoryById,
  findCategoryByName,
  addCategory,
  updateCategory,
  countProductsInCategory,
  deleteCategory,
  type CategoryWithProductCount,
} from '../repositories/categoryRepository';

export const getAllCategories = async (): Promise<
  CategoryWithProductCount[]
> => {
  return fetchCategories();
};

// Thêm danh mục
export const createCategory = async (
  name: string,
): Promise<void> => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error('Vui lòng nhập tên danh mục');
  }

  if (trimmedName.length > 50) {
    throw new Error('Tên danh mục không được vượt quá 50 ký tự');
  }

  const existing = await findCategoryByName(trimmedName);

  if (existing) {
    throw new Error('Tên danh mục đã tồn tại');
  }

  await addCategory(trimmedName);
};

// Sửa danh mục
export const editCategory = async (
  id: number,
  name: string,
): Promise<void> => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error('Vui lòng nhập tên danh mục');
  }

  const category = await fetchCategoryById(id);

  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }

  const existing = await findCategoryByName(trimmedName);

  if (existing && existing.id !== id) {
    throw new Error('Tên danh mục đã được sử dụng');
  }

  await updateCategory(id, trimmedName);
};

// Xóa danh mục
export const removeCategory = async (
  id: number,
): Promise<void> => {
  const category = await fetchCategoryById(id);

  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }

  const productCount = await countProductsInCategory(id);

  if (productCount > 0) {
    throw new Error(
      `Danh mục đang có ${productCount} sản phẩm. Không thể xóa.`,
    );
  }

  await deleteCategory(id);
};
