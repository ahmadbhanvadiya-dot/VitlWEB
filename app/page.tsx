import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function QRInstructionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Soft glow background circle effect */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.card}>
        <Text style={styles.brand}>Vitl</Text>

        <Text style={styles.title}>
          Scan the QR code to continue
        </Text>

        <Text style={styles.subtitle}>
          Secure your health profile in seconds.
          {"\n"}
          Your journey to smarter care starts here.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.footer}>
          ⚕️ Powered by Vitl Health System
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF7EE", // soft bamboo green
    justifyContent: "center",
    alignItems: "center",
  },

  glowTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#B7E4C7",
    opacity: 0.4,
  },

  glowBottom: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#95D5B2",
    opacity: 0.3,
  },

  card: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  brand: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2D6A4F", // deep bamboo green
    marginBottom: 10,
    letterSpacing: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1B4332",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#40916C",
    textAlign: "center",
    lineHeight: 20,
  },

  divider: {
    width: "60%",
    height: 1,
    backgroundColor: "#D8F3DC",
    marginVertical: 20,
  },

  footer: {
    fontSize: 12,
    color: "#74C69D",
  },
});