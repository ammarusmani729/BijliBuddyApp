import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

export default function InfoScreen() {
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate("Welcome" as never);
  };

  return (
    <LinearGradient
      colors={["#E0F2F1", "#B2DFDB", "#80CBC4"]}
      style={styles.container}
    >
      {/* Background texture circles */}
      <View style={styles.textureCircle1} />
      <View style={styles.textureCircle2} />
      <View style={styles.textureCircle3} />
      <View style={styles.textureCircle4} />
      <View style={styles.textureCircle5} />
      <View style={styles.textureCircle6} />
      <View style={styles.textureCircle7} />

      {/* Animated Electrician Character */}
      <Animatable.Image
        source={require("../../assets/Bijli Buddy Icon.png")}
        animation="fadeIn"
        duration={800}
        style={styles.character}
        resizeMode="contain"
      />

      {/* Text Section */}
      <Animatable.View
        animation="fadeIn"
        delay={300}
        duration={600}
        style={styles.textContainer}
      >
        <Text style={styles.title}>Smart Energy, Simplified</Text>
        <Text style={styles.subtitle}>
          Monitor your usage, save electricity, and optimize your power like never before.
        </Text>
      </Animatable.View>

      {/* Continue Button */}
      <Animatable.View animation="fadeIn" delay={500} duration={600}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <LinearGradient
            colors={["#1EB6BA", "#24D1B2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  character: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 24,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    maxWidth: 340,
    width: "90%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0E5E5F",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    borderRadius: 12,
    shadowColor: "#1EB6BA",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  // Background texture elements
  textureCircle1: {
    position: "absolute",
    top: height * 0.08,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#B2F5EA",
    opacity: 0.4,
  },
  textureCircle2: {
    position: "absolute",
    top: height * 0.3,
    left: -40,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#CCFBF1",
    opacity: 0.5,
  },
  textureCircle3: {
    position: "absolute",
    bottom: height * 0.15,
    right: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#A7F3D0",
    opacity: 0.4,
  },
  textureCircle4: {
    position: "absolute",
    top: height * 0.18,
    left: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#99F6E4",
    opacity: 0.3,
  },
  textureCircle5: {
    position: "absolute",
    bottom: height * 0.35,
    right: 20,
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#CCFBF1",
    opacity: 0.35,
  },
  textureCircle6: {
    position: "absolute",
    top: height * 0.45,
    right: -25,
    width: 95,
    height: 95,
    borderRadius: 47.5,
    backgroundColor: "#B2F5EA",
    opacity: 0.3,
  },
  textureCircle7: {
    position: "absolute",
    bottom: height * 0.08,
    left: -35,
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: "#A7F3D0",
    opacity: 0.45,
  },
});