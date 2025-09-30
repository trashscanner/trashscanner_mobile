import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';

const stats = {
  totalAnalyzed: 127,
  totalRecycled: 45.2,
  weeklyGrowth: 12,
  rank: 'Эко-активист',
};

const wasteTypes = [
  { type: 'Пластик', count: 54, percentage: 42, color: '#4CAF50' },
  { type: 'Стекло', count: 28, percentage: 22, color: '#00BCD4' },
  { type: 'Бумага', count: 25, percentage: 20, color: '#FF9800' },
  { type: 'Металл', count: 20, percentage: 16, color: '#9C27B0' },
];

export const StatsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="bar-chart-2" size={22} color="#4CAF50" />
        <Text style={styles.headerTitle}>Статистика</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryGrid}>
          <Card style={[styles.summaryCard, { backgroundColor: 'rgba(76, 175, 80, 0.08)' }]}>
            <View style={styles.summaryIconWrapper}>
              <View style={[styles.summaryIcon, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                <Feather name="refresh-cw" size={18} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.summaryValue}>{stats.totalAnalyzed}</Text>
                <Text style={styles.summaryLabel}>Проанализировано</Text>
              </View>
            </View>
          </Card>

          <Card style={[styles.summaryCard, { backgroundColor: 'rgba(0, 188, 212, 0.08)' }]}>
            <View style={styles.summaryIconWrapper}>
              <View style={[styles.summaryIcon, { backgroundColor: 'rgba(0, 188, 212, 0.2)' }]}>
                <Feather name="trending-up" size={18} color="#00BCD4" />
              </View>
              <View>
                <Text style={styles.summaryValue}>{stats.totalRecycled}</Text>
                <Text style={styles.summaryLabel}>кг переработано</Text>
              </View>
            </View>
          </Card>
        </View>

        <Card>
          <View style={styles.rankHeader}>
            <View style={styles.rankIconWrapper}>
              <Feather name="award" size={22} color="#4CAF50" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rankTitle}>Ваш статус</Text>
              <Text style={styles.rankValue}>{stats.rank}</Text>
              <View style={styles.rankTrend}>
                <Feather name="trending-up" size={14} color="#00BCD4" />
                <Text style={styles.rankTrendText}>+{stats.weeklyGrowth}% за неделю</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Типы отходов</Text>
          <View style={styles.wasteList}>
            {wasteTypes.map((item) => (
              <View key={item.type} style={styles.wasteItem}>
                <View style={styles.wasteRow}>
                  <Text style={styles.wasteType}>{item.type}</Text>
                  <Text style={styles.wasteCount}>{item.count}</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <View style={styles.goalHeader}>
            <Text style={styles.sectionTitle}>Цель недели</Text>
            <Text style={styles.goalValue}>7/10</Text>
          </View>
          <View style={styles.progressBarBgLarge}>
            <View style={[styles.progressBarFillLarge, { width: '70%' }]} />
          </View>
          <Text style={styles.goalLabel}>Проанализировать 10 предметов</Text>
        </Card>
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
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  content: {
    padding: 24,
    paddingBottom: 80,
    gap: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
    flex: 1,
  },
  summaryIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#263238',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#78909C',
    marginTop: 2,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  rankIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#37474F',
  },
  rankValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 4,
  },
  rankTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  rankTrendText: {
    fontSize: 12,
    color: '#78909C',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 16,
  },
  wasteList: {
    gap: 16,
  },
  wasteItem: {
    gap: 8,
  },
  wasteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wasteType: {
    fontSize: 14,
    color: '#37474F',
  },
  wasteCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#263238',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ECEFF1',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  progressBarBgLarge: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#ECEFF1',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFillLarge: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  goalLabel: {
    fontSize: 13,
    color: '#78909C',
  },
});
