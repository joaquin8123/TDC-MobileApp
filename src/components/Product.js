import React from 'react';
import { View, Text, Button } from 'react-native';

function Product({ name, price, description, onAddToCart }) {
  return (
    <View>
      <Text>{name}</Text>
      <Text>Price: ${price}</Text>
      <Text>Description: {description}</Text>
      <Button title="Add to Cart" onPress={onAddToCart} />
    </View>
  );
}

export default Product;
