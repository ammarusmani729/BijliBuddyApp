import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handlePress = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Animatable.View animation="fadeInUp" duration={700} style={styles.brandBlock}>
          <View style={styles.logoHalo}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Bijli Buddy</Text>
          <Text style={styles.subtitle}>Smart energy, smarter bills.</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={120} duration={700} style={styles.ctaBlock}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={() => handlePress("Register")}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.loginRow}
            onPress={() => handlePress("Login")}
          >
            <Text style={styles.loginPrefix}>ALREADY HAVE AN ACCOUNT? </Text>
            <Text style={styles.loginAction}>LOG IN</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      <View style={styles.waveLayerOne} />
      <View style={styles.waveLayerTwo} />
      <View style={styles.waveLayerThree} />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F7",
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 90,
    paddingBottom: 150,
    justifyContent: "space-between",
  },
  brandBlock: {
    alignItems: "center",
  },
  logoHalo: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "rgba(5, 150, 140, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    color: "#0C716D",
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "#7C8A88",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  ctaBlock: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#06716A",
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#045B56",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  loginRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  loginPrefix: {
    color: "#0A736E",
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: "600",
  },
  loginAction: {
    color: "#0A736E",
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  waveLayerOne: {
    position: "absolute",
    left: -30,
    right: -10,
    bottom: -42,
    height: 120,
    backgroundColor: "rgba(119, 197, 191, 0.45)",
    borderTopLeftRadius: 130,
    borderTopRightRadius: 190,
  },
  waveLayerTwo: {
    position: "absolute",
    left: -40,
    right: 30,
    bottom: -30,
    height: 95,
    backgroundColor: "rgba(150, 213, 208, 0.58)",
    borderTopLeftRadius: 160,
    borderTopRightRadius: 150,
  },
  waveLayerThree: {
    position: "absolute",
    left: 10,
    right: -45,
    bottom: -52,
    height: 140,
    backgroundColor: "rgba(95, 174, 170, 0.52)",
    borderTopLeftRadius: 190,
    borderTopRightRadius: 125,
  },
});