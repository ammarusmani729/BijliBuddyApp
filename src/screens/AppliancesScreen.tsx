import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MenuBar from "../components/MenuBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";
import { useIsFocused } from "@react-navigation/native";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";


type Appliance = {
  id: string;
  name: string;
  quantity: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type ApplianceOption = {
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const applianceOptions: ApplianceOption[] = [
  { name: "Air Conditioner", icon: "air-conditioner" },
  { name: "Lights", icon: "lightbulb-group-outline" },
  { name: "Ceiling Fan", icon: "fan" },
  { name: "Refrigerator", icon: "fridge-outline" },
  { name: "Washing Machine", icon: "washing-machine" },
  { name: "Water Heater", icon: "water-boiler" },
  { name: "Microwave Oven", icon: "microwave" },
  { name: "Television", icon: "television" },
  { name: "Computer", icon: "desktop-classic" },
  { name: "Laptop", icon: "laptop" },
  { name: "Wi-Fi Router", icon: "router-wireless" },
  { name: "Water Purifier", icon: "water-outline" },
  { name: "Induction Cooktop", icon: "stove" },
  { name: "Dishwasher", icon: "dishwasher" },
  { name: "Room Cooler", icon: "air-humidifier" },
];

type ApplianceRecord = Record<string, Appliance>;

const toApplianceRecord = (items: Appliance[]) =>
  items.reduce<ApplianceRecord>((record, item) => {
    record[item.id] = item;
    return record;
  }, {});

const toApplianceList = (record: ApplianceRecord | undefined | null) =>
  record ? Object.values(record) : [];

const AppliancesScreen = () => {
  const { userData, setUserData } = useUser();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("Appliances");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApplianceDropdown, setShowApplianceDropdown] = useState(false);
  const [showDeleteQtyModal, setShowDeleteQtyModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Appliance | null>(null);
  const [deleteQtyInput, setDeleteQtyInput] = useState("");
  const [selectedApplianceName, setSelectedApplianceName] = useState(applianceOptions[0].name);
  const [newApplianceQty, setNewApplianceQty] = useState("");
  const [appliances, setAppliances] = useState<Appliance[]>([]);

  const userName = userData?.name?.split(" ")[0] || "Ahmed";

  useEffect(() => {
    const loadAppliances = async () => {
      if (!isFocused || !userData?.uid) {
        return;
      }

      try {
        const userDocRef = doc(db, "users", userData.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          setAppliances([]);
          setUserData((previous) =>
            previous ? { ...previous, appliances: {} } : previous
          );
          return;
        }

        const storedAppliances = (userDocSnap.data().appliances || {}) as ApplianceRecord;
        const loadedAppliances = toApplianceList(storedAppliances);
        setAppliances(loadedAppliances);
        setUserData((previous) =>
          previous ? { ...previous, appliances: storedAppliances } : previous
        );
      } catch (error) {
        console.error("Failed to load appliances:", error);
      }
    };

    loadAppliances();
  }, [isFocused, userData?.uid, setUserData]);

  const filteredAppliances = appliances.filter((item) => {
    const query = search.toLowerCase().trim();
    if (!query) {
      return true;
    }

    return item.name.toLowerCase().includes(query);
  });

  const persistAppliances = async (nextAppliances: Appliance[]) => {
    if (!userData?.uid) {
      return;
    }

    const appliancesRecord = toApplianceRecord(nextAppliances);
    const userDocRef = doc(db, "users", userData.uid);

    await setDoc(
      userDocRef,
      {
        appliances: appliancesRecord,
      },
      { merge: true }
    );

    setAppliances(nextAppliances);
    setUserData((previous) =>
      previous ? { ...previous, appliances: appliancesRecord } : previous
    );
  };

  const handleAddAppliance = async () => {
    const quantity = Number.parseInt(newApplianceQty, 10);
    const selectedAppliance = applianceOptions.find((item) => item.name === selectedApplianceName);

    if (!selectedAppliance) {
      Alert.alert("Select appliance", "Please select an appliance from the dropdown.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      Alert.alert("Invalid quantity", "Quantity must be a whole number greater than 0.");
      return;
    }

    const newAppliance: Appliance = {
      id: `${selectedAppliance.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: selectedAppliance.name,
      quantity,
      icon: selectedAppliance.icon,
    };

    try {
      await persistAppliances([newAppliance, ...appliances]);
      setShowAddModal(false);
      setShowApplianceDropdown(false);
      setNewApplianceQty("");
    } catch (error) {
      console.error("Failed to save appliance:", error);
      Alert.alert("Save Failed", "Could not save the appliance. Please try again.");
    }
  };

  const handleDeleteAppliance = async (appliance: Appliance) => {
    if (appliance.quantity <= 1) {
      try {
        await persistAppliances(appliances.filter((item) => item.id !== appliance.id));
      } catch (error) {
        console.error("Failed to delete appliance:", error);
        Alert.alert("Delete Failed", "Could not delete the appliance. Please try again.");
      }
      return;
    }

    setDeleteTarget(appliance);
    setDeleteQtyInput("1");
    setShowDeleteQtyModal(true);
  };

  const handleConfirmDeleteQty = async () => {
    if (!deleteTarget) {
      return;
    }

    const qtyToDelete = Number.parseInt(deleteQtyInput, 10);

    if (!Number.isInteger(qtyToDelete) || qtyToDelete <= 0) {
      Alert.alert("Invalid quantity", "Enter a whole number greater than 0.");
      return;
    }

    if (qtyToDelete > deleteTarget.quantity) {
      Alert.alert("Too high", `You only have ${deleteTarget.quantity} in the list.`);
      return;
    }

    const nextAppliances = appliances
      .map((item) => {
        if (item.id !== deleteTarget.id) {
          return item;
        }

        const updatedQty = item.quantity - qtyToDelete;
        if (updatedQty <= 0) {
          return null;
        }

        return { ...item, quantity: updatedQty };
      })
      .filter((item): item is Appliance => item !== null);

    try {
      await persistAppliances(nextAppliances);
      setShowDeleteQtyModal(false);
      setDeleteTarget(null);
      setDeleteQtyInput("");
    } catch (error) {
      console.error("Failed to update appliance quantity:", error);
      Alert.alert("Delete Failed", "Could not update the appliance. Please try again.");
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

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionLabel}>MANAGEMENT</Text>
              <Text style={styles.title}>My Appliances</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={0.86}
              onPress={() => {
                setShowAddModal(true);
                setShowApplianceDropdown(false);
              }}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#7C898C" />
            <TextInput
              placeholder="Search appliances..."
              placeholderTextColor="#8B979A"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.listWrap}>
            {filteredAppliances.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="layers-outline" size={26} color="#6E7C7A" />
                <Text style={styles.emptyStateTitle}>No appliances added yet</Text>
                <Text style={styles.emptyStateText}>
                  Add your first appliance and it will be saved to Firebase.
                </Text>
              </View>
            ) : filteredAppliances.map((item) => {
              return (
                <View key={item.id} style={styles.listItem}>
                  <View style={styles.listLeft}>
                    <View style={styles.listIconWrap}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={20}
                        color="#0B7A73"
                      />
                    </View>
                    <View>
                      <Text style={styles.listName}>{item.name}</Text>
                    </View>
                  </View>
                  <View style={styles.listRight}>
                    <View style={styles.quantityRow}>
                      <Text style={styles.listQuantity}>Qty: {item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.deleteIconButton}
                        activeOpacity={0.8}
                        onPress={() => handleDeleteAppliance(item)}
                      >
                        <Ionicons name="trash-outline" size={17} color="#C43D34" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <Modal
          visible={showAddModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Appliance</Text>

              <Text style={styles.modalLabel}>Appliance Name</Text>
              <TouchableOpacity
                style={styles.dropdownTrigger}
                activeOpacity={0.85}
                onPress={() => setShowApplianceDropdown(true)}
              >
                <Text style={styles.dropdownTriggerText}>{selectedApplianceName}</Text>
                <Ionicons name="chevron-down" size={18} color="#56706B" />
              </TouchableOpacity>

              <Text style={styles.modalLabel}>Quantity in House</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 3"
                placeholderTextColor="#8B979A"
                value={newApplianceQty}
                onChangeText={setNewApplianceQty}
                keyboardType="number-pad"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  activeOpacity={0.86}
                  onPress={() => {
                    setShowAddModal(false);
                    setShowApplianceDropdown(false);
                    setNewApplianceQty("");
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalAddButton}
                  activeOpacity={0.86}
                  onPress={handleAddAppliance}
                >
                  <Text style={styles.modalAddText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showApplianceDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowApplianceDropdown(false)}
        >
          <TouchableOpacity
            style={styles.pickerBackdrop}
            activeOpacity={1}
            onPress={() => setShowApplianceDropdown(false)}
          >
            <TouchableOpacity
              style={styles.pickerCard}
              activeOpacity={1}
              onPress={() => undefined}
            >
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Appliance</Text>
                <TouchableOpacity
                  style={styles.pickerClose}
                  activeOpacity={0.86}
                  onPress={() => setShowApplianceDropdown(false)}
                >
                  <Ionicons name="close" size={18} color="#4A5B58" />
                </TouchableOpacity>
              </View>

              <FlatList
                style={styles.pickerList}
                data={applianceOptions}
                keyExtractor={(option) => option.name}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                renderItem={({ item: option }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    activeOpacity={0.82}
                    onPress={() => {
                      setSelectedApplianceName(option.name);
                      setShowApplianceDropdown(false);
                    }}
                  >
                    <MaterialCommunityIcons name={option.icon} size={16} color="#0B7A73" />
                    <Text style={styles.dropdownItemText}>{option.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={showDeleteQtyModal}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setShowDeleteQtyModal(false);
            setDeleteTarget(null);
            setDeleteQtyInput("");
          }}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Delete Quantity</Text>
              <Text style={styles.modalHintText}>
                {deleteTarget
                  ? `How many ${deleteTarget.name} do you want to remove? (Available: ${deleteTarget.quantity})`
                  : "Enter quantity to remove."}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 1"
                placeholderTextColor="#8B979A"
                value={deleteQtyInput}
                onChangeText={setDeleteQtyInput}
                keyboardType="number-pad"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  activeOpacity={0.86}
                  onPress={() => {
                    setShowDeleteQtyModal(false);
                    setDeleteTarget(null);
                    setDeleteQtyInput("");
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalAddButton}
                  activeOpacity={0.86}
                  onPress={handleConfirmDeleteQty}
                >
                  <Text style={styles.modalAddText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <MenuBar active={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
};

export default AppliancesScreen;

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
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionLabel: {
    color: "#6E7C7A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    color: "#101312",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
  },
  addButton: {
    backgroundColor: "#0B7A73",
    borderRadius: 13,
    paddingHorizontal: 12,
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E6E5",
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: "#2D3A39",
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: "#067E77",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    overflow: "hidden",
    marginBottom: 14,
  },
  tipTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipLabel: {
    color: "#D8FFF8",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 7,
    letterSpacing: 0.6,
  },
  tipText: {
    color: "#FFFFFF",
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "700",
    width: "86%",
  },
  tipMarkTop: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  tipMarkBottom: {
    position: "absolute",
    right: 20,
    bottom: 18,
  },
  listWrap: {
    gap: 10,
  },
  emptyState: {
    backgroundColor: "#F5F7F6",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DFE7E5",
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyStateTitle: {
    color: "#101312",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyStateText: {
    color: "#5F6F6B",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7F6",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DFE7E5",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  listLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E1EAEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  listName: {
    color: "#101312",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
  },
  listRight: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  listQuantity: {
    color: "#0A4A4A",
    fontSize: 14,
    fontWeight: "700",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  deleteIconButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(11, 26, 24, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10211F",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    color: "#4F5E5A",
    fontWeight: "700",
    marginBottom: 6,
  },
  modalHintText: {
    color: "#4F5E5A",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  modalInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#D4DEDC",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#122422",
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: "#F8FAF9",
  },
  dropdownTrigger: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#D4DEDC",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAF9",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownTriggerText: {
    color: "#122422",
    fontSize: 15,
    fontWeight: "600",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F1",
    backgroundColor: "#FFFFFF",
  },
  dropdownItemText: {
    color: "#122422",
    fontSize: 14,
    marginLeft: 8,
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(11, 26, 24, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  pickerCard: {
    width: "100%",
    maxHeight: 360,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5DFDD",
    overflow: "hidden",
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EFED",
  },
  pickerTitle: {
    color: "#10211F",
    fontSize: 16,
    fontWeight: "700",
  },
  pickerClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F4",
  },
  pickerList: {
    backgroundColor: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  modalCancelButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1DAD8",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    color: "#5E6E6A",
    fontWeight: "700",
  },
  modalAddButton: {
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#0B7A73",
    alignItems: "center",
    justifyContent: "center",
  },
  modalAddText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
