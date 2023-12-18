import React from 'react';
import { View, Text, Button } from 'react-native';

function ProductDetailsScreen({ route }) {
  const { product } = route.params;

  return (
    <View>
      <Text>Name: {product.name}</Text>
      <Text>Price: ${product.price}</Text>
      <Text>Description: {product.description}</Text>
      <Button title="Add to Cart" onPress={() => {/* Agrega el producto al carrito */}} />
    </View>
  );
}

export default ProductDetailsScreen;
