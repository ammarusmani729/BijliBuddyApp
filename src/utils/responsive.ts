import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Base sizes (from a standard mobile screen)
const baseWidth = 390;  // iPhone 12 width
const baseHeight = 844;

export const scale = (size: number) => (width / baseWidth) * size;
export const verticalScale = (size: number) => (height / baseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const normalizeFont = (size: number) => {
  if (Platform.OS === "web") {
    // For web: scale font sizes more subtly based on window width
    if (width > 1600) return size * 1.4;
    if (width > 1200) return size * 1.2;
    if (width > 800) return size * 1.1;
    return size;
  } else {
    // For mobile: use proportional scaling
    return moderateScale(size, 0.3);
  }
};
