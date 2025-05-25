export const storage = {
  get: async <T>(key: string): Promise<T | undefined> => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  remove: async (key: string): Promise<void> => {
    sessionStorage.removeItem(key);
  },

  clear: async (): Promise<void> => {
    sessionStorage.clear();
  }
};