/** @format */

import Taro from "@tarojs/taro";
import { logger } from "./log";

export function getBetterAvatar(avatarUrl: string): string {
  if (avatarUrl.endsWith("/132")) {
    return avatarUrl.substring(0, avatarUrl.length - 3) + "0";
  }
  return avatarUrl;
}

async function rawSaveTempFileToAlbum(tempFilePath: string) {
  try {
    await Taro.saveImageToPhotosAlbum({
      filePath: tempFilePath
    });

    Taro.showToast({
      title: "保存至相册成功"
    });
  } catch (err) {
    Taro.showToast({
      title: "保存至相册失败",
      icon: "none"
    });
  }
}

async function showSettingsModal() {
  try {
    const res = await Taro.showModal({
      title: "授权",
      content: "授权失败，打开用户授权设置"
    });

    if (res.confirm) {
      await Taro.openSetting();
    }
  } catch (err) {}
}

export async function saveCanvasToAlbum(canvasId: string) {
  const res = await Taro.canvasToTempFilePath({
    canvasId: canvasId
  });
  const { tempFilePath } = res;
  if (isMiniApp()) {
    const settings = await Taro.getSetting();
    if (settings.authSetting["scope.writePhotosAlbum"]) {
      await rawSaveTempFileToAlbum(tempFilePath);
    } else {
      try {
        await Taro.authorize({
          scope: "scope.writePhotosAlbum"
        });

        await rawSaveTempFileToAlbum(tempFilePath);
      } catch (err) {
        showSettingsModal();
      }
    }
  } else if (isH5App()) {
    const now = new Date();
    const tmpValues = [
      "avatar",
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    ];
    const filename = tmpValues.join("_") + ".png";
    //将图片保存到本地
    const link = document.createElement("a");
    link.href = tempFilePath;
    link.download = filename;
    link.click();
  }
}

export async function convertBlobToImage(url: any) {
  if (typeof url !== "string" || !isH5App()) {
    return new Promise((resolve, reject) => {
      resolve(url);
    });
  }

  if (url.startsWith("blob:")) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
      image.id = `taro_cropper_${Date.now()}`;
      image.style.display = "none";
      document.body.append(image);
      image.onload = () => resolve(image);
      image.onerror = () => reject(image);
    });
  }
  return new Promise((resolve, reject) => {
    resolve(url);
  });
}

export async function downloadFile(url: any) {
  if (typeof url !== "string") {
    return url;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const task = await Taro.downloadFile({
        url
      });
      return await convertBlobToImage(task.tempFilePath);
    } catch (err) {
      logger.error("下载URL内容失败:", err);
      throw err;
    }
  } else if (url.startsWith("cloud://")) {
    try {
      const response = await Taro.cloud.downloadFile({
        fileID: url
      });
      return await convertBlobToImage(response.tempFilePath);
    } catch (err) {
      logger.error("下载云存储文件失败:", err);
      throw err;
    }
  }
  return url;
}

export async function getUserInfoAndDownloadAvatar() {
  // https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801
  // 公共内容表示2021-4-13 之后每次获取用户信息都需要授权，在已经授权的情况下直接获取会返回匿名信息
  try {
    const settings = await Taro.getSetting();

    if (!settings.authSetting["scope.userInfo"]) return;
    try {
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      const response = await Taro.getUserInfo();
      const {
        userInfo: { avatarUrl }
      } = response;
      const avatarPath = downloadFile(getBetterAvatar(avatarUrl));
      return avatarPath;
    } catch (err) {
      logger.error("获取用户信息失败:", err);
    }
  } catch (err) {}
}

export function checkFileExists(path: string): boolean {
  if (isMiniApp()) {
    const fs = Taro.getFileSystemManager();
    try {
      fs.accessSync(path);
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
}

export function isMiniApp() {
  return process.env.TARO_ENV === "weapp";
}

export function isH5App() {
  return process.env.TARO_ENV === "h5";
}
