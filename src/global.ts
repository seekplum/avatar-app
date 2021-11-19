import Taro from "@tarojs/taro";

const globalData = {};

function getTime() {
  return new Date().valueOf();
}

function generateData(value: string, ex?: number): string {
  const now = getTime();
  const deadline = typeof ex === "number" ? now + ex * 1000 : -1;
  return JSON.stringify({
    value,
    deadline
  });
}

function parseData(value: string): string {
  const now = getTime();
  try {
    const data = JSON.parse(value);
    if (data.deadline && (data.deadline === -1 || data.deadline > now)) {
      return data.value;
    }
  } catch (err) {}
  return "";
}

export function setGlobalData(key: string, value: any, ex?: number): void {
  const data = generateData(value, ex);
  globalData[key] = data;
  Taro.setStorageSync(key, data);
}

export function getGlobalData(key: string): any {
  const value = globalData[key] || Taro.getStorageSync(key);
  if (value) {
    return parseData(value);
  }
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
