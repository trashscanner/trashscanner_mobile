export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://0.0.0.0:8080/api/v1',
  STORAGE_URL: process.env.EXPO_PUBLIC_STORAGE_URL || 'http://31.207.74.207:9000',
  STORAGE_BUCKET: process.env.EXPO_PUBLIC_STORAGE_BUCKET || 'trashscanner-images',
  TIMEOUT: 15000,
};
