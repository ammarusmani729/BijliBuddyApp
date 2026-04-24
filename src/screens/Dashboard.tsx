import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import MenuBar from "../components/MenuBar";
import { useUser } from "../context/UserContext";

const Dashboard = ({ navigation }: any) => {
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const userName = userData?.name?.split(" ")[0] || "Ahmed";
  const monthlyUnits = 284;
  const estimatedBill = 4240;
  const dailyAvg = 9.2;
  const peakWindow = "6pm - 10pm";
  const slabProgress = 0.568;

  const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyHeights = [42, 46, 52, 48, 58, 61, 56, 63, 59, 66, 62, 68];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <Image
                source={require("../../assets/Bijli-Buddy-Logo.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.topActions}>
              <TouchableOpacity activeOpacity={0.8} style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={24} color="#9AA6AD" />
              </TouchableOpacity>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
          </View>

          {/* <View style={styles.welcomeCard}>
            <Text style={styles.welcomeLabel}>WELCOME BACK</Text>
            <Text style={styles.welcomeTitle}>Good morning, {userName}</Text>
          </View> */}

          <View style={styles.tipCard}>
            <View style={styles.tipTopRow}>
              <Ionicons name="sparkles" size={16} color="#B8F3EA" />
              <Text style={styles.tipLabel}>AI SAVINGS TIP</Text>
            </View>
            <Text style={styles.tipTitle}>High AC Usage Detected</Text>
            <Text style={styles.tipBody}>
              Setting your AC to 24°C instead of 18°C can save you up to ₹850 this month.
            </Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.tipButton}>
              <Text style={styles.tipButtonText}>Apply Mode</Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="air-conditioner"
              size={120}
              color="rgba(255,255,255,0.08)"
              style={styles.tipWatermark}
            />
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>LAST MONTH UNITS</Text>
              <Ionicons name="flash-outline" size={20} color="#0B7A73" />
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>284</Text>
              <Text style={styles.statUnit}>kWh</Text>
            </View>
            {/* <View style={styles.trendRow}>
              <Ionicons name="trending-up" size={14} color="#D14A3A" />
              <Text style={styles.trendText}>12% from last month</Text>
            </View> */}
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>LAST MONTH BILL</Text>
              <MaterialCommunityIcons name="cash-multiple" size={20} color="#A36A00" />
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billValue}>₹4,240</Text>
            </View>
            {/* <View style={styles.dueRow}>
              <Ionicons name="information-circle-outline" size={14} color="#0B7A73" />
              <Text style={styles.dueText}>Due in 14 days</Text>
            </View> */}
          </View>
{/* 
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>DAILY AVG</Text>
              <Feather name="activity" size={20} color="#2A2F74" />
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{dailyAvg}</Text>
              <Text style={styles.statUnit}>kWh</Text>
            </View>
            <View style={styles.peakRow}>
              <Ionicons name="location-outline" size={14} color="#B77700" />
              <Text style={styles.peakText}>Peak: {peakWindow}</Text>
            </View>
          </View> */}

          
          <View style={styles.slabCard}>
            <View style={styles.slabHeaderRow}>
              <Text style={styles.sectionTitle}>Tariff Slab Tracker</Text>
              <View style={styles.slabBadge}>
                <Text style={styles.slabBadgeText}>Slab 2 Active</Text>
              </View>
            </View>

            <View style={styles.slabScaleRow}>
              <Text style={styles.scaleText}>0 kWh</Text>
              <Text style={styles.scaleTextActive}>284 kWh</Text>
              <Text style={styles.scaleText}>500 kWh</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${slabProgress * 100}%` }]} />
            </View>

            <Text style={styles.slabNote}>
              Next slab (+₹2.50/unit) starts at 300 kWh. You're close!
            </Text>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Monthly Consumption</Text>
            <View style={styles.chartArea}>
              <View style={styles.chartGridLine} />
              <View style={styles.chartBarsRow}>
                {monthlyHeights.map((heightValue, index) => (
                  <View key={monthlyLabels[index]} style={styles.dayColumn}>
                    <View style={[styles.bar, { height: heightValue }]} />
                  </View>
                ))}
              </View>
              <View style={styles.weekLabelRow}>
                {monthlyLabels.map((label) => (
                  <Text key={label} style={[styles.weekLabel, label === "Apr" && styles.weekLabelActive]}>
                    {label}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.dualCardRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>LOCAL WEATHER</Text>
              <View style={styles.miniValueRow}>
                <Ionicons name="sunny-outline" size={20} color="#D49000" />
                <Text style={styles.miniValue}>34°C</Text>
              </View>
              <Text style={styles.miniNote}>High Temp: Use ECO mode</Text>
            </View>

            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>GOAL TRACKER</Text>
              <View style={styles.miniValueRow}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#0B7A73" />
                <Text style={styles.miniValue}>82%</Text>
              </View>
              <Text style={styles.miniNote}>On track for 15% saving</Text>
            </View>
          </View>
        </ScrollView>

        <MenuBar active={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandLogo: {
    width: 120,
    height: 40,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#0D0F10",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  welcomeCard: {
    backgroundColor: "#0F9A90",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,
  },
  welcomeLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    width: "78%",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#E2E9E7",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statLabel: {
    color: "#697974",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 18,
  },
  statValue: {
    color: "#111111",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  statUnit: {
    color: "#596866",
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 3,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  trendText: {
    color: "#D14A3A",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  billRow: {
    marginTop: 18,
  },
  billValue: {
    color: "#111111",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  dueText: {
    color: "#0F766E",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  peakRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  peakText: {
    color: "#B77700",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  slabCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#E2E9E7",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  slabHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 19,
    fontWeight: "800",
  },
  slabBadge: {
    backgroundColor: "#F4E3C3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  slabBadgeText: {
    color: "#A26400",
    fontSize: 11,
    fontWeight: "800",
  },
  slabScaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scaleText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "700",
  },
  scaleTextActive: {
    color: "#0F766E",
    fontSize: 12,
    fontWeight: "800",
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "#DDE3E1",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0F8B82",
    borderRadius: 999,
  },
  slabNote: {
    marginTop: 12,
    color: "#5F6F6B",
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E9E7",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  chartArea: {
    marginTop: 18,
    height: 200,
    justifyContent: "flex-end",
  },
  chartGridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 70,
    height: 1,
    backgroundColor: "#F0F3F2",
  },
  chartBarsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    paddingHorizontal: 4,
  },
  dayColumn: {
    width: 20,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: 10,
    borderRadius: 999,
    backgroundColor: "#0E857E",
  },
  weekLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  weekLabel: {
    color: "#667573",
    fontSize: 11,
  },
  weekLabelActive: {
    color: "#111111",
    fontWeight: "800",
  },
  tipCard: {
    backgroundColor: "#0E857E",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  tipTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipLabel: {
    color: "#A8F0E7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginLeft: 8,
  },
  tipTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    marginBottom: 10,
    width: "78%",
  },
  tipBody: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    lineHeight: 22,
    width: "72%",
    fontWeight: "500",
    marginBottom: 18,
  },
  tipButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.24)",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  tipButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  tipWatermark: {
    position: "absolute",
    right: -6,
    bottom: -18,
  },
  dualCardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  miniCard: {
    flex: 1,
    minHeight: 132,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E9E7",
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  miniLabel: {
    color: "#6D7B79",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 18,
  },
  miniValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniValue: {
    color: "#111111",
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "800",
    marginLeft: 8,
  },
  miniNote: {
    color: "#5E6E6B",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    width: "92%",
  },
});
