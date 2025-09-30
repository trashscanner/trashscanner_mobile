import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

const recyclingPoints = [
  {
    id: 1,
    name: 'Эко-центр Зелёный',
    address: 'ул. Ленина, 45',
    distance: '0.3 км',
    types: ['Пластик', 'Стекло', 'Бумага'],
    isOpen: true,
  },
  {
    id: 2,
    name: 'Пункт сбора MetalCorp',
    address: 'пр. Мира, 12',
    distance: '0.7 км',
    types: ['Металл', 'Батарейки'],
    isOpen: true,
  },
  {
    id: 3,
    name: 'Городской экопункт',
    address: 'ул. Садовая, 88',
    distance: '1.2 км',
    types: ['Пластик', 'Бумага', 'Одежда'],
    isOpen: false,
  },
];

export const MapScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="map-pin" size={22} color="#4CAF50" />
        <Text style={styles.headerTitle}>Пункты утилизации</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color="#9E9E9E" style={styles.searchIcon} />
        <TextInput
          placeholder="Введите адрес..."
          placeholderTextColor="#9E9E9E"
          style={styles.searchInput}
        />
        <Feather name="sliders" size={18} color="#4CAF50" style={styles.filterIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mapPlaceholder}>
          <View style={[styles.mapMarker, { top: 30, left: 40, backgroundColor: '#4CAF50' }]} />
          <View style={[styles.mapMarker, { top: 80, right: 60, backgroundColor: '#00BCD4' }]} />
          <View style={[styles.mapMarker, { bottom: 30, left: 80, backgroundColor: '#FF9800' }]} />
        </View>

        <Text style={styles.sectionTitle}>Ближайшие пункты</Text>
        {recyclingPoints.map((point) => (
          <Card key={point.id} style={styles.pointCard}>
            <View style={styles.pointHeader}>
              <View>
                <Text style={styles.pointName}>{point.name}</Text>
                <Text style={styles.pointAddress}>{point.address}</Text>
              </View>
              <View style={styles.pointMeta}>
                <Text style={styles.pointDistance}>{point.distance}</Text>
                <Text style={[styles.pointStatus, { color: point.isOpen ? '#4CAF50' : '#E53935' }]}>
                  {point.isOpen ? 'Открыто' : 'Закрыто'}
                </Text>
              </View>
            </View>
            <View style={styles.badgesRow}>
              {point.types.map((type) => (
                <Badge key={type} label={type} />
              ))}
            </View>
          </Card>
        ))}
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
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  searchWrapper: {
    margin: 20,
    position: 'relative',
  },
  searchInput: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingLeft: 44,
    paddingRight: 44,
    fontSize: 14,
    color: '#212121',
    backgroundColor: '#ffffff',
  },
  searchIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  filterIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },
  mapPlaceholder: {
    height: 160,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  mapMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
  },
  pointCard: {
    gap: 12,
  },
  pointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  pointName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  pointAddress: {
    fontSize: 13,
    color: '#78909C',
  },
  pointMeta: {
    alignItems: 'flex-end',
  },
  pointDistance: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00BCD4',
  },
  pointStatus: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
