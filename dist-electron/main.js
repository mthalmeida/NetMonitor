import { ipcMain, app, BrowserWindow, Notification, nativeImage, Tray, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import https from "node:https";
import http from "node:http";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
function createTrayIcon(status) {
  const size = 32;
  const canvas = Buffer.alloc(size * size * 4);
  let color;
  switch (status) {
    case "connected":
      color = { r: 34, g: 197, b: 94 };
      break;
    case "disconnected":
      color = { r: 239, g: 68, b: 68 };
      break;
    case "monitoring":
      color = { r: 251, g: 146, b: 60 };
      break;
  }
  const centerX = size / 2;
  const centerY = size / 2 + 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let alpha = 0;
      if (dist >= 3 && dist <= 4.5 && dy <= 0) {
        alpha = 255;
      } else if (dist >= 5.5 && dist <= 7 && dy <= 0) {
        alpha = 220;
      } else if (dist >= 8.5 && dist <= 10 && dy <= 0) {
        alpha = 180;
      } else if (dist <= 2) {
        alpha = 255;
      }
      if (alpha > 0) {
        canvas[idx] = color.r;
        canvas[idx + 1] = color.g;
        canvas[idx + 2] = color.b;
        canvas[idx + 3] = alpha;
      } else {
        canvas[idx] = 0;
        canvas[idx + 1] = 0;
        canvas[idx + 2] = 0;
        canvas[idx + 3] = 0;
      }
    }
  }
  return nativeImage.createFromBuffer(canvas, { width: size, height: size });
}
function showConnectionErrorNotification(message) {
  const now = Date.now();
  if (now - lastNotificationTime < NOTIFICATION_COOLDOWN_MS) {
    return;
  }
  lastNotificationTime = now;
  if (!Notification.isSupported()) {
    console.warn("Notificações não são suportadas neste sistema");
    return;
  }
  const iconSize = 64;
  const iconCanvas = Buffer.alloc(iconSize * iconSize * 4);
  const centerX = iconSize / 2;
  const centerY = iconSize / 2;
  for (let y = 0; y < iconSize; y++) {
    for (let x = 0; x < iconSize; x++) {
      const idx = (y * iconSize + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= iconSize / 2 - 2) {
        iconCanvas[idx] = 239;
        iconCanvas[idx + 1] = 68;
        iconCanvas[idx + 2] = 68;
        iconCanvas[idx + 3] = 255;
        if (Math.abs(dx) < 8 && Math.abs(dy) < 2 || Math.abs(dy) < 8 && Math.abs(dx) < 2 || Math.abs(dx - dy) < 2 && Math.abs(dx) < 10 || Math.abs(dx + dy) < 2 && Math.abs(dx) < 10) {
          iconCanvas[idx] = 255;
          iconCanvas[idx + 1] = 255;
          iconCanvas[idx + 2] = 255;
        }
      } else {
        iconCanvas[idx] = 0;
        iconCanvas[idx + 1] = 0;
        iconCanvas[idx + 2] = 0;
        iconCanvas[idx + 3] = 0;
      }
    }
  }
  const notification = new Notification({
    title: "NetMonitor - Problema de Conexão",
    body: message,
    icon: nativeImage.createFromBuffer(iconCanvas, { width: iconSize, height: iconSize }),
    urgency: "critical",
    timeoutType: "default"
  });
  notification.on("click", () => {
    if (win) {
      win.show();
      win.focus();
    } else {
      createWindow();
    }
  });
  notification.show();
}
function updateTrayIcon(status) {
  if (!tray) return;
  const icon = createTrayIcon(status);
  tray.setImage(icon);
  let tooltip = "NetMonitor";
  switch (status) {
    case "connected":
      tooltip = "NetMonitor - Conectado";
      break;
    case "disconnected":
      tooltip = "NetMonitor - Desconectado";
      break;
    case "monitoring":
      tooltip = "NetMonitor - Monitorando";
      break;
  }
  tray.setToolTip(tooltip);
  updateTrayMenu();
}
function detectPingError(line) {
  const lowerLine = line.toLowerCase();
  if (lowerLine.includes("esgotado") || lowerLine.includes("timed out") || lowerLine.includes("request timed out")) {
    return { isError: true, message: "Timeout: conexão não respondeu" };
  }
  if (lowerLine.includes("unreachable") || lowerLine.includes("inacess") || lowerLine.includes("destination host unreachable")) {
    return { isError: true, message: "Host inacessível: verifique a conexão" };
  }
  if (lowerLine.includes("falha") || lowerLine.includes("general failure") || lowerLine.includes("failure")) {
    return { isError: true, message: "Falha de conexão detectada" };
  }
  return { isError: false };
}
function startMonitoring() {
  if (pingProcess) return;
  isMonitoring = true;
  updateTrayIcon("monitoring");
  pingProcess = spawn("ping", ["8.8.8.8", "-t"]);
  win == null ? void 0 : win.webContents.send("ping-status-changed", { running: true });
  pingProcess.stdout.on("data", (data) => {
    const dataStr = data.toString();
    win == null ? void 0 : win.webContents.send("ping-data", dataStr);
    const lines = dataStr.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const errorInfo = detectPingError(line);
      if (errorInfo.isError && errorInfo.message) {
        showConnectionErrorNotification(errorInfo.message);
        break;
      }
    }
  });
  pingProcess.stderr.on("data", (data) => {
    const errorStr = data.toString();
    console.error(`Erro Ping: ${errorStr}`);
    const errorInfo = detectPingError(errorStr);
    if (errorInfo.isError && errorInfo.message) {
      showConnectionErrorNotification(errorInfo.message);
    }
  });
  pingProcess.on("close", () => {
    pingProcess = null;
    isMonitoring = false;
    updateTrayIcon("disconnected");
    win == null ? void 0 : win.webContents.send("ping-status-changed", { running: false });
  });
}
function stopMonitoring() {
  if (pingProcess) {
    pingProcess.kill();
    pingProcess = null;
    isMonitoring = false;
    updateTrayIcon("disconnected");
    win == null ? void 0 : win.webContents.send("ping-status-changed", { running: false });
  }
}
function updateTrayMenu() {
  if (!tray) return;
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Abrir NetMonitor",
      click: () => {
        if (win) {
          win.show();
          win.focus();
        } else {
          createWindow();
        }
      }
    },
    { type: "separator" },
    {
      label: isMonitoring ? "Pausar Monitoramento" : "Iniciar Monitoramento",
      click: () => {
        if (isMonitoring) {
          stopMonitoring();
        } else {
          startMonitoring();
        }
      }
    },
    {
      label: "Executar Teste de Velocidade",
      click: () => {
        if (win) {
          win.show();
          win.focus();
        } else {
          createWindow();
        }
        setTimeout(() => {
          win == null ? void 0 : win.webContents.send("tray-start-speed-test");
        }, 500);
      }
    },
    { type: "separator" },
    {
      label: "Sair",
      click: () => {
        if (pingProcess) pingProcess.kill();
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
}
function createTray() {
  const icon = createTrayIcon("disconnected");
  tray = new Tray(icon);
  updateTrayMenu();
  tray.on("click", () => {
    if (win) {
      win.show();
      win.focus();
    } else {
      createWindow();
    }
  });
}
let win = null;
let pingProcess = null;
let speedTestAbortController = null;
let tray = null;
let isMonitoring = false;
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN_MS = 3e4;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 1200,
    height: 800,
    minWidth: 1200,
    maxWidth: 1200,
    minHeight: 800,
    maxHeight: 800,
    resizable: false,
    maximizable: false,
    frame: false,
    titleBarStyle: "hidden",
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.setMenuBarVisibility(false);
  win.on("maximize", () => {
    win == null ? void 0 : win.restore();
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
ipcMain.on("start-ping", () => {
  startMonitoring();
});
ipcMain.on("stop-ping", () => {
  stopMonitoring();
});
async function measureDownloadSpeed(url, durationMs = 1e4) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let totalBytes = 0;
    let lastProgressUpdate = Date.now();
    const protocol = url.startsWith("https:") ? https : http;
    const request = protocol.get(url, { signal: speedTestAbortController == null ? void 0 : speedTestAbortController.signal }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.on("data", (chunk) => {
        totalBytes += chunk.length;
        const now = Date.now();
        const elapsed = now - startTime;
        if (now - lastProgressUpdate > 100) {
          const currentSpeed = totalBytes * 8 / (elapsed / 1e3) / 1e6;
          win == null ? void 0 : win.webContents.send("speed-test-data", {
            type: "download-progress",
            download: currentSpeed,
            progress: Math.min(100, elapsed / durationMs * 100)
          });
          lastProgressUpdate = now;
        }
        if (elapsed >= durationMs) {
          response.destroy();
          const finalSpeed = totalBytes * 8 / (elapsed / 1e3) / 1e6;
          resolve({ speed: finalSpeed, progress: 100 });
        }
      });
      response.on("end", () => {
        const elapsed = Date.now() - startTime;
        const finalSpeed = totalBytes * 8 / (elapsed / 1e3) / 1e6;
        resolve({ speed: finalSpeed, progress: 100 });
      });
      response.on("error", reject);
    });
    request.on("error", reject);
  });
}
async function measureUploadSpeed(url, dataSizeMB = 25) {
  return new Promise((resolve, reject) => {
    const dataSize = Math.floor(dataSizeMB * 1024 * 1024);
    const chunkSize = 64 * 1024;
    const data = Buffer.alloc(chunkSize, "A");
    let uploadedBytes = 0;
    const startTime = Date.now();
    let lastProgressUpdate = Date.now();
    const protocol = url.startsWith("https:") ? https : http;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": dataSize.toString()
      },
      signal: speedTestAbortController == null ? void 0 : speedTestAbortController.signal
    };
    const request = protocol.request(url, options, (response) => {
      response.on("data", () => {
      });
      response.on("end", () => {
        const elapsed = Date.now() - startTime;
        const finalSpeed = uploadedBytes * 8 / (elapsed / 1e3) / 1e6;
        resolve({ speed: finalSpeed, progress: 100 });
      });
      response.on("error", reject);
    });
    request.on("error", reject);
    const MIN_BYTES_FOR_CALC = 512 * 1024;
    const MIN_TIME_FOR_CALC = 500;
    function updateProgress() {
      const now = Date.now();
      const elapsed = now - startTime;
      if (elapsed >= MIN_TIME_FOR_CALC && uploadedBytes >= MIN_BYTES_FOR_CALC && elapsed > 0) {
        const currentSpeed = uploadedBytes * 8 / (elapsed / 1e3) / 1e6;
        win == null ? void 0 : win.webContents.send("speed-test-data", {
          type: "upload-progress",
          upload: currentSpeed,
          progress: Math.min(100, uploadedBytes / dataSize * 100)
        });
        lastProgressUpdate = now;
      }
    }
    function sendChunk() {
      if (speedTestAbortController == null ? void 0 : speedTestAbortController.signal.aborted) {
        request.destroy();
        reject(new Error("Aborted"));
        return;
      }
      const toSend = Math.min(chunkSize, dataSize - uploadedBytes);
      if (toSend <= 0) {
        request.end();
        return;
      }
      const canContinue = request.write(data.slice(0, toSend));
      uploadedBytes += toSend;
      const now = Date.now();
      if (now - lastProgressUpdate >= 100) {
        updateProgress();
      }
      if (!canContinue) {
        request.once("drain", () => {
          sendChunk();
        });
      } else {
        setImmediate(sendChunk);
      }
    }
    sendChunk();
  });
}
async function measurePing(host = "https://www.google.com") {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    const protocol = host.startsWith("https:") ? https : http;
    const url = new URL(host.startsWith("http") ? host : `https://${host}`);
    const request = protocol.get({
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: "/",
      timeout: 5e3,
      signal: speedTestAbortController == null ? void 0 : speedTestAbortController.signal
    }, () => {
      const endTime = process.hrtime.bigint();
      const latency = Number(endTime - startTime) / 1e6;
      resolve(latency);
    });
    request.on("error", () => {
      resolve(999);
    });
    request.on("timeout", () => {
      request.destroy();
      resolve(999);
    });
  });
}
ipcMain.on("start-speed-test", async () => {
  if (speedTestAbortController) {
    speedTestAbortController.abort();
  }
  speedTestAbortController = new AbortController();
  try {
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "start" });
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "ping-start" });
    const ping = await measurePing();
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "ping-complete", ping });
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "download-start" });
    const downloadResult = await measureDownloadSpeed("https://speed.cloudflare.com/__down?bytes=50000000", 1e4);
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "download-complete", download: downloadResult.speed });
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "upload-start" });
    const uploadResult = await measureUploadSpeed("https://speed.cloudflare.com/__up", 25);
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "upload-complete", upload: uploadResult.speed });
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "complete" });
  } catch (error) {
    if (error.name !== "AbortError") {
      win == null ? void 0 : win.webContents.send("speed-test-data", { type: "error", error: error.message });
    }
  } finally {
    speedTestAbortController = null;
  }
});
ipcMain.on("stop-speed-test", () => {
  if (speedTestAbortController) {
    speedTestAbortController.abort();
    speedTestAbortController = null;
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "stopped" });
  }
});
ipcMain.on("window-minimize", () => {
  win == null ? void 0 : win.minimize();
});
ipcMain.on("window-close", () => {
  if (win) {
    win.hide();
  }
});
ipcMain.on("update-connection-status", (_event, status) => {
  updateTrayIcon(status);
});
ipcMain.on("show-connection-error-notification", (_event, message) => {
  showConnectionErrorNotification(message);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (win) {
      win.hide();
    }
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  createTray();
  app.on("before-quit", (event) => {
    if (win && !win.isDestroyed()) {
      event.preventDefault();
      win.hide();
    }
  });
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
