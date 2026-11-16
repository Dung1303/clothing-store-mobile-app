import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAllOrders, updateOrderStatus, type AdminOrder } from '../../repositories/orderRepository';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './AdminStyles';
import AdminScreenHeader from './AdminScreenHeader';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
const STATUS_LABEL: Record<string, string> = { Pending: 'Chờ xác nhận', Processing: 'Đang xử lý', Shipped: 'Đang giao', Completed: 'Hoàn thành', Cancelled: 'Đã hủy' };
const OrderManagementScreen = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const load = useCallback(async () => { try { setOrders(await fetchAllOrders()); } catch { Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng'); } }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const changeStatus = (order: AdminOrder) => Alert.alert(`Đơn hàng #${order.id}`, 'Chọn trạng thái mới', [...STATUSES.map(status => ({ text: STATUS_LABEL[status], onPress: async () => { try { await updateOrderStatus(order.id, status); load(); } catch { Alert.alert('Lỗi', 'Không thể cập nhật trạng thái'); } } })), { text: 'Đóng', style: 'cancel' }]);
  return <SafeAreaView style={styles.page} edges={['top']}><AdminScreenHeader title="Quản lý đơn hàng" subtitle={`Tổng số: ${orders.length} đơn hàng`} />
    <FlatList data={orders} keyExtractor={o => String(o.id)} contentContainerStyle={styles.body} ListEmptyComponent={<Text style={styles.muted}>Chưa có đơn hàng nào.</Text>} renderItem={({ item }) => <View style={{ backgroundColor: '#FFF', borderRadius: 11, padding: 14, marginBottom: 12 }}><Text style={styles.itemTitle}>Đơn hàng #{item.id} · {item.username}</Text><Text style={styles.muted}>Ngày đặt: {item.createdAt}</Text><Text style={styles.muted}>Sản phẩm: {item.items.map(i => `${i.productName} x${i.quantity}`).join(', ') || 'Không có chi tiết'}</Text><Text style={{ color: '#215E40', fontWeight: 'bold', marginTop: 7 }}>Tổng tiền: {item.totalAmount.toLocaleString('vi-VN')} đ</Text><View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}><Text style={{ flex: 1, color: '#555' }}>Trạng thái: {STATUS_LABEL[item.status] || item.status}</Text><TouchableOpacity style={styles.button} onPress={() => changeStatus(item)}><Text style={styles.buttonText}>Cập nhật</Text></TouchableOpacity></View></View>} />
  </SafeAreaView>;
};
export default OrderManagementScreen;
