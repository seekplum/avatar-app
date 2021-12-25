import Taro from "@tarojs/taro";
import { isMiniApp } from "./constants";

class BasicLogHandler {
  info(message?: string, ...args: any[]): void {}
  error(message?: string, ...args: any[]): void {}
}

class LocalHandler extends BasicLogHandler {
  info(message?: string, ...args: any[]): void {
    console.log(message, ...args);
  }
  error(message?: string, ...args: any[]): void {
    console.error(message, ...args);
  }
}
class RemoteHandler extends BasicLogHandler {
  remoteLogger = Taro.getRealtimeLogManager();
  info(message?: string, ...args: any[]): void {
    this.remoteLogger.info(...[message, ...args]);
  }
  error(message?: string, ...args: any[]): void {
    this.remoteLogger.error(...[message, ...args]);
  }
}

class LogManager {
  handles: BasicLogHandler[] = [];

  info(message?: string, ...args: any[]): void {
    for (const handle of this.handles) {
      handle.info(message, ...args);
    }
  }
  error(message?: string, ...args: any[]): void {
    for (const handle of this.handles) {
      handle.error(message, ...args);
    }
  }

  addHandler(handle: any) {
    this.handles.push(handle);
  }
}

function getLogger() {
  const log = new LogManager();
  log.addHandler(new LocalHandler());
  if (isMiniApp) {
    log.addHandler(new RemoteHandler());
  }
  return log;
}

export const logger = getLogger();
