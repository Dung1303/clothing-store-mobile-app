
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import type { Product } from '../types/product';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(product)}
    >
      <Image
        source={{ uri: product.img }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          {product.price.toLocaleString('vi-VN')} đ
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#EEEEEE',
  },

  info: {
    padding: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    minHeight: 40,
  },

  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 8,
  },
});

export default ProductCard;
