import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { Card, Image } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const logOut = async () => {
    await AsyncStorage.removeItem("shoppingCart");
    await AsyncStorage.removeItem("authenticated");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("clientId");
    setCartCount(0);
    navigation.navigate("Login");
  };

  const handleAddShoppingCart = async (product) => {
    const currentCartString = await AsyncStorage.getItem("shoppingCart");
    let currentCart = currentCartString ? JSON.parse(currentCartString) : [];
    currentCart.push(product);
    await AsyncStorage.setItem("shoppingCart", JSON.stringify(currentCart));
    setCartCount((prevCount) => {
      return prevCount + 1;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const authenticated =
        (await AsyncStorage.getItem("authenticated")) === "true";

      if (!authenticated) {
        navigation.navigate("Login");
      }

      try {
        const response = await fetch("http://localhost:3002/product/app", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: await AsyncStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 16 }}
          onPress={async () => {
            logOut();
          }}
        >
          <Icon name="exit-to-app" size={24} color="black" />
        </TouchableOpacity>
      ),
      title: "Productos",
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate("Cart", { updateCartCount })}
        >
          <View>
            <Icon name="shopping-cart" size={24} color="black" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ),
    });
  }, [cartCount, navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity>
              <Card containerStyle={styles.card}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>Price: ${item.price}</Text>
              </Card>
            </TouchableOpacity>
            <Button
              title="Agregar al carrito"
              onPress={async () => await handleAddShoppingCart(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  card: {
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProductsScreen;

ProductsScreen.navigationOptions = ({ navigation }) => ({
  headerRight: () => (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={() => navigation.navigate("Cart", { updateCartCount })}
    >
      <View>
        <Icon name="shopping-cart" size={24} color="black" />
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ),
  title: "Productos",
});
