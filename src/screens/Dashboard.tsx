import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import MenuBar from "../components/MenuBar";
import { useUser } from "../context/UserContext";
import { useIsFocused } from "@react-navigation/native";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getWeatherAndAiAdvice } from "../services/AIAdviceService";
import { ActivityIndicator } from "react-native";

type BillSnapshot = {
  id: string;
  createdAt: number;
  billingPeriod: string;
  totalDue: string;
  consumption: string;
  tariff: string;
  peakHours: string;
  totalUnits: string;
  previousMonthUnits: string;
};

type SlabTracker = {
  badgeText: string;
  progress: number;
  leftLabel: string;
  centerLabel: string;
  rightLabel: string;
  note: string;
};

const RESIDENTIAL_A1_SLABS = [
  { label: "1-100", min: 1, max: 100 },
  { label: "101-200", min: 101, max: 200 },
  { label: "201-300", min: 201, max: 300 },
  { label: "301-400", min: 301, max: 400 },
  { label: "401-500", min: 401, max: 500 },
  { label: "501-600", min: 501, max: 600 },
  { label: "601-700", min: 601, max: 700 },
  { label: "700+", min: 701, max: null as number | null },
];

const INDUSTRIAL_B_CODES = ["B1", "B2", "B3", "B4", "B5"] as const;

const getIndustrialCode = (tariffText: string) => {
  const normalized = tariffText.toLowerCase();

  if (/\bb\s*-?\s*5\b/.test(normalized)) return "B5";
  if (/\bb\s*-?\s*4\b/.test(normalized)) return "B4";
  if (/\bb\s*-?\s*3\b/.test(normalized)) return "B3";
  if (/\bb\s*-?\s*2\b/.test(normalized)) return "B2";
  if (/\bb\s*-?\s*1\b/.test(normalized)) return "B1";

  const kvMatch = normalized.match(/(\d+(?:\.\d+)?)\s*kv/);
  const kwMatch = normalized.match(/(\d+(?:\.\d+)?)\s*kw/);

  const kvValue = kvMatch ? Number.parseFloat(kvMatch[1]) : null;
  const kwValue = kwMatch ? Number.parseFloat(kwMatch[1]) : null;

  if (kvValue !== null && kvValue >= 220) return "B5";
  if (kvValue !== null && kvValue >= 66) return "B4";
  if (kwValue !== null && kwValue < 5) return "B1";
  if (kwValue !== null && kwValue >= 5 && kwValue <= 500) return "B2";

  return null;
};

const getTariffTracker = (latestBill: BillSnapshot | null): SlabTracker => {
  if (!latestBill) {
    return {
      badgeText: "No Tariff",
      progress: 0,
      leftLabel: "-",
      centerLabel: "-",
      rightLabel: "-",
      note: "Upload your first bill to detect KE/NEPRA tariff slab.",
    };
  }

  const tariffText = latestBill.tariff || "";
  const units = parseNumericValue(latestBill.totalUnits) ?? parseNumericValue(latestBill.consumption);
  const normalized = tariffText.toLowerCase();
  const isResidentialA1 = /(residential|domestic|\ba\s*-?\s*1\b)/i.test(normalized);
  const industrialCode = getIndustrialCode(tariffText);

  if (isResidentialA1 && units !== null && units > 0) {
    const slab = RESIDENTIAL_A1_SLABS.find((item) => item.max === null ? units >= item.min : units >= item.min && units <= item.max);

    if (slab) {
      const span = slab.max !== null ? slab.max - slab.min : 100;
      const covered = slab.max !== null ? units - slab.min : span;
      const progress = slab.max !== null ? Math.max(0, Math.min(covered / Math.max(span, 1), 1)) : 1;

      return {
        badgeText: `Residential A-1 (${slab.label})`,
        progress,
        leftLabel: `${slab.min} units`,
        centerLabel: `${Math.round(units)} units`,
        rightLabel: slab.max !== null ? `${slab.max} units` : "700+ units",
        note: `Detected tariff ${tariffText}. Active residential slab: ${slab.label} units.`,
      };
    }
  }

  if (industrialCode) {
    const index = INDUSTRIAL_B_CODES.indexOf(industrialCode);
    return {
      badgeText: `Industrial ${industrialCode}`,
      progress: (index + 1) / INDUSTRIAL_B_CODES.length,
      leftLabel: "B1",
      centerLabel: industrialCode,
      rightLabel: "B5",
      note: `Matched industrial category from tariff: ${tariffText}.`,
    };
  }

  return {
    badgeText: "Tariff Unmapped",
    progress: 0,
    leftLabel: "-",
    centerLabel: units !== null ? `${Math.round(units)} units` : "-",
    rightLabel: "-",
    note: `Tariff '${tariffText}' is not recognized as Residential A-1 or Industrial B1-B5 yet.`,
  };
};

