import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState(null);

  console.log("MyOrders", orders);
  useEffect(() => {
    const fetchData = async () => {
      const authenticated =
        (await AsyncStorage.getItem("authenticated")) === "true";

      if (!authenticated) {
        navigation.navigate("Login");
      }
      const clientId = await AsyncStorage.getItem("clientId");
      try {
        const response = await fetch(
          `http://localhost:3002/order/client/${clientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: await AsyncStorage.getItem("token"),
            },
          }
        );
        const { data } = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3002");
    socket.on("order-updated", (updatedOrder) => {
      if (updatedOrder.source === "app") {
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order.orderId === updatedOrder.orderId
              ? { ...order, status: updatedOrder.status }
              : order
          );
          return updatedOrders;
        });
      }
      return;
    });
  }, []);

  const handleFilter = (status) => {
    if (filter === status) {
      setFilter(null);
    } else {
      setFilter(status);
    }
  };

  const filteredOrders = filter
    ? orders.filter((order) => order.status === filter)
    : orders;

  console.log("filteredOrders", filteredOrders);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.filterText}>Filtros</Text>
        <FontAwesome name="filter" size={20} color="black" />
      </View>
      <View style={styles.filterTags}>
        <TouchableOpacity
          onPress={() => handleFilter("CONFIRMED")}
          style={[
            styles.filterTag,
            filter === "CONFIRMED" && styles.selectedFilter,
          ]}
        >
          <Text
            style={[
              styles.filterTagText,
              filter === "CONFIRMED" && styles.selectedFilterText,
            ]}
          >
            Confirmado
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleFilter("CANCELLED")}
          style={[
            styles.filterTag,
            filter === "CANCELLED" && styles.selectedFilter,
          ]}
        >
          <Text
            style={[
              styles.filterTagText,
              filter === "CANCELLED" && styles.selectedFilterText,
            ]}
          >
            Cancelado
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredOrders}
        // keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </ScrollView>
  );
}

const OrderCard = ({ order }) => {
  const [statusColor, setStatusColor] = useState("black");

  useEffect(() => {
    switch (order.status) {
      case "CANCELLED":
        setStatusColor("red");
        break;
      case "PENDING":
        setStatusColor("yellow");
        break;
      case "CONFIRMED":
        setStatusColor("green");
        break;
      case "PROCESSING":
        setStatusColor("blue");
        break;
      default:
        setStatusColor("black");
        break;
    }
  }, [order.status]);

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.statusText}>
          Status:
          <Text style={{ color: statusColor, fontWeight: "bold" }}>
            {" "}
            {order.status}
          </Text>
        </Text>
      </View>
      <Text style={styles.date}>
        Fecha: {order.date}
        {order.status === "PROCESSING" &&
          ` - Tiempo Estimado de Entrega: ${order.deliveryTime} min`}
      </Text>
      <Text>Total: ${order.amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterTags: {
    flexDirection: "row",
    marginBottom: 10,
  },
  filterTag: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "white",
  },
  selectedFilter: {
    backgroundColor: "blue",
  },
  filterTagText: {
    color: "blue",
  },
  selectedFilterText: {
    color: "white",
  },
  card: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  statusContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
  },
});

export default MyOrders;
