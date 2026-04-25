import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MenuBar from "../components/MenuBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";
import { ActivityIndicator } from "react-native";
import { getWeatherAndAiAdvice } from "../services/AIAdviceService";

const AIAdviceScreen = () => {
  const [activeTab, setActiveTab] = useState("AIAdvice");
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const { userData, setUserData } = useUser();

  const latestBill = userData?.latestBill;
  const weather = userData?.weather || null;
  const aiAdvice = userData?.aiAdvice || null;

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
      console.error("AI advice generation failed:", error);
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
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Image
              source={require("../../assets/Bijli-Buddy-Logo.png")}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View style={styles.topActions}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(userData?.name?.charAt(0) || "A").toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Badge + Title */}
          <View style={styles.badgeRow}>
            <Ionicons name="flash" size={14} color="#0B7A73" />
            <Text style={styles.badgeText}>Response given by AI</Text>
          </View>

          <Text style={styles.heroTitle}>AI Advice</Text>

          <View style={styles.weatherCard}>
            <Text style={styles.weatherTitle}>Current Weather</Text>
            <Text style={styles.weatherBody}>
              {weather
                ? `${weather.city}: ${Math.round(weather.temperatureC)}°C, ${weather.condition}, humidity ${weather.humidity}%`
                : "No weather fetched yet. Tap Get AI Advice to load current weather."}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.bodyText}>
              {aiAdvice || "No AI advice yet. Tap the button below to fetch weather and generate appliance-based savings tips."}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={handleGetAiAdvice}
            disabled={isGeneratingAdvice}
          >
            {isGeneratingAdvice ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Get AI Advice</Text>
            )}
          </TouchableOpacity>

          {aiAdvice ? (
            <Text style={styles.metaText}>Detailed advice is based on your latest weather and appliance list.</Text>
          ) : null}

          <View style={styles.bottomGap} />
        </ScrollView>

        <MenuBar active={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
};

export default AIAdviceScreen;

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
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: "#0B7A73",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: "#0F172A",
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800",
    marginBottom: 16,
  },
  weatherCard: {
    backgroundColor: "#F4F8F7",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E0E7E5",
    marginBottom: 12,
  },
  weatherTitle: {
    color: "#0B7A73",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  weatherBody: {
    color: "#3D4F4C",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
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
  bodyText: {
    color: "#3D4F4C",
    fontSize: 15,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: "#07726B",
    minHeight: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  metaText: {
    marginTop: 10,
    color: "#5E6E6B",
    fontSize: 12,
    lineHeight: 18,
  },
  bottomGap: {
    height: 8,
  },
  boldText: {
    fontWeight: "700",
    color: "#111827",
  },
  highlightText: {
    fontWeight: "700",
    color: "#0B7A73",
  },
  blockquoteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    paddingLeft: 28,
    borderWidth: 1,
    borderColor: "#E2E9E7",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    overflow: "hidden",
  },
  blockquoteBorder: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    backgroundColor: "#0B7A73",
    borderRadius: 2,
  },
  blockquoteText: {
    color: "#3D4F4C",
    fontSize: 15,
    lineHeight: 24,
    fontStyle: "italic",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#0B7A73",
    fontSize: 18,
    fontWeight: "800",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F4F8F7",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    color: "#697974",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#DCE5E3",
  },
  tealCard: {
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
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    marginBottom: 10,
    width: "85%",
  },
  tipBody: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    lineHeight: 22,
    width: "88%",
    fontWeight: "500",
  },
  tipWatermark: {
    position: "absolute",
    right: -6,
    bottom: -18,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F1",
  },
  stepRowLast: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E6F2F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 1,
  },
  stepNumberText: {
    color: "#0B7A73",
    fontSize: 13,
    fontWeight: "800",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  stepDesc: {
    color: "#5E6E6B",
    fontSize: 13,
    lineHeight: 19,
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  savingsLabel: {
    color: "#516360",
    fontSize: 14,
  },
  savingsLabelBold: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
  },
  savingsValue: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  savingsValueGreen: {
    color: "#0B7A73",
    fontSize: 15,
    fontWeight: "800",
  },
  savingsDivider: {
    height: 1,
    backgroundColor: "#E6ECEA",
    marginVertical: 6,
  },
  savingsHighlight: {
    color: "#0B7A73",
    fontSize: 20,
    fontWeight: "800",
  },
  progressSection: {
    marginTop: 14,
  },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#697974",
    fontSize: 12,
    fontWeight: "700",
  },
  progressPercent: {
    color: "#0B7A73",
    fontSize: 12,
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#DDE3E1",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "32%",
    backgroundColor: "#0F8B82",
    borderRadius: 999,
  },
  disclaimerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F4F8F7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    color: "#6A7C7A",
    fontSize: 12,
    lineHeight: 18,
  },
});
