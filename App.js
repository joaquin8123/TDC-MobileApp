import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import ProductsScreen from "./src/screens/ProductScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import Toast from "react-native-toast-message";
import RegisterScreen from "./src/screens/RegisterScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default App;
