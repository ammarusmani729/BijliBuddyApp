import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MenuBar from "../components/MenuBar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

const PredictScreen = () => {
  const [activeTab, setActiveTab] = useState("Predict");
  const [hasUploadedBill, setHasUploadedBill] = useState(false);
  const [selectedBillUri, setSelectedBillUri] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required to take bill photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedBillUri(result.assets[0].uri);
      setHasUploadedBill(true);
    }
  };

  const handlePickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Gallery permission is required to select bill images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedBillUri(result.assets[0].uri);
      setHasUploadedBill(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Image
              source={require("../../assets/Bijli-Buddy-Logo.png")}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={22} color="#9AA6AD" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Scan Your Bill</Text>
            <Text style={styles.heroSubtitle}>
              Upload or photograph your utility bill for detailed charge analysis.
            </Text>
          </View>

          <View style={styles.dropZone}>
            {selectedBillUri ? (
              <>
                <Image source={{ uri: selectedBillUri }} style={styles.billPreviewImage} />
                <Text style={styles.dropTitle}>Bill uploaded successfully</Text>
                <Text style={styles.dropSubtitle}>Tap camera/gallery again to replace this bill image</Text>
              </>
            ) : (
              <>
                <View style={styles.dropIconWrap}>
                  <MaterialCommunityIcons name="file-document-outline" size={30} color="#0B7A73" />
                </View>
                <Text style={styles.dropTitle}>Drop bill here</Text>
                <Text style={styles.dropSubtitle}>SUPPORTED: PDF, JPG, PNG (MAX 10MB)</Text>
              </>
            )}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction]}
              activeOpacity={0.85}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryAction]}
              activeOpacity={0.85}
              onPress={handlePickFromGallery}
            >
              <Ionicons name="images-outline" size={18} color="#111827" />
              <Text style={styles.secondaryActionText}>Upload Gallery</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Analysis Results</Text>
            <View style={styles.previewBadge}>
              <Text style={styles.previewBadgeText}>{hasUploadedBill ? "UPLOADED" : "WAITING"}</Text>
            </View>
          </View>

          {hasUploadedBill ? (
            <View style={styles.resultsCard}>
              <View style={styles.resultTopRow}>
                <View>
                  <Text style={styles.resultLabel}>BILLING PERIOD</Text>
                  <Text style={styles.periodText}>Oct 01 - Oct 31, 2023</Text>
                </View>
                <View style={styles.totalDueWrap}>
                  <Text style={styles.resultLabel}>TOTAL DUE</Text>
                  <Text style={styles.totalDueText}>$142.50</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.metricsRow}>
                <View>
                  <Text style={styles.resultLabel}>CONSUMPTION</Text>
                  <Text style={styles.metricValue}>842 <Text style={styles.metricUnit}>kWh</Text></Text>
                </View>
                <View>
                  <Text style={styles.resultLabel}>TARIFF</Text>
                  <Text style={styles.metricValue}>Domestic LT-1</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.breakdownSection}>
                <Text style={styles.breakdownTitle}>Detailed Bill Breakdown</Text>

                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Energy Charge (842 x $0.11)</Text>
                  <Text style={styles.breakdownValue}>$92.62</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Fixed Charges</Text>
                  <Text style={styles.breakdownValue}>$18.00</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Fuel Adjustment Charge</Text>
                  <Text style={styles.breakdownValue}>$9.45</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Electricity Duty / Tax</Text>
                  <Text style={styles.breakdownValue}>$12.32</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Meter Rent</Text>
                  <Text style={styles.breakdownValue}>$3.50</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Previous Arrears</Text>
                  <Text style={styles.breakdownValue}>$8.00</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Subsidy Adjustment</Text>
                  <Text style={styles.breakdownNegative}>-$1.39</Text>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Net Bill Amount</Text>
                  <Text style={styles.totalValue}>$142.50</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateCard}>
              <Ionicons name="document-text-outline" size={22} color="#6C7D7A" />
              <Text style={styles.emptyStateText}>Upload a bill to view full charge details.</Text>
            </View>
          )}
        </ScrollView>

        <MenuBar active={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
};

export default PredictScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EAF1EF",
  },
  screen: {
    flex: 1,
    backgroundColor: "#EDF4F1",
  },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  brandLogo: {
    width: 128,
    height: 34,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  heroSection: {
    marginBottom: 14,
  },
  heroTitle: {
    color: "#0F172A",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#546665",
    fontSize: 14,
    lineHeight: 21,
    width: "95%",
  },
  dropZone: {
    borderWidth: 1.2,
    borderStyle: "dashed",
    borderColor: "#9CCFC7",
    borderRadius: 14,
    backgroundColor: "#E8EFED",
    minHeight: 210,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  billPreviewImage: {
    width: "92%",
    height: Platform.OS === "web" ? 180 : 160,
    borderRadius: 10,
    marginBottom: 10,
  },
  dropIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#CFE1DE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  dropTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  dropSubtitle: {
    color: "#6A7C7A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    minHeight: 66,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryAction: {
    backgroundColor: "#0B756D",
  },
  secondaryAction: {
    backgroundColor: "#F4F7F6",
    borderWidth: 1,
    borderColor: "#DDE4E2",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 5,
  },
  secondaryActionText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  resultsTitle: {
    color: "#111827",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
  },
  previewBadge: {
    backgroundColor: "#DDE9E6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  previewBadgeText: {
    color: "#0A736B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  resultsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCE5E3",
    overflow: "hidden",
    marginBottom: 14,
  },
  resultTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  resultLabel: {
    color: "#6A7A78",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  periodText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  totalDueWrap: {
    alignItems: "flex-end",
  },
  totalDueText: {
    color: "#0B7A73",
    fontSize: 18,
    fontWeight: "800",
  },
  separator: {
    height: 1,
    backgroundColor: "#E6ECEA",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  metricValue: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  metricUnit: {
    color: "#61716E",
    fontSize: 14,
    fontWeight: "600",
  },
  breakdownSection: {
    backgroundColor: "#F6F9F8",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
  },
  breakdownTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E9EFED",
  },
  breakdownLabel: {
    color: "#516360",
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  breakdownValue: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "800",
  },
  breakdownNegative: {
    color: "#B42318",
    fontSize: 13,
    fontWeight: "800",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#D8E2DF",
  },
  totalLabel: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "800",
  },
  totalValue: {
    color: "#0B7A73",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyStateCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8E3E0",
    backgroundColor: "#F7FAF9",
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  emptyStateText: {
    color: "#5D6D69",
    fontSize: 13,
    marginLeft: 8,
    fontWeight: "700",
  },
});
