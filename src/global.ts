import Taro from "@tarojs/taro";

const globalData = {};

export function setGlobalData(key: string, value: any): void {
  globalData[key] = value;
  Taro.setStorageSync(key, value);
}

export function getGlobalData(key: string): any {
  const value = globalData[key] || Taro.getStorageSync(key);
  return value;
}

export function delGlobalData(key: string): void {
  delete globalData[key];
  Taro.removeStorageSync(key);
}

export function clearGlobalData(): void {
  for (const key of Object.keys(globalData)) {
    delGlobalData(key);
  }
  Taro.clearStorageSync();
}
