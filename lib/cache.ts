type CacheData = {
  data: any;
  timestamp: number;
};

const cache = new Map<string, CacheData>();

export const getCache = (key: string): any | null => {
  const cached = cache.get(key);
  if (!cached) return null;

  const cacheDuration = parseInt(process.env.CACHE_DURATION || '3600');
  const now = Date.now();
  
  if (now - cached.timestamp > cacheDuration * 1000) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

export const setCache = (key: string, data: any): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const clearCache = (): void => {
  cache.clear();
};

export const getCacheSize = (): number => {
  return cache.size;
};

export const removeCacheItem = (key: string): boolean => {
  return cache.delete(key);
};

export const getCacheKeys = (): string[] => {
  return Array.from(cache.keys());
}; 