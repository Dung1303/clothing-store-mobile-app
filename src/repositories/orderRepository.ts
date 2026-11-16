import { getDb } from '../database';

export type CheckoutCartItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

export type CreatedOrder = {
  orderId: number;
  totalAmount: number;
  itemCount: number;
};

export const createOrder = async (
  userId: number,
): Promise<CreatedOrder> => {
  if (userId <= 0) {
    throw new Error('ID người dùng không hợp lệ');
  }

  const db = getDb();

  // Bắt đầu transaction
  await db.execute('BEGIN TRANSACTION;');

  try {
    // 1. Lấy sản phẩm trong giỏ hàng
    const cartResult = await db.execute(
      `SELECT
        cart_items.productId,
        products.name AS productName,
        products.price,
        cart_items.quantity
      FROM cart_items
      INNER JOIN products
        ON cart_items.productId = products.id
      WHERE cart_items.userId = ?;`,
      [userId],
    );

    const cartItems =
      (cartResult.rows?._array as CheckoutCartItem[]) || [];

    if (cartItems.length === 0) {
      throw new Error('Giỏ hàng đang trống');
    }

    // 2. Tính tổng tiền từ dữ liệu trong database
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // 3. Tạo đơn hàng
    await db.execute(
      `INSERT INTO orders (userId, totalAmount, status)
       VALUES (?, ?, ?);`,
      [userId, totalAmount, 'Pending'],
    );

    // 4. Lấy ID đơn hàng vừa tạo
    const orderIdResult = await db.execute(
      'SELECT last_insert_rowid() AS id;',
    );

    const orderId = Number(
      orderIdResult.rows?._array?.[0]?.id,
    );

    if (!orderId) {
      throw new Error('Không lấy được ID đơn hàng');
    }

    // 5. Lưu từng sản phẩm vào chi tiết đơn hàng
    for (const item of cartItems) {
      await db.execute(
        `INSERT INTO order_items
          (orderId, productId, productName, price, quantity)
         VALUES (?, ?, ?, ?, ?);`,
        [
          orderId,
          item.productId,
          item.productName,
          item.price,
          item.quantity,
        ],
      );
    }

    // 6. Xóa giỏ hàng sau khi lưu đơn hàng
    await db.execute(
      'DELETE FROM cart_items WHERE userId = ?;',
      [userId],
    );

    // 7. Hoàn tất transaction
    await db.execute('COMMIT;');

    return {
      orderId,
      totalAmount,
      itemCount: cartItems.length,
    };
  } catch (error) {
    // Có lỗi thì hoàn tác các thao tác đã thực hiện
    try {
      await db.execute('ROLLBACK;');
    } catch (rollbackError) {
      console.error('Lỗi rollback đơn hàng:', rollbackError);
    }

    console.error('Lỗi tạo đơn hàng:', error);
    throw error;
  }
};

export type OrderHistoryItem = {
  itemId: number;
  productId: number | null;
  productName: string;
  price: number;
  quantity: number;
};

export type OrderHistory = {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderHistoryItem[];
};

// Lấy lịch sử đơn hàng của một người dùng
export const fetchOrderHistory = async (
  userId: number,
): Promise<OrderHistory[]> => {
  const db = getDb();

  const result = await db.execute(
    `SELECT
      orders.id,
      orders.totalAmount,
      orders.status,
      orders.createdAt,
      order_items.id AS itemId,
      order_items.productId,
      order_items.productName,
      order_items.price,
      order_items.quantity
    FROM orders
    LEFT JOIN order_items
      ON orders.id = order_items.orderId
    WHERE orders.userId = ?
    ORDER BY orders.id DESC;`,
    [userId],
  );

  const rows = (result.rows?._array || []) as Array<{
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    itemId: number | null;
    productId: number | null;
    productName: string | null;
    price: number | null;
    quantity: number | null;
  }>;

  const orderMap = new Map<number, OrderHistory>();

  for (const row of rows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id,
        totalAmount: row.totalAmount,
        status: row.status,
        createdAt: row.createdAt,
        items: [],
      });
    }

    if (row.itemId !== null) {
      orderMap.get(row.id)!.items.push({
        itemId: row.itemId,
        productId: row.productId,
        productName: row.productName || '',
        price: row.price || 0,
        quantity: row.quantity || 0,
      });
    }
  }

  return Array.from(orderMap.values());
};

export type AdminOrder = OrderHistory & { userId: number; username: string };

// Admin xem tất cả đơn hàng, kèm tên tài khoản đặt hàng.
export const fetchAllOrders = async (): Promise<AdminOrder[]> => {
  const result = await getDb().execute(
    `SELECT orders.userId, users.username, orders.id, orders.totalAmount, orders.status,
      orders.createdAt, order_items.id AS itemId, order_items.productId,
      order_items.productName, order_items.price, order_items.quantity
     FROM orders
     LEFT JOIN users ON users.id = orders.userId
     LEFT JOIN order_items ON order_items.orderId = orders.id
     ORDER BY orders.id DESC;`,
  );
  const rows = (result.rows?._array || []) as Array<any>;
  const map = new Map<number, AdminOrder>();
  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id, userId: row.userId, username: row.username || `User #${row.userId}` ,
        totalAmount: row.totalAmount, status: row.status, createdAt: row.createdAt, items: [],
      });
    }
    if (row.itemId !== null && row.itemId !== undefined) {
      map.get(row.id)!.items.push({
        itemId: row.itemId, productId: row.productId,
        productName: row.productName || '', price: row.price || 0, quantity: row.quantity || 0,
      });
    }
  }
  return Array.from(map.values());
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
  await getDb().execute('UPDATE orders SET status = ? WHERE id = ?;', [status, orderId]);
};
