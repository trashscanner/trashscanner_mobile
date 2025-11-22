import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { usePredictions } from '../hooks/usePredictions';
import { TrashType, PredictionResponse } from '../types/api';

export const CameraScreen = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { analyzeImage, isAnalyzing } = usePredictions();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Feather name="camera-off" size={64} color="#9E9E9E" />
          <Text style={styles.permissionTitle}>Требуется доступ к камере</Text>
          <Text style={styles.permissionText}>
            Для сканирования мусора нужен доступ к камере вашего устройства
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Предоставить доступ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isAnalyzing) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (!photo) return;

      setResult(null);
      const analysisResult = await analyzeImage(photo.uri);
      setResult(analysisResult);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось проанализировать изображение');
    }
  };

  const getTrashTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      [TrashType.Cardboard]: 'Картон',
      [TrashType.Glass]: 'Стекло',
      [TrashType.Metal]: 'Металл',
      [TrashType.Paper]: 'Бумага',
      [TrashType.Plastic]: 'Пластик',
      [TrashType.Trash]: 'Общий мусор',
      [TrashType.Undefined]: 'Не определено',
    };
    return labels[type] || type;
  };

  const getPrimaryTrashType = (result: Record<string, number>): string => {
    const entries = Object.entries(result);
    if (entries.length === 0) return TrashType.Undefined;

    const [primaryType] = entries.reduce((max, current) => (current[1] > max[1] ? current : max));

    return primaryType;
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Сканирование мусора</Text>
            <Text style={styles.subtitle}>Наведите камеру на объект</Text>
          </View>

          {/* Result Display */}
          {result && result.result && (
            <View style={styles.resultContainer}>
              <View style={styles.resultCard}>
                <Feather name="check-circle" size={32} color="#4CAF50" />
                <Text style={styles.resultTitle}>Анализ завершён</Text>
                <Text style={styles.resultType}>
                  {getTrashTypeLabel(getPrimaryTrashType(result.result))}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setResult(null)}>
                  <Feather name="x" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Loading Overlay */}
          {isAnalyzing && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingCard}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Анализ изображения...</Text>
              </View>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Feather name="rotate-cw" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={isAnalyzing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.flipButton} />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  resultContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    position: 'relative',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#263238',
    marginTop: 16,
    marginBottom: 8,
  },
  resultType: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9E9E9E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FAFAFA',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#263238',
    marginTop: 24,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: '#546E7A',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
