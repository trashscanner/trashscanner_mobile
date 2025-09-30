import React, { useState } from 'react';
import { Image, View, Text, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

interface AvatarProps {
  uri?: string;
  initials: string;
  size?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, initials, size = 72, style, imageStyle }) => {
  const [hasError, setHasError] = useState(false);
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={[styles.container, dimension, style]}>
      {uri && !hasError ? (
        <Image
          source={{ uri }}
          style={[styles.image, dimension, imageStyle]}
          onError={() => setHasError(true)}
        />
      ) : (
        <View style={[styles.fallback, dimension]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4CAF50',
  },
});
