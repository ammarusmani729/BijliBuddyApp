import React from "react";
import { Animated, Easing } from "react-native";

const AnimatedTransition = ({ children }: { children: React.ReactNode }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}>
      {children}
    </Animated.View>
  );
};

export default AnimatedTransition;
