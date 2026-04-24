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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { useUser } from "../context/UserContext";

const SignupScreen = () => {
  const navigation = useNavigation();
  const { setUserData } = useUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters long");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Terms Required", "Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setUserData({
      name: fullName,
      email,
      location: "",
      appliances: {},
    });

    navigation.navigate("Dashboard" as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.dotPattern} />

          <Animatable.View animation="fadeInDown" duration={700} style={styles.hero}>
              {/* <View style={styles.logoBox}>
                <Image
                  source={require("../../assets/icon.png")}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View> */}
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>
                Join Bijli Buddy to start saving on your energy bills today.
              </Text>
            </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={100} duration={700} style={styles.formCard}>
              <Text style={styles.label}>FULL NAME</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color="#7B8684" style={styles.leftIcon} />
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="#B0B7B5"
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#7B8684" style={styles.leftIcon} />
                <TextInput
                  placeholder="name@example.com"
                  placeholderTextColor="#B0B7B5"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#7B8684" style={styles.leftIcon} />
                <TextInput
                  placeholder="Min. 8 characters"
                  placeholderTextColor="#B0B7B5"
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
                    color="#6F7B78"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-reset" size={18} color="#7B8684" style={styles.leftIcon} />
                <TextInput
                  placeholder="Repeat your password"
                  placeholderTextColor="#B0B7B5"
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowConfirmPassword((current) => !current)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6F7B78"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.termsRow}
                onPress={() => setAcceptedTerms((current) => !current)}
              >
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms ? <Ionicons name="checkmark" size={12} color="#FFFFFF" /> : null}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.88} onPress={handleSignup}>
                <View style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Sign Up</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              {/* <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity
                  activeOpacity={0.86}
                  style={styles.socialButton}
                  onPress={() => Alert.alert("Google sign-in", "Google sign-in is not configured yet.")}
                >
                  <View style={styles.socialIconWrap}>
                    <Text style={styles.googleMark}>G</Text>
                  </View>
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.86}
                  style={styles.socialButton}
                  onPress={() => Alert.alert("Facebook sign-in", "Facebook sign-in is not configured yet.")}
                >
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
              </View> */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Login" as never)}
                style={styles.loginRow}
              >
                <Text style={styles.loginText}>Already have an account? </Text>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E6ECEA",
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#EEF4F2",
    justifyContent: "center",
  },
  dotPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  hero: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#D9EBE8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logo: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#1A1F1D",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    maxWidth: 290,
    fontSize: 16,
    lineHeight: 22,
    color: "#5D6C68",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "#DDE4E2",
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#4F5E5A",
    marginBottom: 8,
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAF9",
    borderWidth: 1,
    borderColor: "#D6DEDC",
    borderRadius: 12,
    marginBottom: 14,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#1F2A28",
    fontSize: 15,
    paddingVertical: 10,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 2,
    marginBottom: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C5CDCB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: "#0E7A73",
    borderColor: "#0E7A73",
  },
  termsText: {
    flex: 1,
    color: "#556663",
    fontSize: 13,
    lineHeight: 18,
  },
  termsLink: {
    color: "#0E7A73",
    fontWeight: "700",
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#0B746D",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#045B56",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DCE3E1",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#7A8784",
    fontSize: 12,
    fontWeight: "700",
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D5DDDB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  socialIconWrap: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  googleMark: {
    color: "#DB4437",
    fontSize: 14,
    fontWeight: "900",
  },
  socialText: {
    color: "#1D2A27",
    fontSize: 14,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  loginText: {
    color: "#677573",
    fontSize: 15,
  },
  loginLink: {
    color: "#0E7A73",
    fontSize: 15,
    fontWeight: "800",
  },
});
