import React, { useState } from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import MenuBar from "../components/MenuBar";
import GradientBackground from "../components/GradientBackground";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const WeatherScreen = () => {
  const [activeTab, setActiveTab] = useState("Weather");

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safearea}>
        {/* Main Content */}
        <View style={styles.content}>
          {/* Header */}
          <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>

            <View style={styles.textureCircle1} />
            <View style={styles.textureCircle2} />
            <View style={styles.textureCircle3} />
            <View style={styles.textureCircle4} />
            <View style={styles.textureCircle5} />
            <View style={styles.textureCircle6} />
            <View style={styles.textureCircle7} />
                        
            <Ionicons name="cloud-outline" size={width * 0.09} color="#14b8a6" />
            <Text style={styles.title}>Weather & Sun Insights</Text>
          </Animatable.View>

          <Image source={require("../../assets/weather.png")}
                                style={styles.headerImage}
                                />

          {/* Weather Info Card */}
          <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="thermometer-outline" size={width * 0.06} color="#14b8a6" />
              <Text style={styles.infoText}>Temperature: 32°C</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="partly-sunny-outline" size={width * 0.06} color="#14b8a6" />
              <Text style={styles.infoText}>Condition: Partly Cloudy</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="water-outline" size={width * 0.06} color="#14b8a6" />
              <Text style={styles.infoText}>Humidity: 65%</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="time-outline" size={width * 0.06} color="#14b8a6" />
              <Text style={styles.infoText}>Sunrise: 6:15 AM | Sunset: 6:45 PM</Text>
            </View>
          </Animatable.View>
        </View>

        {/* ✅ Bottom Menu Bar (Fixed, same structure as PredictScreen) */}
        <MenuBar active={activeTab} onChange={setActiveTab} />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default WeatherScreen;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#ECFDF5"
  },
  content: {
    alignItems: "center",
    marginTop: height * 0.05, // Adds breathing room below the status bar
  },
  header: {
    alignItems: "center",
    marginBottom: height * 0.03, // Adds space between title and card
  },
  headerImage: {
  width: 300,
  height: 300,
  resizeMode: "contain",
  marginBottom: -1,
},
  title: {
    color: "#14b8a6",
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginTop: height * 0.01,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderRadius: 20,
    width: width * 0.88,
    padding: width * 0.05,
    borderWidth: 1,
    borderColor: "#14b8a655",
    shadowColor: "#14b8a6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    color: "#e2e8f0",
    fontSize: width * 0.04,
    marginLeft: width * 0.03,
  },
  menuWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },

  // Background circles
  textureCircle1: {
    position: "absolute",
    top: 80,
    right: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#B2F5EA",
    opacity: 0.45,
  },
  textureCircle2: {
    position: "absolute",
    top: 280,
    left: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#CCFBF1",
    opacity: 0.5,
  },
  textureCircle3: {
    position: "absolute",
    bottom: 180,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#A7F3D0",
    opacity: 0.5,
  },
  textureCircle4: {
    position: "absolute",
    top: 180,
    left: 15,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#99F6E4",
    opacity: 0.45,
  },
  textureCircle5: {
    position: "absolute",
    bottom: 320,
    right: 25,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#CCFBF1",
    opacity: 0.5,
  },
  textureCircle6: {
    position: "absolute",
    top: 450,
    right: -35,
    width: 115,
    height: 115,
    borderRadius: 57.5,
    backgroundColor: "#B2F5EA",
    opacity: 0.45,
  },
  textureCircle7: {
    position: "absolute",
    bottom: 100,
    left: -50,
    width: 135,
    height: 135,
    borderRadius: 67.5,
    backgroundColor: "#A7F3D0",
    opacity: 0.5,
  },
});
