// import { Cache } from 'file-system-cache';
import { Redis } from '@upstash/redis';

const isDev = process.env.NODE_ENV === 'development';

class NoopCache {
    async get(_key: string) {
        return undefined;
    }
    async set(_key: string, _value: unknown, _opts?: any) {
        return 'OK';
    }
    async del(_key: string) {
        return 1;
    }
    async incr(_key: string) {
        return 0;
    }
    async decr(_key: string) {
        return 0;
    }
    // Add more methods as needed to match Redis interface
}

const redis = Redis.fromEnv();

// export redis as 'cache', or NoopCache in development
// export const cache = isDev ? new NoopCache() : redis;
const cache = redis;

export default cache;