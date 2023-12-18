import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async () => {
    if (username.length < 6 || password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "El usuario y la contraseña deben tener al menos 6 caracteres 👋",
      });
      return;
    }
    if (
      username.length === 0 ||
      password.length === 0 ||
      name.length === 0 ||
      address.length === 0 ||
      phone.length === 0
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "Todos los campos son requeridos 👋",
      });
      return;
    }
    try {
      const response = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          name,
          address,
          phone,
          type: "client",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.code === 201) {
          localStorage.setItem("authenticated", true);
          Toast.show({
            type: "success",
            text1: "Exito",
            text2: "Registro exitoso 👋",
          });
          setTimeout(() => {
            navigation.navigate("Login");
          }, 3000);
        }
      } else {
        const data = await response.json();
        if (data.code === 401) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "El username ya existe 👋",
          });
          return;
        }
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "error al registrarse 👋",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrio un error en el registro",
      });
    }
  };

  const login = async () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Direccion"
        onChangeText={(text) => setAddress(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefono"
        onChangeText={(text) => setPhone(text)}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Button title="Volver" onPress={login} />
        <View style={{ marginRight: 10 }} />
        <Button title="Registrarse" onPress={handleRegister} />
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

export default RegisterScreen;
