import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';

function ShoppingCart({ cartItems, onPlaceOrder }) {
  const getTotalPrice = () => {
    // Implementa la lógica para calcular el precio total del carrito aquí
  };

  return (
    <View>
      <Text>Shopping Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>Price: ${item.price}</Text>
          </View>
        )}
      />
      <Text>Total: ${getTotalPrice()}</Text>
      <Button title="Place Order" onPress={onPlaceOrder} />
    </View>
  );
}

export default ShoppingCart;
