// In-memory store for Expo Go fallback
let memoryCookies: Record<string, string> = {};

// Mock implementation for Expo Go or when native module is missing
const MockCookieManager = {
    flush: async () => {
        // No-op
    },
    clearAll: async () => {
        memoryCookies = {};
    },
    get: async (_url: string) => {
        return memoryCookies;
    },
    set: async (_url: string, cookie: any) => {
        if (cookie && cookie.name) {
            memoryCookies[cookie.name] = cookie.value;
        }
        return true;
    },
    setFromResponse: async (_url: string, cookie: string) => {
        // Simple parsing of "name=value; ..."
        const parts = cookie.split(';');
        if (parts.length > 0) {
            const [name, value] = parts[0].split('=');
            if (name) {
                memoryCookies[name.trim()] = value ? value.trim() : '';
            }
        }
        return true;
    },
    getAll: async () => {
        return memoryCookies;
    },
    // Custom helper to extract cookies from Axios headers
    extractFromHeaders: (headers: any) => {
        const setCookie = headers['set-cookie'] || headers['Set-Cookie'];
        if (setCookie) {
            if (Array.isArray(setCookie)) {
                setCookie.forEach((c: string) => MockCookieManager.setFromResponse('', c));
            } else if (typeof setCookie === 'string') {
                MockCookieManager.setFromResponse('', setCookie);
            }
        }
    },
    // Custom helper to get Cookie header string
    getCookieString: () => {
        return Object.entries(memoryCookies)
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');
    }
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
