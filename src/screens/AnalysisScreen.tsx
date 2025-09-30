import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface AnalysisScreenProps {
  imageUri: string | null;
  onRepeat: () => void;
  onFindPoints: () => void;
}

const analysisResult = {
  type: 'Пластик',
  category: 'PET-бутылка',
  recommendation: 'Отправить в контейнер для пластика',
  confidence: 95,
};

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  imageUri,
  onRepeat,
  onFindPoints,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          label=""
          variant="ghost"
          iconName="arrow-left"
          onPress={onRepeat}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Результат анализа</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrapper}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={36} color="#9E9E9E" />
            </View>
          )}
        </View>

        <Card style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultIcon}>
              <Feather name="check-circle" size={24} color="#4CAF50" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultType}>{analysisResult.type}</Text>
              <Text style={styles.resultCategory}>{analysisResult.category}</Text>
            </View>
          </View>

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>Рекомендация</Text>
            <Text style={styles.recommendationText}>{analysisResult.recommendation}</Text>
          </View>

          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>Уверенность</Text>
            <View style={styles.confidenceBarBg}>
              <View
                style={[styles.confidenceBarFill, { width: `${analysisResult.confidence}%` }]}
              />
            </View>
            <Text style={styles.confidenceValue}>{analysisResult.confidence}%</Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button label="Повторить анализ" iconName="refresh-ccw" onPress={onRepeat} />
          <Button
            label="Найти пункт утилизации"
            variant="outline"
            iconName="map-pin"
            onPress={onFindPoints}
          />
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eeeeee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 260,
    height: 260,
    borderRadius: 24,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    gap: 18,
  },
  resultHeader: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  resultIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  resultCategory: {
    marginTop: 4,
    color: '#78909C',
    fontSize: 14,
  },
  recommendationBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    padding: 16,
    borderRadius: 16,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  recommendationText: {
    color: '#455A64',
    fontSize: 14,
    lineHeight: 20,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#90A4AE',
  },
  confidenceBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
  },
  actions: {
    gap: 12,
  },
});
