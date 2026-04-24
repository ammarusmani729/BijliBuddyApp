import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Ionicons, MaterialCommunityIcons, FontAwesome5  } from "@expo/vector-icons";
import GradientBackground from "../components/GradientBackground";
import MenuBar from "../components/MenuBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const { userData } = useUser();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animatable.View
            animation="fadeInDown"
            duration={800}
            style={styles.header}
          >

            <View style={styles.textureCircle1} />
            <View style={styles.textureCircle2} />
            <View style={styles.textureCircle3} />
            <View style={styles.textureCircle4} />
            <View style={styles.textureCircle5} />
            <View style={styles.textureCircle6} />
            <View style={styles.textureCircle7} />

            <Ionicons name="person-circle-outline" size={42} color="#00E0B8" />
            <Text style={styles.title}>User Profile</Text>
          </Animatable.View>

          {/* Profile Card */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
            {/* Profile Picture */}
            <View style={styles.avatarContainer}>
              <Image source={require("../../assets/profile.png")}
                style={styles.avatar}
              />
            </View>

            {/* User Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{userData?.name}</Text>
              <Text style={styles.email}>{userData?.email}</Text>
            </View>

          {/* Account Details */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#00E0B8" />
              <Text style={styles.detailText}>{userData?.location}</Text>
            </View>
          </View>


          </Animatable.View>
        </ScrollView>

        <MenuBar active={activeTab} onChange={setActiveTab} />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1,
    backgroundColor: "#ECFDF5"
   },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: height * 0.08,
    paddingBottom: height * 0.05,
  },
  header: {
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  title: {
    color: "#0E5E5F",
    fontSize: width * 0.06,
    fontWeight: "700",
    marginTop: 6,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderRadius: 20,
    width: width * 0.88,
    padding: width * 0.06,
    borderWidth: 1,
    borderColor: "#14b8a655",
    shadowColor: "#14b8a6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#00E0B8",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    color: "#00E0B8",
    fontSize: width * 0.055,
    fontWeight: "700",
  },
  email: {
    color: "#e2e8f0",
    fontSize: width * 0.04,
    marginTop: 4,
  },
  details: {
    width: "100%",
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  detailText: {
    color: "#fff",
    fontSize: width * 0.04,
    marginLeft: 10,
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
