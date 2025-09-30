import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CameraScreenProps {
  onCapture: (imageUri: string) => void;
}

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1606037150583-fb842a55bae7?auto=format&fit=crop&w=1080&q=80';

export const CameraScreen: React.FC<CameraScreenProps> = ({ onCapture }) => {
  const handleCapture = () => {
    onCapture(SAMPLE_IMAGE);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Feather name="zap" size={22} color="#ffffff" />
        </View>
        <Text style={styles.headerTitle}>Анализатор мусора</Text>
      </View>

      <View style={styles.viewfinderWrapper}>
        <View style={styles.viewfinderBackground}>
          <View style={styles.cameraIconCircle}>
            <Feather name="camera" size={40} color="#4CAF50" />
          </View>
          <Text style={styles.viewfinderHint}>Наведите камеру на мусор</Text>
        </View>

        <View style={styles.crosshair}>
          <View style={styles.crosshairSquare}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
        </View>
      </View>

      <View style={styles.captureButtonWrapper}>
        <TouchableOpacity activeOpacity={0.85} onPress={handleCapture} style={styles.captureButton}>
          <Feather name="camera" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eeeeee',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  viewfinderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  viewfinderBackground: {
    position: 'absolute',
    width: '85%',
    aspectRatio: 1,
    borderRadius: 32,
    backgroundColor: '#F1F8E9',
    borderWidth: 5,
    borderColor: 'rgba(76, 175, 80, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  viewfinderHint: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  crosshair: {
    width: '80%',
    aspectRatio: 1,
  },
  crosshairSquare: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 20,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#4CAF50',
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 14,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 14,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 14,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 14,
  },
  captureButtonWrapper: {
    paddingBottom: 36,
    alignItems: 'center',
  },
  captureButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 16,
    elevation: 6,
  },
});
