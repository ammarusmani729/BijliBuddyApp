import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  Dashboard: undefined;
  Appliances: undefined;
  BillScan: undefined;
  AIAdvice: undefined;
  Profile: undefined;
};

interface MenuBarProps {
  active: string;
  onChange: (screen: string) => void;
}

interface MenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof RootStackParamList;
  activeKeys: string[];
  center?: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({ active, onChange }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const menuItems: MenuItem[] = [
    {
      label: "Home",
      icon: "home",
      route: "Dashboard",
      activeKeys: ["Dashboard", "Home"],
    },
    {
      label: "AI Advice",
      icon: "stats-chart-outline",
      route: "AIAdvice",
      activeKeys: ["AIAdvice", "AI Advice", "Weather", "Reports"],
    },
    {
      label: "Bill Scan",
      icon: "scan-outline",
      route: "BillScan",
      activeKeys: ["BillScan", "Bill Scan", "Predict", "Scan"],
      center: true,
    },
    {
      label: "Appliances",
      icon: "flash-outline",
      route: "Appliances",
      activeKeys: ["Appliances", "UsageDetails", "Usage"],
    },
    {
      label: "Profile",
      icon: "person-outline",
      route: "Profile",
      activeKeys: ["Profile"],
    },
  ];

  const handlePress = (item: MenuItem) => {
    onChange(item.activeKeys[0]);
    navigation.navigate(item.route);
  };

  return (
    <View style={styles.shell}>
      <View style={styles.container}>
        {menuItems.map((item) => {
          const isActive = item.activeKeys.includes(active);

          if (item.center) {
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => handlePress(item)}
                activeOpacity={0.85}
                style={styles.centerWrap}
              >
                <View style={[styles.centerButton, isActive && styles.centerButtonActive]}>
                  <Ionicons name={item.icon} size={22} color="#FFFFFF" />
                </View>
                <Text style={[styles.centerLabel, isActive && styles.activeLabel]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => handlePress(item)}
              activeOpacity={0.8}
              style={styles.item}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={isActive ? "#0C7F76" : "#B6C0C8"}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default MenuBar;

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: 8,
    paddingBottom: 6,
    paddingTop: 2,
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E1E7E6",
  },
  item: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    paddingBottom: 1,
  },
  label: {
    color: "#A8B1B8",
    fontSize: 10,
    marginTop: 3,
    fontWeight: "600",
  },
  activeLabel: {
    color: "#0C7F76",
    fontWeight: "700",
  },
  centerWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    marginTop: -16,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#0C7F76",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0C7F76",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  centerButtonActive: {
    transform: [{ translateY: -1 }],
  },
  centerLabel: {
    color: "#B0B9C1",
    fontSize: 10,
    marginTop: 3,
    fontWeight: "600",
  },
});
