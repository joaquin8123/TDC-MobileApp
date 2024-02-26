import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("test");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || "test",
          password: password || "test",
          type: "client",
        }),
      });

      if (response.ok) {
        const { data, code } = await response.json();
        if (code === 200) {
          await AsyncStorage.removeItem("shoppingCart");
          await AsyncStorage.setItem("authenticated", true);
          await AsyncStorage.setItem("token", data.token);
          await AsyncStorage.setItem("clientId", data.clientId);
          navigation.navigate("Products");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "usuario y/o contraseña invalida 👋",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrio un error en el login",
      });
    }
  };
  const register = async () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={handleLogin} />
        <View style={{ marginRight: 10 }} />
        <Button title="Registrarse" onPress={register} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});

export default LoginScreen;
