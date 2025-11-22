import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { useUser } from '../hooks/useUser';
import { getUserStatusInfo } from '../utils/userStatus';
import { getTrashTypeInfo, getPrimaryTrashType } from '../utils/trashTypes';
import { predictionsApi } from '../api/predictions';
import { PredictionResponse, PredictionStatus } from '../types/api';
import { API_CONFIG } from '../config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INITIAL_LIMIT = 6;

export const StatsScreen: React.FC = () => {
  const { user, isLoading } = useUser();
  const [scans, setScans] = useState<PredictionResponse[]>([]);
  const [scansLimit, setScansLimit] = useState(INITIAL_LIMIT);
  const [isLoadingScans, setIsLoadingScans] = useState(false);
  const [selectedScan, setSelectedScan] = useState<PredictionResponse | null>(null);

  useEffect(() => {
    loadScans();
  }, [scansLimit]);

  const loadScans = async () => {
    setIsLoadingScans(true);
    try {
      const data = await predictionsApi.getPredictions(scansLimit, 0);
      setScans(data);
    } catch (error) {
      console.error('[StatsScreen] Error loading scans:', error);
    } finally {
      setIsLoadingScans(false);
    }
  };

  if (isLoading && !user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const stats = user?.stat || {
    files_scanned: 0,
    total_weight: 0,
    rating: 0,
    status: 'newbie',
    trash_by_types: {},
  };

  const statusInfo = getUserStatusInfo(stats.status, stats.rating) as ReturnType<
    typeof getUserStatusInfo
  > & { progress: number };

  const totalItems = (Object.values(stats.trash_by_types || {}) as number[]).reduce(
    (a, b) => a + b,
    0
  );

  const wasteTypes = (Object.entries(stats.trash_by_types || {}) as [string, number][])
    .map(([type, count]) => ({
      type,
      typeInfo: getTrashTypeInfo(type),
      count,
      percentage: totalItems > 0 ? (count / totalItems) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const showMore = () => setScansLimit((prev) => prev + 6);
  const showLess = () => setScansLimit(INITIAL_LIMIT);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="bar-chart-2" size={22} color="#4CAF50" />
        <Text style={styles.headerTitle}>Статистика</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={[styles.summaryCard, { backgroundColor: 'rgba(76, 175, 80, 0.08)' }]}>
            <View style={styles.summaryIconWrapper}>
              <View style={[styles.summaryIcon, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                <Feather name="camera" size={18} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.summaryValue}>{stats.files_scanned}</Text>
                <Text style={styles.summaryLabel}>Сканов</Text>
              </View>
            </View>
          </Card>

          <Card style={[styles.summaryCard, { backgroundColor: 'rgba(0, 188, 212, 0.08)' }]}>
            <View style={styles.summaryIconWrapper}>
              <View style={[styles.summaryIcon, { backgroundColor: 'rgba(0, 188, 212, 0.2)' }]}>
                <Feather name="trending-up" size={18} color="#00BCD4" />
              </View>
              <View>
                <Text style={styles.summaryValue}>{stats.rating}</Text>
                <Text style={styles.summaryLabel}>Рейтинг</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* User Status Badge */}
        <Card>
          <View style={styles.statusBadge}>
            <View style={styles.statusIconContainer}>
              <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusLabel}>Ваш статус</Text>
              <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
              {statusInfo.nextLevel && (
                <>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${statusInfo.progress}%`, backgroundColor: statusInfo.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {stats.rating} / {statusInfo.nextLevel.requiredRating} до "
                    {statusInfo.nextLevel.label}"
                  </Text>
                </>
              )}
            </View>
          </View>
        </Card>

        {/* Trash Types Distribution */}
        <Card>
          <Text style={styles.sectionTitle}>Типы отходов</Text>
          <View style={styles.wasteList}>
            {wasteTypes.length > 0 ? (
              wasteTypes.map((item) => (
                <View key={item.type} style={styles.wasteItem}>
                  <View style={styles.wasteRow}>
                    <View style={styles.wasteTypeRow}>
                      <Text style={styles.wasteIcon}>{item.typeInfo.icon}</Text>
                      <Text style={styles.wasteType}>{item.typeInfo.label}</Text>
                    </View>
                    <Text style={styles.wasteCount}>
                      {item.count} ({item.percentage.toFixed(0)}%)
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: item.typeInfo.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Данных пока нет</Text>
            )}
          </View>
        </Card>

        {/* Scans History */}
        <Card>
          <Text style={styles.sectionTitle}>История сканирования</Text>
          {isLoadingScans && scans.length === 0 ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : scans.length > 0 ? (
            <>
              <View style={styles.scansGrid}>
                {scans.map((scan) => {
                  const imageUrl = scan.scan_key
                    ? `${API_CONFIG.STORAGE_URL}/${API_CONFIG.STORAGE_BUCKET}/${scan.scan_key}`
                    : null;
                  const { type, confidence } =
                    scan.result && Object.keys(scan.result).length > 0
                      ? getPrimaryTrashType(scan.result)
                      : { type: 'undefined', confidence: 0 };
                  const typeInfo = getTrashTypeInfo(type);

                  return (
                    <TouchableOpacity
                      key={scan.id}
                      style={styles.scanCard}
                      onPress={() => setSelectedScan(scan)}
                    >
                      {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.scanImage} />
                      ) : (
                        <View style={[styles.scanImage, styles.scanImagePlaceholder]}>
                          <Feather name="image" size={32} color="#9E9E9E" />
                        </View>
                      )}
                      <View style={styles.scanInfo}>
                        <View style={styles.scanStatusBadge}>
                          <View
                            style={[
                              styles.scanStatusDot,
                              {
                                backgroundColor:
                                  scan.status === PredictionStatus.Completed
                                    ? '#4CAF50'
                                    : scan.status === PredictionStatus.Failed
                                      ? '#F44336'
                                      : '#FF9800',
                              },
                            ]}
                          />
                          <Text style={styles.scanStatusText}>
                            {scan.status === PredictionStatus.Completed
                              ? 'Готово'
                              : scan.status === PredictionStatus.Failed
                                ? 'Ошибка'
                                : 'Обработка'}
                          </Text>
                        </View>
                        {scan.status === PredictionStatus.Completed && (
                          <View style={styles.scanTypeRow}>
                            <Text style={styles.scanTypeIcon}>{typeInfo.icon}</Text>
                            <Text style={styles.scanTypeLabel}>{typeInfo.label}</Text>
                            <Text style={styles.scanConfidence}>
                              {(confidence * 100).toFixed(0)}%
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.paginationButtons}>
                {scans.length >= scansLimit && (
                  <TouchableOpacity style={styles.paginationButton} onPress={showMore}>
                    <Feather name="chevron-down" size={18} color="#4CAF50" />
                    <Text style={styles.paginationButtonText}>Показать ещё</Text>
                  </TouchableOpacity>
                )}
                {scansLimit > INITIAL_LIMIT && (
                  <TouchableOpacity style={styles.paginationButton} onPress={showLess}>
                    <Feather name="chevron-up" size={18} color="#4CAF50" />
                    <Text style={styles.paginationButtonText}>Скрыть</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Сканов пока нет</Text>
          )}
        </Card>
      </ScrollView>

      {/* Full-screen Image Modal */}
      {selectedScan && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedScan(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedScan(null)}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedScan(null)}
              >
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
              {selectedScan.scan_key ? (
                <Image
                  source={{
                    uri: `${API_CONFIG.STORAGE_URL}/${API_CONFIG.STORAGE_BUCKET}/${selectedScan.scan_key}`,
                  }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.modalImagePlaceholder}>
                  <Feather name="image" size={64} color="#fff" />
                  <Text style={styles.modalPlaceholderText}>Изображение недоступно</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 32,
  },
  statusLabel: {
    fontSize: 14,
    color: '#78909C',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ECEFF1',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
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
  wasteTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wasteIcon: {
    fontSize: 20,
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
  emptyText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    paddingVertical: 16,
  },
  scansGrid: {
    gap: 12,
  },
  scanCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  scanImage: {
    width: 100,
    height: 100,
    backgroundColor: '#F5F5F5',
  },
  scanImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  scanStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scanStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scanStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#546E7A',
  },
  scanTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scanTypeIcon: {
    fontSize: 18,
  },
  scanTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#263238',
    flex: 1,
  },
  scanConfidence: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  paginationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  modalImagePlaceholder: {
    alignItems: 'center',
    gap: 16,
  },
  modalPlaceholderText: {
    fontSize: 16,
    color: '#fff',
  },
});
