import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  StyleProp,
} from 'react-native';
import { colors } from '../styles/index';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const containerStyle = [
    styles.base,
    variant === 'primary'   && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'outline'   && styles.outline,
    disabled && styles.disabled,
    style,
  ];

  const titleStyle = [
    styles.titleBase,
    variant === 'outline' ? styles.titleOutline : styles.titleDefault,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={containerStyle}
    >
      {loading
        ? <ActivityIndicator color={colors.primaryButtonText} />
        : <Text style={titleStyle}>{title}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: colors.primaryButton,
  },
  secondary: {
    backgroundColor: colors.loginBox,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primaryButton,
  },
  titleDefault: {
    color: colors.primaryButtonText,
  },
  titleOutline: {
    color: colors.primaryButton,
  },
  disabled: {
    opacity: 0.5,
  },
});
