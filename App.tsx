import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoadingScreen from "./src/screens/LoadingScreen";
import InfoScreen  from "./src/screens/InfoScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import Dashboard from "./src/screens/Dashboard";
import AppliancesScreen from "./src/screens/AppliancesScreen";
import BillScanScreen from "./src/screens/BillScanScreen";
import AIAdviceScreen from "./src/screens/AIAdviceScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { UserProvider } from "./src/context/UserContext";
import { User } from "lucide-react-native";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Appliances" component={AppliancesScreen} />
        <Stack.Screen name="BillScan" component={BillScanScreen} />
        <Stack.Screen name="AIAdvice" component={AIAdviceScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}


