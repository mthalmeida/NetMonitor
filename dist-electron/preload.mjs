"use strict";
const electron = require("electron");
const api = {
  startPing: () => electron.ipcRenderer.send("start-ping"),
  stopPing: () => electron.ipcRenderer.send("stop-ping"),
  onPingData: (callback) => {
    const subscription = (_event, value) => callback(value);
    electron.ipcRenderer.on("ping-data", subscription);
    return () => {
      electron.ipcRenderer.removeListener("ping-data", subscription);
    };
  },
  startSpeedTest: () => electron.ipcRenderer.send("start-speed-test"),
  stopSpeedTest: () => electron.ipcRenderer.send("stop-speed-test"),
  onSpeedTestData: (callback) => {
    const subscription = (_event, value) => callback(value);
    electron.ipcRenderer.on("speed-test-data", subscription);
    return () => {
      electron.ipcRenderer.removeListener("speed-test-data", subscription);
    };
  },
  minimizeWindow: () => electron.ipcRenderer.send("window-minimize"),
  closeWindow: () => electron.ipcRenderer.send("window-close"),
  updateConnectionStatus: (status) => {
    electron.ipcRenderer.send("update-connection-status", status);
  },
  onTrayStartSpeedTest: (callback) => {
    const subscription = () => callback();
    electron.ipcRenderer.on("tray-start-speed-test", subscription);
    return () => {
      electron.ipcRenderer.removeListener("tray-start-speed-test", subscription);
    };
  },
  onPingStatusChanged: (callback) => {
    const subscription = (_event, value) => callback(value);
    electron.ipcRenderer.on("ping-status-changed", subscription);
    return () => {
      electron.ipcRenderer.removeListener("ping-status-changed", subscription);
    };
  },
  showConnectionErrorNotification: (message) => {
    electron.ipcRenderer.send("show-connection-error-notification", message);
  }
};
try {
  electron.contextBridge.exposeInMainWorld("electron", api);
} catch (error) {
  console.error(error);
}
