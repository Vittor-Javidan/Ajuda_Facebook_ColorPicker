import React, { useMemo } from 'react';
import ConfigService from '../../Services/ConfigService';
import { ThemeDTO } from '../../Services/ThemeService';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { interpolateColor, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';

export default function ColorPicker(props: {
  pickerWidth: number
  pickerHeight: number
  pickerCircleSize: number
}) {

  // Constants
  const COLORS = useMemo<string[]>(() => [
    '#000000', // Black
    '#0000FF', // Blue
    '#00FF00', // Green
    '#00FFFF', // Cyan
    '#FF0000', // Red
    '#FF00FF', // Magenta
    '#FFFF00', // Yellow
    '#FFFFFF', // White
  ], []);

  // Services
  const theme = useMemo<ThemeDTO>(() => ConfigService.config.theme, []);

  // Shared Values
  const translateX = useSharedValue(0);
  const adjustedTranslateX = useDerivedValue(() => {
    return Math.min(
      Math.max(translateX.value, 0),
      props.pickerWidth - props.pickerCircleSize,
    );
  });

  // Animated Style
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = COLORS.map((_, index) => (index / COLORS.length) * props.pickerWidth);
    const pickerColor = interpolateColor(
      translateX.value,
      inputRange,
      COLORS,
      'RGB'
    );
    console.log(pickerColor);
    return {
      transform: [{ translateX: adjustedTranslateX.value }],
      backgroundColor: pickerColor,
    };
  });

  // Gestures Events
  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { x: number }>({
    onStart: (_, context) => {
      context.x = adjustedTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
    },
    onEnd: () => {},
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View
        style={{
          justifyContent: 'center',
        }}
      >
        {/*Color Gradient*/}
        <LinearGradient
          colors={COLORS}
          start={{ x: 0, y: 0}}
          end={{ x: 1, y: 0}}
          style={{
            height: props.pickerHeight,
            width: props.pickerWidth,
            borderRadius: props.pickerHeight / 2,
          }}
          />

        {/*PICKER CIRCLE*/}
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: theme.primary,
              width: props.pickerCircleSize,
              height: props.pickerCircleSize,
              borderRadius: props.pickerCircleSize / 2,
            },
            animatedStyle,
          ]}
        />
    </Animated.View>
  </PanGestureHandler>
  );
}


