import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const LINE_WIDTH = width * 0.7;

const DURATION = 3000; // Total duration for the loading animation

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Animate the line from left to right
    progress.value = withTiming(1, { duration: DURATION });

    // Fade out the loading screen
    opacity.value = withSequence(
      withTiming(1, { duration: 4500 }),
      withTiming(0, { duration: 500 })
    );

    // Set timeout for 5 seconds
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const lineStyle = useAnimatedStyle(() => {
    return {
      width: LINE_WIDTH * progress.value,
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        <Animated.Text style={[styles.text, { opacity: opacity.value }]}>
          MENDER
        </Animated.Text>
        <View style={styles.lineContainer}>
          <Animated.View style={[styles.line, lineStyle]} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  lineContainer: {
    width: LINE_WIDTH,
    height: 4,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  line: {
    height: '100%',
    backgroundColor: '#000',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
});

export default LoadingScreen; 