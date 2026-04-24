import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const GradientBackground = ({ children }: { children: React.ReactNode }) => (
  <LinearGradient
    colors={["#E0F2F1", "#B2DFDB", "#80CBC4"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.gradient}
  >
    {children}
  </LinearGradient>
);

export default GradientBackground;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});