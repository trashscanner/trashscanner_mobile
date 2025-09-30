import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export type BottomTabKey = 'camera' | 'stats' | 'map' | 'profile';

interface NavigationBarProps {
  active: BottomTabKey;
  onNavigate: (key: BottomTabKey) => void;
}

const NAV_ITEMS: Array<{
  key: BottomTabKey;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
}> = [
  { key: 'camera', label: 'Камера', icon: 'camera' },
  { key: 'stats', label: 'Статистика', icon: 'bar-chart-2' },
  { key: 'map', label: 'Карта', icon: 'map-pin' },
  { key: 'profile', label: 'Профиль', icon: 'user' },
];

export const NavigationBar: React.FC<NavigationBarProps> = ({ active, onNavigate }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onNavigate(item.key)}
              activeOpacity={0.8}
              style={[styles.item, isActive && styles.itemActive]}
            >
              <Feather name={item.icon} size={22} color={isActive ? '#4CAF50' : '#9E9E9E'} />
              <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 16,
  },
  itemActive: {
    backgroundColor: '#E8F5E9',
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: '#9E9E9E',
  },
  labelActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
