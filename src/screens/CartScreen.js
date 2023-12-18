import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import Notification from "../components/Notification";
import Toast from "react-native-toast-message";

function CartScreen({ navigation, route }) {
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const updateCartCount = route.params?.updateCartCount || (() => {});

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartItemsString = await AsyncStorage.getItem("shoppingCart");
        const cartItemsArray = cartItemsString
          ? JSON.parse(cartItemsString)
          : [];
        setCartItems(cartItemsArray);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const closeNotification = () => {
    setShowNotification(false);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const createOrder = async () => {
    if (cartItems.length === 0) return;
    const products = buildParamsOrder(cartItems);
    const clientId = await AsyncStorage.getItem("clientId");
    try {
      await fetch("http://localhost:3002/order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: await AsyncStorage.getItem("token"),
        },
        body: JSON.stringify({
          products,
          clientId,
        }),
      });
      setShowNotification(true);
      setTimeout(async () => {
        await handleEmptyCart();
        navigation.navigate("Products");
      }, 3000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrio un error al crear el pedido 👋",
      });
    }
  };

  const handleEmptyCart = async () => {
    await AsyncStorage.removeItem("shoppingCart");
    setCartItems([]);
    updateCartCount(0);
  };

  const buildParamsOrder = (cartItems) => {
    const products = {};

    cartItems.forEach((item) => {
      const { productId } = item;

      products[productId] = products[productId] || {
        productId,
        quantity: 0,
        discount: 0,
      };

      products[productId].quantity += 1;
    });

    const result = Object.values(products);
    return result;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Resumen del Pedido</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleEmptyCart}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${getTotalPrice()}</Text>
      <Button title="Realizar Pedido" onPress={createOrder} />
      {showNotification && (
        <Notification
          isVisible={showNotification}
          message="Pedido creado con éxito!"
          onClose={closeNotification}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default CartScreen;
