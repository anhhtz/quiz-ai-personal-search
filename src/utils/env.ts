export const isDevelopment = (): boolean => {
    return process.env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
    return process.env.NODE_ENV === 'production';
};

export const isTest = (): boolean => {
    return process.env.NODE_ENV === 'test';
};

export const getNodeEnv = (): string => {
    return process.env.NODE_ENV || 'development';
};

export const isServer = (): boolean => {
    return typeof window === 'undefined';
};

export const isClient = (): boolean => {
    return !isServer();
};