const parseNumericValue = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const matched = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return matched ? Number.parseFloat(matched[0]) : null;
};

const getBillMonthLabel = (bill: BillSnapshot) => {
  const periodText = bill.billingPeriod || "";
  const monthMatch = periodText.match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i);

  if (monthMatch) {
    const label = monthMatch[0];
    return label.charAt(0).toUpperCase() + label.slice(1, 3).toLowerCase();
  }

  return new Date(bill.createdAt).toLocaleString("en-US", { month: "short" });
};

const Dashboard = ({ navigation }: any) => {
  const { userData, setUserData } = useUser();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  const userName = userData?.name?.split(" ")[0] || "Ahmed";
  const latestBill = (userData?.latestBill as BillSnapshot | null | undefined) || null;
  const billHistory = Array.isArray(userData?.billHistory)
    ? (userData?.billHistory as BillSnapshot[])
    : [];

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isFocused || !userData?.uid) {
        return;
      }

      try {
        const userDocRef = doc(db, "users", userData.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          return;
        }

        const snapshot = userDocSnap.data();
        setUserData((previous) =>
          previous
            ? {
                ...previous,
                appliances: snapshot.appliances || {},
                latestBill: snapshot.latestBill || null,
                billHistory: Array.isArray(snapshot.billHistory) ? snapshot.billHistory : [],
              }
            : previous
        );
      } catch (error) {
        console.error("Failed to load dashboard bill data:", error);
      }
    };

    loadDashboardData();
  }, [isFocused, userData?.uid, setUserData]);

  const monthlyUnits = latestBill?.totalUnits || null;
  const estimatedBill = latestBill?.totalDue || null;
  const peakWindow = latestBill?.peakHours || null;
  const aiAdvice = userData?.aiAdvice || null;
  const weather = userData?.weather || null;

  const chartData = useMemo(() => {
    const history = billHistory.slice(-12);
    const units = history.map((entry) => parseNumericValue(entry.totalUnits) ?? parseNumericValue(entry.consumption) ?? 0);
    const maxUnits = units.length ? Math.max(...units, 1) : 1;

    return history.map((entry, index) => {
      const height = Math.max(18, Math.round((units[index] / maxUnits) * 68));
      return {
        label: getBillMonthLabel(entry),
        height,
      };
    });
  }, [billHistory]);

  const slabTracker = useMemo(() => getTariffTracker(latestBill), [latestBill]);

  const advicePreview = useMemo(() => {
    if (!aiAdvice) {
      return "";
    }

    const normalized = aiAdvice.replace(/\s+/g, " ").trim();
    return normalized.length > 180 ? `${normalized.slice(0, 180).trim()}...` : normalized;
  }, [aiAdvice]);

  const handleGetAiAdvice = async () => {
    if (!userData) {
      Alert.alert("Not available", "Please log in again to generate AI advice.");
      return;
    }

    setIsGeneratingAdvice(true);
    try {
      const result = await getWeatherAndAiAdvice({
        profileLocation: userData.location,
        appliances: userData.appliances,
        tariffSummary: latestBill?.tariff,
        unitsSummary: latestBill?.totalUnits,
      });

      setUserData((previous) =>
        previous
          ? {
              ...previous,
              weather: result.weather,
              aiAdvice: result.advice,
              aiAdviceUpdatedAt: Date.now(),
            }
          : previous
      );
    } catch (error: any) {
      console.error("Dashboard AI advice generation failed:", error);
      const errorMessage = error?.message || "Could not generate advice right now. Please try again.";
      
      setUserData((previous) =>
        previous
          ? {
              ...previous,
              aiAdvice: `Error: ${errorMessage}`,
            }
          : previous
      );
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

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
            <Text style={styles.tipTitle}>{aiAdvice ? "Personalized Advice Ready" : "No AI Advice Yet"}</Text>
            <Text style={styles.tipBody}>
              {aiAdvice ? advicePreview : "Tap Get AI Advice to fetch live weather and generate savings tips for your appliances."}
            </Text>
            <View style={styles.tipButtonRow}>
              <TouchableOpacity activeOpacity={0.85} style={styles.tipButton} onPress={handleGetAiAdvice} disabled={isGeneratingAdvice}>
                {isGeneratingAdvice ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.tipButtonText}>Get AI Advice</Text>
                )}
              </TouchableOpacity>
              {aiAdvice ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.tipSecondaryButton}
                  onPress={() => navigation.navigate("AIAdvice")}
                >
                  <Text style={styles.tipSecondaryButtonText}>View more</Text>
                </TouchableOpacity>
              ) : null}
            </View>
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
              <Text style={styles.statValue}>{monthlyUnits || "—"}</Text>
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
              <Text style={styles.billValue}>{estimatedBill || "—"}</Text>
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
            </View>
            <View style={styles.slabBadge}>
              <Text style={styles.slabBadgeText}>{slabTracker.badgeText}</Text>
            </View>

            <View style={styles.slabScaleRow}>
              <Text style={styles.scaleText}>{slabTracker.leftLabel}</Text>
              <Text style={styles.scaleTextActive}>{slabTracker.centerLabel}</Text>
              <Text style={styles.scaleText}>{slabTracker.rightLabel}</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${slabTracker.progress * 100}%` }]} />
            </View>

            <Text style={styles.slabNote}>
              {slabTracker.note}
            </Text>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Monthly Consumption</Text>
            <View style={styles.chartArea}>
              <View style={styles.chartGridLine} />
              <View style={styles.chartBarsRow}>
                {chartData.length > 0 ? (
                  chartData.map((item) => (
                    <View key={`${item.label}-${item.height}`} style={styles.dayColumn}>
                      <View style={[styles.bar, { height: item.height }]} />
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyChartWrap}>
                    <Text style={styles.emptyChartText}>No bill history yet</Text>
                  </View>
                )}
              </View>
              {chartData.length > 0 ? (
                <View style={styles.weekLabelRow}>
                  {chartData.map((item, index) => (
                    <Text key={`${item.label}-${index}`} style={[styles.weekLabel, index === chartData.length - 1 && styles.weekLabelActive]}>
                      {item.label}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.dualCardRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>LOCAL WEATHER</Text>
              <View style={styles.miniValueRow}>
                <Ionicons name="sunny-outline" size={20} color="#D49000" />
                <Text style={styles.miniValue}>{weather ? `${Math.round(weather.temperatureC)}°C` : "—"}</Text>
              </View>
              <Text style={styles.miniNote}>
                {weather ? `${weather.city}: ${weather.condition}` : "Get AI Advice to load live weather"}
              </Text>
            </View>

            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>GOAL TRACKER</Text>
              <View style={styles.miniValueRow}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#0B7A73" />
                <Text style={styles.miniValue}>{peakWindow || "—"}</Text>
              </View>
              <Text style={styles.miniNote}>Latest peak window from uploaded bill</Text>
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
    marginBottom: 10,
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
    alignSelf: "flex-start",
    marginBottom: 14,
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
  emptyChartWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyChartText: {
    color: "#6A7A77",
    fontSize: 13,
    fontWeight: "600",
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
  tipButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  tipSecondaryButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  tipSecondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
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
