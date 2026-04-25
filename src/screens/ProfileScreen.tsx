import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MenuBar from "../components/MenuBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const { userData } = useUser();
  const navigation = useNavigation();

  const userName = userData?.name || "User";
  const userEmail = userData?.email || "—";
  const userLocation = userData?.location || "—";
  const applianceCount = userData?.appliances ? Object.keys(userData.appliances).length : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <Image
                source={require("../../assets/Bijli-Buddy-Logo.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Avatar + Name */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrap}>
              <Image
                source={require("../../assets/profile.png")}
                style={styles.avatarImage}
              />
            </View>
            <Text style={styles.userName}>{userName}</Text>
          </View>

          {/* Account Details */}
          <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
          <View style={styles.menuCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons name="person-outline" size={20} color="#0B7A73" />
                <Text style={styles.infoLabel}>Name</Text>
              </View>
              <Text style={styles.infoValue}>{userName}</Text>
            </View>

            <View style={styles.menuDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons name="mail-outline" size={20} color="#0B7A73" />
                <Text style={styles.infoLabel}>Email</Text>
              </View>
              <Text style={styles.infoValue}>{userEmail}</Text>
            </View>

            <View style={styles.menuDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons name="location-outline" size={20} color="#0B7A73" />
                <Text style={styles.infoLabel}>Location</Text>
              </View>
              <Text style={styles.infoValue}>{userLocation}</Text>
            </View>

            <View style={styles.menuDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <MaterialCommunityIcons name="lightning-bolt-outline" size={20} color="#0B7A73" />
                <Text style={styles.infoLabel}>Appliances</Text>
              </View>
              <Text style={styles.infoValue}>{applianceCount}</Text>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Login" as never)}
          >
            <Ionicons name="log-out-outline" size={20} color="#C43D34" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        <MenuBar active={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EAF1EF",
  },
  screen: {
    flex: 1,
    backgroundColor: "#EDF4F1",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },

  /* Top Bar */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandLogo: {
    width: 120,
    height: 40,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Profile Header */
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 14,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#0B7A73",
  },
  userName: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "800",
  },

  /* Section Label */
  sectionLabel: {
    color: "#6E7C7A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },

  /* Menu Card */
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E9E7",
    marginBottom: 24,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoLabel: {
    color: "#697974",
    fontSize: 14,
    fontWeight: "600",
  },
  infoValue: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    maxWidth: "50%",
    textAlign: "right",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#EEF2F1",
    marginHorizontal: 16,
  },

  /* Logout */
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingVertical: 14,
    marginBottom: 8,
  },
  logoutText: {
    color: "#C43D34",
    fontSize: 15,
    fontWeight: "700",
  },
});
