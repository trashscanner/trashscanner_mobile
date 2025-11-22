import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { API_CONFIG } from '../config/api';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { user, isLoading, uploadAvatar, deleteAvatar } = useUser();
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch {
      Alert.alert('Ошибка', 'Не удалось выйти из системы');
    }
  };

  const handleAvatarPress = async () => {
    Alert.alert('Аватар', 'Выберите действие', [
      {
        text: 'Загрузить новый',
        onPress: pickImage,
      },
      {
        text: 'Удалить текущий',
        onPress: handleDeleteAvatar,
        style: 'destructive',
      },
      {
        text: 'Отмена',
        style: 'cancel',
      },
    ]);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        await uploadAvatar(result.assets[0].uri);
      } catch {
        Alert.alert('Ошибка', 'Не удалось загрузить аватар');
      }
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
    } catch {
      Alert.alert('Ошибка', 'Не удалось удалить аватар');
    }
  };

  if (isLoading && !user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!user) return null;

  const initials = (user.name || user.login || '?')
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarUrl = user.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : `${API_CONFIG.STORAGE_URL}/${API_CONFIG.STORAGE_BUCKET}/${user.avatar}`
    : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="user" size={22} color="#4CAF50" />
        <Text style={styles.headerTitle}>Профиль</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.profileRow}>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Avatar uri={avatarUrl} initials={initials} size={72} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name || 'Пользователь'}</Text>
              <Text style={styles.userEmail}>{user.login}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusLabel}>{user.stat?.status || 'Новичок'}</Text>
              </View>
            </View>
            <Feather name="settings" size={18} color="#9E9E9E" />
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              {user.stat?.files_scanned || 0}
            </Text>
            <Text style={styles.statLabel}>Анализов</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#00BCD4' }]}>
              {user.stat?.total_weight?.toFixed(1) || 0}
            </Text>
            <Text style={styles.statLabel}>кг</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#FF9800' }]}>{user.stat?.rating || 0}</Text>
            <Text style={styles.statLabel}>Рейтинг</Text>
          </Card>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Настройки</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <View style={styles.settingIcon}>
                <Feather name="bell" size={16} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Уведомления</Text>
                <Text style={styles.settingSubtitle}>Push-уведомления и напоминания</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? '#4CAF50' : '#f1f1f1'}
              trackColor={{ true: 'rgba(76, 175, 80, 0.4)', false: '#ECEFF1' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <View style={styles.settingIcon}>
                <Feather name="globe" size={16} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Язык</Text>
                <Text style={styles.settingSubtitle}>Русский</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#B0BEC5" />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <View style={styles.settingIcon}>
                <Feather name="moon" size={16} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Тёмная тема</Text>
                <Text style={styles.settingSubtitle}>Автоматически</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? '#4CAF50' : '#f1f1f1'}
              trackColor={{ true: 'rgba(76, 175, 80, 0.4)', false: '#ECEFF1' }}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Достижения</Text>
          <View style={styles.achievementsRow}>
            {['🌱', '♻️', '🏆', '⭐', '🌍'].map((emoji) => (
              <View key={emoji} style={styles.achievementBadge}>
                <Text style={styles.achievementEmoji}>{emoji}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Button
          label="Выйти"
          onPress={handleLogout}
          variant="outline"
          iconName="log-out"
          style={styles.logoutButton}
          textStyle={{ color: '#E53935' }}
        />
      </ScrollView>
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
    paddingBottom: 100,
    gap: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#263238',
  },
  userEmail: {
    fontSize: 13,
    color: '#78909C',
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  statusLabel: {
    fontSize: 11,
    color: '#4CAF50',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#78909C',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECEFF1',
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#37474F',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#90A4AE',
    marginTop: 2,
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementEmoji: {
    fontSize: 22,
  },
  logoutButton: {
    borderColor: '#FFCDD2',
    backgroundColor: 'rgba(255, 205, 210, 0.12)',
  },
});
