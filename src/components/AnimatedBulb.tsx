import React, { useEffect, useRef } from 'react';
import { View, Dimensions, Animated, Easing, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Dynamic icon size based on screen width
const iconSize = SCREEN_WIDTH * 0.3;

export const AnimatedBulb = () => {
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulsing animation loop for the glow effect
        const cycle = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1200,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        );
        cycle.start();
        return () => cycle.stop();
    }, [glowAnim]);

    const shadowOpacityInterpolation = glowAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1, 0.3], // Pulsing shadow opacity
    });

    const scaleInterpolation = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.05], // Subtle pulsing scale
    });

    return (
        <Animated.View style={[
            styles.animatedWrapper, 
            {
                transform: [{ scale: scaleInterpolation }],
                shadowOpacity: shadowOpacityInterpolation,
            }
        ]}>
            {/* Zap icon with static Gold color */}
            <Zap size={iconSize} color="#FCD34D" />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    animatedWrapper: {
        shadowColor: '#FCD34D',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 20,
        elevation: 15, // Android shadow
    }
});
