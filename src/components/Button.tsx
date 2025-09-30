import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

type IconName = React.ComponentProps<typeof Feather>['name'];

interface ButtonProps {
  label: string;
  onPress?: () => void;
  iconName?: IconName;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  iconName,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const iconColor = variant === 'primary' ? '#ffffff' : '#26a69a';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.base, styles[variant], disabled && styles.disabled, style]}
    >
      <View style={styles.content}>
        {iconName ? <Feather name={iconName} size={18} color={iconColor} style={styles.icon} /> : null}
        <Text
          style={[
            styles.label,
            styles[`${variant}Text` as const],
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  primary: {
    backgroundColor: '#4CAF50',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#00BCD4',
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  primaryText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#00BCD4',
  },
  ghostText: {
    color: '#26a69a',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#e0e0e0',
  },
});
