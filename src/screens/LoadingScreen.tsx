import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Animated texture circle component
const AnimatedCircle = ({ style, duration, delay }: any) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.15,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    setTimeout(animate, delay);
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

// Animated wave component
const AnimatedWave = ({ delay, duration }: any) => {
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const opacityAnim = React.useRef(new Animated.Value(0.6)).current;

  React.useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.8,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    setTimeout(animate, delay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.wave,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

export default function LoadingScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Welcome" as never);
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#E0F2F1", "#B2DFDB", "#80CBC4"]}
      style={styles.container}
    >
      {/* Texture circles - matching Dashboard style */}
      <AnimatedCircle 
        style={[styles.textureCircle, styles.textureCircle1]} 
        duration={3000}
        delay={0}
      />
      
      <AnimatedCircle 
        style={[styles.textureCircle, styles.textureCircle2]} 
        duration={3500}
        delay={200}
      />
      
      <AnimatedCircle 
        style={[styles.textureCircle, styles.textureCircle3]} 
        duration={4000}
        delay={400}
      />

      <AnimatedCircle 
        style={[styles.textureCircle, styles.textureCircle4]} 
        duration={3200}
        delay={600}
      />

      {/* ⚡ Teal Pulse Waves */}
      <AnimatedWave delay={0} duration={1500} />
      <AnimatedWave delay={400} duration={1900} />

      {/* ⚙️ Center Text */}
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(31, 182, 186, 0.2)",
  },
  textureCircle: {
    position: "absolute",
    borderRadius: 1000,
  },
  textureCircle1: {
    top: height * 0.15,
    right: -60,
    width: 140,
    height: 140,
    backgroundColor: "#B2F5EA",
  },
  textureCircle2: {
    top: height * 0.4,
    left: -40,
    width: 100,
    height: 100,
    backgroundColor: "#CCFBF1",
  },
  textureCircle3: {
    bottom: height * 0.25,
    right: -30,
    width: 120,
    height: 120,
    backgroundColor: "#A7F3D0",
  },
  textureCircle4: {
    bottom: height * 0.15,
    left: -50,
    width: 110,
    height: 110,
    backgroundColor: "#B2F5EA",
  },
  text: {
    position: "absolute",
    bottom: height * 0.25,
    fontSize: 12,
    lineHeight: 20,
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 20,
    textShadowColor: "rgba(14, 94, 95, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});