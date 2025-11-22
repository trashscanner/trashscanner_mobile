// Mock implementation for Expo Go or when native module is missing
const MockCookieManager = {
    flush: async () => {
        console.warn('CookieManager.flush: Native module not found (running in Expo Go?)');
    },
    clearAll: async () => {
        console.warn('CookieManager.clearAll: Native module not found (running in Expo Go?)');
    },
    get: async (_url: string) => {
        console.warn('CookieManager.get: Native module not found (running in Expo Go?)');
        return {};
    },
    set: async (_url: string, _cookie: any) => {
        console.warn('CookieManager.set: Native module not found (running in Expo Go?)');
        return true;
    },
    setFromResponse: async (_url: string, _cookie: string) => {
        console.warn('CookieManager.setFromResponse: Native module not found (running in Expo Go?)');
        return true;
    },
    getAll: async () => {
        console.warn('CookieManager.getAll: Native module not found (running in Expo Go?)');
        return {};
    },
};

let SafeCookieManager = MockCookieManager;

try {
    // Use require to avoid top-level import crash if native module is missing
    // We check if the module can be required
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const CookieManagerModule = require('@react-native-cookies/cookies').default;
    if (CookieManagerModule) {
        SafeCookieManager = CookieManagerModule;
    }
} catch {
    console.warn('Failed to load @react-native-cookies/cookies, falling back to mock.');
}

export default SafeCookieManager;
