import { ipcMain, app, BrowserWindow, Notification, nativeImage, Tray, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import https from "node:https";
import http from "node:http";
import crypto from "node:crypto";
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
  const appIconPath = path.join(process.env.APP_ROOT, "src", "assets", "ico_app.ico");
  win = new BrowserWindow({
    icon: appIconPath,
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
const SPEED_TEST_WARMUP_MS = 1e3;
const SPEED_TEST_PROGRESS_MS = 200;
const DOWNLOAD_INITIAL_CONNECTIONS_PER_ENDPOINT = 8;
const DOWNLOAD_MAX_CONNECTIONS_PER_ENDPOINT = 24;
const DOWNLOAD_CONNECTION_RAMP_MS = 700;
const DOWNLOAD_ROLLING_WINDOW_MS = 2500;
const CURL_DOWNLOAD_CONNECTIONS_PER_ENDPOINT = 12;
const DOWNLOAD_TEST_URLS = [
  "https://speed.cloudflare.com/__down?bytes=1000000000",
  "https://proof.ovh.net/files/1Gb.dat",
  "https://speed.hetzner.de/1GB.bin",
  "https://cachefly.cachefly.net/100mb.test"
];
function bytesToMbps(bytes, elapsedMs) {
  return bytes * 8 / Math.max(1e-3, elapsedMs / 1e3) / 1e6;
}
function createAbortError() {
  const error = new Error("Teste cancelado");
  error.name = "AbortError";
  return error;
}
function isAbortError(error) {
  return error instanceof Error && (error.name === "AbortError" || error.message === "Aborted");
}
function getProtocol(url) {
  return url.startsWith("https:") ? https : http;
}
async function measureDownloadSpeedWithCurl(urls, durationMs) {
  return new Promise((resolve, reject) => {
    const curlCommand = process.platform === "win32" ? "curl.exe" : "curl";
    const nullDevice = process.platform === "win32" ? "NUL" : "/dev/null";
    const startedAt = Date.now();
    let output = "";
    let errorOutput = "";
    let settled = false;
    const args = [
      "--location",
      "--http1.1",
      "--silent",
      "--show-error",
      "--parallel",
      "--parallel-immediate",
      "--parallel-max",
      String(urls.length * CURL_DOWNLOAD_CONNECTIONS_PER_ENDPOINT),
      "--connect-timeout",
      "5",
      "--max-time",
      String(Math.ceil(durationMs / 1e3))
    ];
    for (const url of urls) {
      for (let i = 0; i < CURL_DOWNLOAD_CONNECTIONS_PER_ENDPOINT; i += 1) {
        const separator = url.includes("?") ? "&" : "?";
        args.push(
          "--output",
          nullDevice,
          "--write-out",
          "%{speed_download}\n",
          `${url}${separator}nonce=${Date.now()}-${i}`
        );
      }
    }
    const curl = spawn(curlCommand, args, {
      windowsHide: true
    });
    const cleanup = () => {
      clearInterval(progressTimer);
      clearTimeout(safetyTimer);
      speedTestAbortController == null ? void 0 : speedTestAbortController.signal.removeEventListener("abort", abortHandler);
    };
    const finish = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) {
        reject(error);
        return;
      }
      const speedsBytesPerSecond = output.split(/\r?\n/).map((line) => Number(line.trim())).filter((value) => Number.isFinite(value) && value > 0);
      if (speedsBytesPerSecond.length === 0) {
        reject(new Error(errorOutput.trim() || "curl não retornou velocidade de download"));
        return;
      }
      const speed = speedsBytesPerSecond.reduce((sum, value) => sum + value, 0) * 8 / 1e6;
      resolve({ speed, progress: 100 });
    };
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      win == null ? void 0 : win.webContents.send("speed-test-data", {
        type: "download-progress",
        download: null,
        progress: Math.min(99, elapsed / durationMs * 100)
      });
    }, SPEED_TEST_PROGRESS_MS);
    const safetyTimer = setTimeout(() => {
      if (!curl.killed) curl.kill();
    }, durationMs + 4e3);
    const abortHandler = () => {
      if (!curl.killed) curl.kill();
      finish(createAbortError());
    };
    speedTestAbortController == null ? void 0 : speedTestAbortController.signal.addEventListener("abort", abortHandler, { once: true });
    curl.stdout.on("data", (data) => {
      output += data.toString();
    });
    curl.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    curl.on("error", (error) => finish(error));
    curl.on("close", (code) => {
      if (code !== 0 && code !== 28 && output.trim().length === 0) {
        finish(new Error(errorOutput.trim() || `curl finalizou com código ${code}`));
        return;
      }
      finish();
    });
  });
}
async function measureDownloadSpeed(urls, durationMs = 1e4) {
  return new Promise((resolve, reject) => {
    const endpointUrls = Array.isArray(urls) ? urls : [urls];
    const startTime = Date.now();
    let totalBytes = 0;
    let warmupBytesBase = null;
    let settled = false;
    let activeConnections = 0;
    let lastError = null;
    let startedConnectionsPerEndpoint = 0;
    let bestMeasuredSpeed = 0;
    const speedSamples = [];
    const requests = [];
    const responses = [];
    const signal = speedTestAbortController == null ? void 0 : speedTestAbortController.signal;
    const maxConnectionCount = endpointUrls.length * DOWNLOAD_MAX_CONNECTIONS_PER_ENDPOINT;
    const agents = /* @__PURE__ */ new Map();
    let progressTimer;
    let rampTimer;
    let finishTimer;
    const calculateSpeed = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < SPEED_TEST_WARMUP_MS) return 0;
      speedSamples.push({ elapsedMs: elapsed, bytes: totalBytes });
      while (speedSamples.length > 2 && elapsed - speedSamples[0].elapsedMs > DOWNLOAD_ROLLING_WINDOW_MS * 2) {
        speedSamples.shift();
      }
      const windowStart = [...speedSamples].reverse().find((sample) => elapsed - sample.elapsedMs >= DOWNLOAD_ROLLING_WINDOW_MS);
      const baselineBytes = warmupBytesBase ?? 0;
      const rollingSpeed = windowStart ? bytesToMbps(totalBytes - windowStart.bytes, elapsed - windowStart.elapsedMs) : bytesToMbps(Math.max(0, totalBytes - baselineBytes), elapsed - SPEED_TEST_WARMUP_MS);
      if (rollingSpeed > bestMeasuredSpeed) {
        bestMeasuredSpeed = rollingSpeed;
      }
      return rollingSpeed;
    };
    const cleanup = () => {
      if (progressTimer) clearInterval(progressTimer);
      if (rampTimer) clearInterval(rampTimer);
      if (finishTimer) clearTimeout(finishTimer);
      signal == null ? void 0 : signal.removeEventListener("abort", abortHandler);
      for (const request of requests) request.destroy();
      for (const response of responses) response.destroy();
      for (const agent of agents.values()) agent.destroy();
    };
    const finish = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) {
        reject(error);
        return;
      }
      const averageSpeed = bytesToMbps(Math.max(0, totalBytes - (warmupBytesBase ?? 0)), Date.now() - startTime - SPEED_TEST_WARMUP_MS);
      const speed = Math.max(bestMeasuredSpeed, averageSpeed);
      if (speed <= 0 && lastError) {
        reject(lastError);
        return;
      }
      resolve({ speed, progress: 100 });
    };
    const abortHandler = () => finish(createAbortError());
    signal == null ? void 0 : signal.addEventListener("abort", abortHandler, { once: true });
    progressTimer = setInterval(() => {
      if (settled) return;
      const elapsed = Date.now() - startTime;
      if (elapsed >= SPEED_TEST_WARMUP_MS && warmupBytesBase == null) {
        warmupBytesBase = totalBytes;
      }
      win == null ? void 0 : win.webContents.send("speed-test-data", {
        type: "download-progress",
        download: calculateSpeed(),
        progress: Math.min(99, elapsed / durationMs * 100)
      });
    }, SPEED_TEST_PROGRESS_MS);
    rampTimer = setInterval(() => {
      if (settled || startedConnectionsPerEndpoint >= DOWNLOAD_MAX_CONNECTIONS_PER_ENDPOINT) return;
      startConnections(4);
    }, DOWNLOAD_CONNECTION_RAMP_MS);
    finishTimer = setTimeout(() => finish(), durationMs);
    const onConnectionEnded = () => {
      activeConnections -= 1;
      if (activeConnections <= 0 && totalBytes === 0 && lastError) {
        finish(lastError);
      }
    };
    const getAgent = (url) => {
      const protocolName = url.startsWith("https:") ? "https" : "http";
      const existing = agents.get(protocolName);
      if (existing) return existing;
      const agent = protocolName === "https" ? new https.Agent({ keepAlive: false, maxSockets: maxConnectionCount }) : new http.Agent({ keepAlive: false, maxSockets: maxConnectionCount });
      agents.set(protocolName, agent);
      return agent;
    };
    const startConnection = (baseUrl, index) => {
      if (settled) return;
      const separator = baseUrl.includes("?") ? "&" : "?";
      const requestUrl = `${baseUrl}${separator}nonce=${Date.now()}-${index}`;
      activeConnections += 1;
      try {
        const protocol = getProtocol(requestUrl);
        const requestOptions = {
          agent: getAgent(requestUrl),
          signal,
          highWaterMark: 1024 * 1024,
          headers: {
            "Cache-Control": "no-store, no-cache",
            "Pragma": "no-cache",
            "Connection": "keep-alive"
          }
        };
        const request = protocol.get(requestUrl, requestOptions, (response) => {
          responses.push(response);
          const statusCode = response.statusCode ?? 0;
          if (statusCode < 200 || statusCode >= 300) {
            lastError = new Error(`HTTP ${statusCode} no download`);
            response.resume();
            onConnectionEnded();
            return;
          }
          response.on("data", (chunk) => {
            if (settled) return;
            totalBytes += chunk.length;
          });
          response.on("end", onConnectionEnded);
          response.on("error", (error) => {
            lastError = error;
            onConnectionEnded();
          });
        });
        requests.push(request);
        request.on("error", (error) => {
          if (settled || isAbortError(error)) return;
          lastError = error;
          onConnectionEnded();
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Falha ao iniciar conexão de download");
        onConnectionEnded();
      }
    };
    function startConnections(countPerEndpoint) {
      const remaining = DOWNLOAD_MAX_CONNECTIONS_PER_ENDPOINT - startedConnectionsPerEndpoint;
      const nextCount = Math.min(countPerEndpoint, remaining);
      if (nextCount <= 0) return;
      for (const url of endpointUrls) {
        for (let i = 0; i < nextCount; i += 1) {
          startConnection(url, startedConnectionsPerEndpoint + i);
        }
      }
      startedConnectionsPerEndpoint += nextCount;
    }
    startConnections(DOWNLOAD_INITIAL_CONNECTIONS_PER_ENDPOINT);
  });
}
function uploadPayload(url, payload) {
  return new Promise((resolve, reject) => {
    const protocol = getProtocol(url);
    const signal = speedTestAbortController == null ? void 0 : speedTestAbortController.signal;
    const startTime = Date.now();
    let settled = false;
    const request = protocol.request(url, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": payload.length,
        "Cache-Control": "no-store, no-cache",
        "Pragma": "no-cache",
        "Connection": "keep-alive"
      }
    }, (response) => {
      response.resume();
      response.on("end", () => {
        if (settled) return;
        settled = true;
        const statusCode = response.statusCode ?? 0;
        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`HTTP ${statusCode} no upload`));
          return;
        }
        resolve(Date.now() - startTime);
      });
      response.on("error", (error) => {
        if (settled) return;
        settled = true;
        reject(error);
      });
    });
    request.on("error", (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });
    request.end(payload);
  });
}
async function measureUploadSpeed(url, durationMs = 1e4) {
  const payloadSizes = [512 * 1024, 1024 * 1024, 2 * 1024 * 1024, 4 * 1024 * 1024, 8 * 1024 * 1024];
  const payloadCache = /* @__PURE__ */ new Map();
  const startTime = Date.now();
  let measuredBytes = 0;
  let measuredElapsedMs = 0;
  let lastSpeed = 0;
  let lastError = null;
  const getPayload = (size) => {
    const cached = payloadCache.get(size);
    if (cached) return cached;
    const payload = crypto.randomBytes(size);
    payloadCache.set(size, payload);
    return payload;
  };
  const reportProgress = () => {
    const elapsed = Date.now() - startTime;
    win == null ? void 0 : win.webContents.send("speed-test-data", {
      type: "upload-progress",
      upload: lastSpeed,
      progress: Math.min(99, elapsed / durationMs * 100)
    });
  };
  while (Date.now() - startTime < durationMs) {
    if (speedTestAbortController == null ? void 0 : speedTestAbortController.signal.aborted) throw createAbortError();
    const elapsed = Date.now() - startTime;
    const nextSize = elapsed < SPEED_TEST_WARMUP_MS ? payloadSizes[0] : payloadSizes[Math.min(payloadSizes.length - 1, Math.max(1, Math.floor(lastSpeed / 35)))];
    try {
      const requestElapsedMs = await uploadPayload(url, getPayload(nextSize));
      if (Date.now() - startTime >= SPEED_TEST_WARMUP_MS) {
        measuredBytes += nextSize;
        measuredElapsedMs += requestElapsedMs;
        lastSpeed = bytesToMbps(measuredBytes, measuredElapsedMs);
        reportProgress();
      }
    } catch (error) {
      if (isAbortError(error)) throw error;
      lastError = error;
      break;
    }
  }
  if (measuredBytes === 0) {
    throw lastError instanceof Error ? lastError : new Error("Falha no teste de upload");
  }
  return { speed: bytesToMbps(measuredBytes, measuredElapsedMs), progress: 100 };
}
async function measureDownloadWithFallback(durationMs) {
  try {
    return await measureDownloadSpeedWithCurl(DOWNLOAD_TEST_URLS, durationMs);
  } catch (error) {
    if (isAbortError(error)) throw error;
    console.warn("Teste de download com curl falhou; usando fallback Node:", error);
  }
  try {
    return await measureDownloadSpeed(DOWNLOAD_TEST_URLS, durationMs);
  } catch (error) {
    if (isAbortError(error)) throw error;
  }
  let lastError = null;
  for (const url of DOWNLOAD_TEST_URLS) {
    try {
      return await measureDownloadSpeed(url, durationMs);
    } catch (error) {
      if (isAbortError(error)) throw error;
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Falha no teste de download");
}
async function measureUploadWithFallback(durationMs) {
  const urls = [
    "https://speed.cloudflare.com/__up",
    "https://httpbin.org/post"
  ];
  let lastError = null;
  for (const url of urls) {
    try {
      return await measureUploadSpeed(url, durationMs);
    } catch (error) {
      if (isAbortError(error)) throw error;
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Falha no teste de upload");
}
function extractPingTimes(output) {
  const matches = output.matchAll(/(?:tempo|time)[=<]?\s*(\d+(?:[.,]\d+)?)\s*ms/gi);
  const values = [];
  for (const match of matches) {
    const value = Number(match[1].replace(",", "."));
    if (Number.isFinite(value)) values.push(value);
  }
  return values;
}
async function measurePing(host = "1.1.1.1", count = 4) {
  return new Promise((resolve) => {
    const isWindows = process.platform === "win32";
    const args = isWindows ? ["-n", String(count), "-w", "1200", host] : ["-c", String(count), "-W", "1", host];
    const pingCmd = spawn("ping", args);
    let output = "";
    let settled = false;
    const MAX_PING_TIME_MS = 8e3;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(safetyTimeout);
      resolve(value);
    };
    const safetyTimeout = setTimeout(() => {
      if (!pingCmd.killed) pingCmd.kill();
      finish(999);
    }, MAX_PING_TIME_MS);
    const abortHandler = () => {
      if (!pingCmd.killed) pingCmd.kill();
      finish(999);
    };
    speedTestAbortController == null ? void 0 : speedTestAbortController.signal.addEventListener("abort", abortHandler, { once: true });
    pingCmd.stdout.on("data", (data) => {
      output += data.toString();
    });
    pingCmd.stderr.on("data", (data) => {
      output += data.toString();
    });
    pingCmd.on("error", () => {
      speedTestAbortController == null ? void 0 : speedTestAbortController.signal.removeEventListener("abort", abortHandler);
      finish(999);
    });
    pingCmd.on("close", () => {
      speedTestAbortController == null ? void 0 : speedTestAbortController.signal.removeEventListener("abort", abortHandler);
      const samples = extractPingTimes(output);
      if (samples.length === 0) {
        finish(999);
        return;
      }
      const avg = samples.reduce((acc, v) => acc + v, 0) / samples.length;
      finish(avg);
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
    const pingRaw = await measurePing("1.1.1.1", 4);
    const ping = Number.isFinite(pingRaw) ? pingRaw : 999;
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "ping-complete", ping });
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "download-start" });
    const downloadResult = await measureDownloadWithFallback(1e4);
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "download-complete", download: downloadResult.speed });
    win == null ? void 0 : win.webContents.send("speed-test-data", { type: "upload-start" });
    const uploadResult = await measureUploadWithFallback(1e4);
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
