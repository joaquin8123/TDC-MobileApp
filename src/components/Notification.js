import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

const Notification = ({ isVisible, message, onClose }) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
    >
      <View style={styles.modalContainer}>
        <View style={styles.notification}>
          <Text style={styles.message}>{message}</Text>
          {/* <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Cerrar</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};
export default Notification;

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notification: {
      backgroundColor: '#4CAF50',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    message: {
      color: 'white',
      fontSize: 16,
      marginBottom: 10,
    },
    closeButton: {
      color: 'white',
      fontSize: 14,
      textDecorationLine: 'underline',
    },
  });
  
