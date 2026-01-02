/**
 * Logger Utility
 * Only logs in development mode to keep production clean
 */

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

export const logger = {
    log: (...args) => {
        if (isDev) {
            console.log('[DEV]', ...args);
        }
    },

    info: (...args) => {
        if (isDev) {
            console.info('[INFO]', ...args);
        }
    },

    warn: (...args) => {
        if (isDev) {
            console.warn('[WARN]', ...args);
        }
    },

    error: (...args) => {
        // Always log errors, even in production
        console.error('[ERROR]', ...args);
    },

    debug: (...args) => {
        if (isDev) {
            console.debug('[DEBUG]', ...args);
        }
    },

    // For wallet/blockchain operations
    wallet: (...args) => {
        if (isDev) {
            console.log('[WALLET]', ...args);
        }
    },

    // For API calls
    api: (...args) => {
        if (isDev) {
            console.log('[API]', ...args);
        }
    },
};

export default logger;
