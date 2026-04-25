import React, { createContext, useContext, useState } from "react";

interface BillSnapshot {
  id: string;
  createdAt: number;
  billingPeriod: string;
  totalDue: string;
  consumption: string;
  tariff: string;
  peakHours: string;
  totalUnits: string;
  previousMonthUnits: string;
}

interface WeatherSnapshot {
  city: string;
  temperatureC: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  source: "gps" | "profile";
}

interface UserData {
  uid?: string;
  name: string;
  email: string;
  location: string;
  appliances: Record<string, any>;
  latestBill?: BillSnapshot | null;
  billHistory?: BillSnapshot[];
  weather?: WeatherSnapshot | null;
  aiAdvice?: string | null;
  aiAdviceUpdatedAt?: number | null;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
