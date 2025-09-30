import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Button } from '../components/Button';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const toggleMode = () => setIsLogin((prev) => !prev);

  const handleSubmit = () => {
    onAuthenticated();
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1750451187464-90febd11576f?auto=format&fit=crop&w=1200&q=80',
      }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrapper}>
            <View style={styles.logoCircle}>
              <FontAwesome5 name="leaf" size={36} color="#ffffff" />
            </View>
            <Text style={styles.title}>Анализатор мусора</Text>
            <Text style={styles.subtitle}>Забота об экологии начинается с вас</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{isLogin ? 'Войти в аккаунт' : 'Создать аккаунт'}</Text>

            {!isLogin && (
              <TextInput
                placeholder="Ваше имя"
                value={formData.name}
                onChangeText={(name) => setFormData((prev) => ({ ...prev, name }))}
                style={styles.input}
                placeholderTextColor="#9E9E9E"
              />
            )}

            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(email) => setFormData((prev) => ({ ...prev, email }))}
              style={styles.input}
              placeholderTextColor="#9E9E9E"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Пароль"
                value={formData.password}
                onChangeText={(password) => setFormData((prev) => ({ ...prev, password }))}
                style={[styles.input, styles.passwordInput]}
                placeholderTextColor="#9E9E9E"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#616161" />
              </TouchableOpacity>
            </View>

            <Button
              label={isLogin ? 'Войти' : 'Зарегистрироваться'}
              onPress={handleSubmit}
              style={styles.submitButton}
            />

            <TouchableOpacity onPress={toggleMode} style={styles.switchMode}>
              <Text style={styles.switchModeText}>
                {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Используя приложение, вы соглашаетесь с условиями использования
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#607D8B',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 15,
    color: '#212121',
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 44,
  },
  passwordToggle: {
    position: 'absolute',
    right: 14,
    top: 16,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 14,
  },
  switchMode: {
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 13,
    color: '#00BCD4',
  },
  footerText: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 12,
    color: '#90A4AE',
  },
});
