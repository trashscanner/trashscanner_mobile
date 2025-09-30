import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

interface ProfileScreenProps {
  onLogout: () => void;
}

const user = {
  name: "Анна Петрова",
  email: "anna.petrova@email.com",
  avatar:
    "https://images.unsplash.com/photo-1494790108755-2616c13488ac?auto=format&fit=crop&w=200&q=80",
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const initials = user.name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="user" size={22} color="#4CAF50" />
        <Text style={styles.headerTitle}>Профиль</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.profileRow}>
            <Avatar uri={user.avatar} initials={initials} size={72} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusLabel}>Эко-активист</Text>
              </View>
            </View>
            <Feather name="settings" size={18} color="#9E9E9E" />
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: "#4CAF50" }]}>127</Text>
            <Text style={styles.statLabel}>Анализов</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: "#00BCD4" }]}>45.2</Text>
            <Text style={styles.statLabel}>кг</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: "#FF9800" }]}>15</Text>
            <Text style={styles.statLabel}>Дней</Text>
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
                <Text style={styles.settingSubtitle}>
                  Push-уведомления и напоминания
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? "#4CAF50" : "#f1f1f1"}
              trackColor={{ true: "rgba(76, 175, 80, 0.4)", false: "#ECEFF1" }}
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
              thumbColor={darkMode ? "#4CAF50" : "#f1f1f1"}
              trackColor={{ true: "rgba(76, 175, 80, 0.4)", false: "#ECEFF1" }}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Достижения</Text>
          <View style={styles.achievementsRow}>
            {["🌱", "♻️", "🏆", "⭐", "🌍"].map((emoji) => (
              <View key={emoji} style={styles.achievementBadge}>
                <Text style={styles.achievementEmoji}>{emoji}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Button
          label="Выйти"
          onPress={onLogout}
          variant="outline"
          iconName="log-out"
          style={styles.logoutButton}
          textStyle={{ color: "#E53935" }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  content: {
    padding: 24,
    paddingBottom: 100,
    gap: 18,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#263238",
  },
  userEmail: {
    fontSize: 13,
    color: "#78909C",
    marginTop: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },
  statusLabel: {
    fontSize: 11,
    color: "#4CAF50",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: "#78909C",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#263238",
    marginBottom: 18,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ECEFF1",
  },
  settingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(76, 175, 80, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#37474F",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#90A4AE",
    marginTop: 2,
  },
  achievementsRow: {
    flexDirection: "row",
    gap: 12,
  },
  achievementBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  achievementEmoji: {
    fontSize: 22,
  },
  logoutButton: {
    borderColor: "#FFCDD2",
    backgroundColor: "rgba(255, 205, 210, 0.12)",
  },
});
