export const API_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === 'test'
      ? process.env.EXPO_PUBLIC_API_URL_TEST || process.env.EXPO_PUBLIC_API_URL
      : process.env.EXPO_PUBLIC_API_URL || 'http://31.207.74.207:8080/api/v1',
  STORAGE_URL:
    process.env.NODE_ENV === 'test'
      ? process.env.EXPO_PUBLIC_STORAGE_URL_TEST || process.env.EXPO_PUBLIC_STORAGE_URL
      : process.env.EXPO_PUBLIC_STORAGE_URL || 'http://31.207.74.207:9000',
  STORAGE_BUCKET:
    process.env.NODE_ENV === 'test'
      ? process.env.EXPO_PUBLIC_STORAGE_BUCKET_TEST || process.env.EXPO_PUBLIC_STORAGE_BUCKET
      : process.env.EXPO_PUBLIC_STORAGE_BUCKET || 'trashscanner-images',
  TIMEOUT: 15000,
};

// Debug logging - will be stripped in production builds
if (__DEV__) {
  console.log('🔧 API Configuration:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  BASE_URL:', API_CONFIG.BASE_URL);
  console.log('  STORAGE_URL:', API_CONFIG.STORAGE_URL);
  console.log('  STORAGE_BUCKET:', API_CONFIG.STORAGE_BUCKET);
  console.log('  Available env vars:');
  console.log('    EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
  console.log('    EXPO_PUBLIC_API_URL_TEST:', process.env.EXPO_PUBLIC_API_URL_TEST);
}
