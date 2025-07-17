
export const APP_KEY = 'SimplePaystub.com';
export const STORAGE_KEYS = {
  FORM_DATA: `${APP_KEY}.form`,
  PAYSTUB_HISTORY: `${APP_KEY}.history`
}

const FIVE_MB = 5 * 1024 * 1024;

export class LocalStorageManager {
  static setItem(key: string, value: any): boolean {
    try {
      const serialized = JSON.stringify(value);

      if (serialized.length > FIVE_MB) {
        console.warn('Data exceeds recommended size limit')
      }
      localStorage.setItem(key, serialized)
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to parse localStorage data:', error);
      return defaultValue;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  static getStorageSize(): number {
    try {
      let totalSize = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      });
      return totalSize;
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
      return 0;
    }
  }
}