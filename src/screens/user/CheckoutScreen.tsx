
import React, { useState, useCallback } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../contexts/AuthContext';

import { getCart } from '../../services/cartService';
import { checkout } from '../../services/orderService';

import type { CartItem } from '../../repositories/cartRepository';
import type { CartStackParamList } from '../../navigation/UserNavigator';

const CheckoutScreen = () => {
    const { user } = useAuth();

    const navigation =
        useNavigation<NativeStackNavigationProp<CartStackParamList>>();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Tải lại giỏ hàng khi mở màn hình thanh toán
    const loadCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const data = await getCart(user.id);

            setCartItems(data);
        } catch (error) {
            console.error('Lỗi tải thông tin thanh toán:', error);
            Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [loadCart]),
    );

    // Tính tổng tiền
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    // Xác nhận đặt hàng
    const handlePlaceOrder = () => {
        if (!user) {
            Alert.alert('Thông báo', 'Vui lòng đăng nhập để đặt hàng.');
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert('Thông báo', 'Giỏ hàng đang trống.');
            return;
        }

        Alert.alert(
            'Xác nhận đặt hàng',
            `Bạn có chắc chắn muốn đặt đơn hàng trị giá ${totalPrice.toLocaleString('vi-VN')} đ không?`,
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Đặt hàng',
                    onPress: async () => {
                        try {
                            setProcessing(true);

                            const result = await checkout(user.id);

                            Alert.alert(
                                'Đặt hàng thành công',
                                `Mã đơn hàng: ${result.orderId}\nTổng tiền: ${result.totalAmount.toLocaleString('vi-VN')} đ`,
                                [
                                    {
                                        text: 'Đồng ý',
                                        onPress: () => navigation.navigate('Cart'),
                                    },
                                ],
                            );
                        } catch (error) {
                            console.error('Lỗi đặt hàng:', error);

                            const message =
                                error instanceof Error
                                    ? error.message
                                    : 'Không thể tạo đơn hàng. Vui lòng thử lại.';

                            Alert.alert('Đặt hàng thất bại', message);
                        } finally {
                            setProcessing(false);
                        }
                    },
                },
            ],
        );
    };

    // Đang tải dữ liệu
    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#287A50" />
                    <Text style={styles.loadingText}>
                        Đang tải thông tin đơn hàng...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>‹ Quay lại</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Thanh toán</Text>
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>
                        Không có sản phẩm để thanh toán.
                    </Text>

                    <TouchableOpacity
                        style={styles.backToCartButton}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Text style={styles.buttonText}>
                            Quay lại giỏ hàng
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <View style={styles.productItem}>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>
                                        {item.name}
                                    </Text>

                                    <Text style={styles.productQuantity}>
                                        Số lượng: {item.quantity}
                                    </Text>
                                </View>

                                <Text style={styles.productPrice}>
                                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                </Text>
                            </View>
                        )}
                    />

                    {/* Tổng tiền */}
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>
                            Thông tin đơn hàng
                        </Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Người đặt hàng
                            </Text>

                            <Text style={styles.summaryValue}>
                                {user?.username}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Số sản phẩm
                            </Text>

                            <Text style={styles.summaryValue}>
                                {cartItems.reduce(
                                    (total, item) => total + item.quantity,
                                    0,
                                )}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>
                                Tổng thanh toán
                            </Text>

                            <Text style={styles.totalPrice}>
                                {totalPrice.toLocaleString('vi-VN')} đ
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.checkoutButton,
                                processing && styles.disabledButton,
                            ]}
                            disabled={processing}
                            onPress={handlePlaceOrder}
                        >
                            {processing ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Xác nhận đặt hàng
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8F6',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        marginBottom: 10,
    },
    backText: {
        fontSize: 16,
        color: '#287A50',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#222222',
    },
    listContent: {
        padding: 16,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    productInfo: {
        flex: 1,
        marginRight: 10,
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222222',
    },
    productQuantity: {
        marginTop: 6,
        fontSize: 13,
        color: '#777777',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#287A50',
    },
    summaryContainer: {
        padding: 18,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#222222',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666666',
    },
    summaryValue: {
        fontSize: 14,
        color: '#222222',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222222',
    },
    totalPrice: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#287A50',
    },
    checkoutButton: {
        marginTop: 12,
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#287A50',
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: '#666666',
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 15,
    },
    backToCartButton: {
        backgroundColor: '#287A50',
        padding: 13,
        borderRadius: 8,
    },
});

export default CheckoutScreen;
