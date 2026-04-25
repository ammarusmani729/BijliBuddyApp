import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { useUser } from "../context/UserContext";
import { getFirebaseAuth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { getFriendlyAuthErrorMessage } from "../utils/authErrors";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUserData } = useUser();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter all fields");
      return;
    }

    setIsLoggingIn(true);
    try {
      const auth = getFirebaseAuth();
      // 1. Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Fetch User Data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserData({
          uid: user.uid,
          name: userData.name || "",
          email: userData.email || "",
          location: userData.location || "",
          appliances: userData.appliances || {},
          latestBill: userData.latestBill || null,
          billHistory: userData.billHistory || [],
          weather: null,
          aiAdvice: null,
          aiAdviceUpdatedAt: null,
        });
        navigation.navigate("Dashboard" as never);
      } else {
        Alert.alert("Error", "User data not found in database.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", getFriendlyAuthErrorMessage(error, "Invalid email or password."));
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <StatusBar style="dark" />

            <Animatable.View animation="fadeInUp" duration={700} style={styles.heroSection}>
              <Text style={styles.title}>
                Welcome Back <Text style={styles.wave}>👋</Text>
              </Text>
              <Text style={styles.subtitle}>Your personal energy assistant missed you.</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={120} duration={700} style={styles.formCard}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="at" size={20} color="#0D766E" style={styles.leftIcon} />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#7E8B8B"
                  style={styles.input}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.passwordHeaderRow}>
                <Text style={styles.label}>PASSWORD</Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#0D766E" style={styles.leftIcon} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#7E8B8B"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowPassword((current) => !current)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#0D766E"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity activeOpacity={0.86} onPress={handleLogin} disabled={isLoggingIn}>
                <View style={styles.button}>
                  {isLoggingIn ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </View>
              </TouchableOpacity>

            </Animatable.View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register" as never)}
              activeOpacity={0.8}
              style={styles.signupRow}
            >
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Text style={styles.signupLink}>Sign up now</Text>
            </TouchableOpacity>

            {/* <View style={styles.tipCard}>
              <Text style={styles.tipLabel}>AI TIP OF THE DAY</Text>
              <Text style={styles.tipTitle}>Saving 15% on peak hours</Text>
              <Text style={styles.tipBody}>
                Switch off heavy appliances between 7 PM - 9 PM to save on tariff slabs.
              </Text>
              <MaterialCommunityIcons
                name="lightning-bolt-outline"
                size={84}
                color="rgba(255,255,255,0.12)"
                style={styles.tipIcon}
              />
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EAF2F0",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#EAF2F0",
    justifyContent: "center",
  },
  heroSection: {
    paddingBottom: 18,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    color: "#111827",
    fontWeight: "800",
    textAlign: "center",
  },
  wave: {
    fontSize: 31,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 24,
    color: "#62736F",
    fontStyle: "italic",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "#E3E8E7",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  label: {
    color: "#20302D",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  passwordHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  forgotPassword: {
    color: "#0E857E",
    fontSize: 13,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8DFDD",
    borderRadius: 13,
    paddingHorizontal: 14,
    minHeight: 52,
    marginBottom: 14,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#10211F",
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#07726B",
    width: "100%",
    minHeight: 54,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    shadowColor: "#045B56",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E5E4",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#667875",
    fontSize: 12,
    fontWeight: "700",
  },
  googleButton: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#D7DCDB",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  googleIcon: {
    color: "#4285F4",
    fontSize: 16,
    fontWeight: "800",
  },
  googleText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "700",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 18,
    paddingBottom: 14,
  },
  signupText: {
    color: "#374957",
    fontSize: 16,
  },
  signupLink: {
    color: "#0E857E",
    fontSize: 16,
    fontWeight: "700",
  },
  tipCard: {
    borderRadius: 16,
    backgroundColor: "#129C90",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    overflow: "hidden",
    marginTop: 8,
  },
  tipLabel: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  tipTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    width: "72%",
    marginBottom: 6,
  },
  tipBody: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    lineHeight: 18,
    width: "70%",
    fontWeight: "600",
  },
  tipIcon: {
    position: "absolute",
    right: -8,
    bottom: -10,
    transform: [{ rotate: "4deg" }],
  },
});
