import Taro from "@tarojs/taro";

const remoteLogger = Taro.getRealtimeLogManager();

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
  info(message?: string, ...args: any[]): void {
    remoteLogger.info(...[message, ...args]);
  }
  error(message?: string, ...args: any[]): void {
    remoteLogger.error(...[message, ...args]);
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
  log.addHandler(new RemoteHandler());
  return log;
}

export const logger = getLogger();
