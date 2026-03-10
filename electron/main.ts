import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import https from 'node:https'
import http from 'node:http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// Função para criar ícones do system tray - ícone de rede/monitoramento moderno
function createTrayIcon(status: 'connected' | 'disconnected' | 'monitoring'): Electron.NativeImage {
  const size = 32 // Tamanho maior para melhor qualidade
  const canvas = Buffer.alloc(size * size * 4)
  
  let color: { r: number; g: number; b: number }
  switch (status) {
    case 'connected':
      color = { r: 34, g: 197, b: 94 } // Verde #22c55e
      break
    case 'disconnected':
      color = { r: 239, g: 68, b: 68 } // Vermelho #ef4444
      break
    case 'monitoring':
      color = { r: 251, g: 146, b: 60 } // Laranja #fb923c
      break
  }
  
  // Desenhar ícone de ondas de sinal Wi-Fi (estilo moderno)
  const centerX = size / 2
  const centerY = size / 2 + 2 // Ligeiramente abaixo do centro
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const dx = x - centerX
      const dy = y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      let alpha = 0
      
      // Desenhar ondas de sinal (semicírculos concêntricos, estilo Wi-Fi)
      // Onda 1 (menor, mais próxima do centro)
      if (dist >= 3 && dist <= 4.5 && dy <= 0) {
        alpha = 255
      }
      // Onda 2 (média)
      else if (dist >= 5.5 && dist <= 7 && dy <= 0) {
        alpha = 220
      }
      // Onda 3 (maior)
      else if (dist >= 8.5 && dist <= 10 && dy <= 0) {
        alpha = 180
      }
      // Ponto central (indicador de conexão)
      else if (dist <= 2) {
        alpha = 255
      }
      
      if (alpha > 0) {
        canvas[idx] = color.r
        canvas[idx + 1] = color.g
        canvas[idx + 2] = color.b
        canvas[idx + 3] = alpha
      } else {
        canvas[idx] = 0
        canvas[idx + 1] = 0
        canvas[idx + 2] = 0
        canvas[idx + 3] = 0
      }
    }
  }
  
  return nativeImage.createFromBuffer(canvas, { width: size, height: size })
}

function showConnectionErrorNotification(message: string) {
  const now = Date.now()
  
  // Evitar spam de notificações - só enviar se passou o cooldown
  if (now - lastNotificationTime < NOTIFICATION_COOLDOWN_MS) {
    return
  }
  
  lastNotificationTime = now
  
  // Verificar se as notificações estão disponíveis
  if (!Notification.isSupported()) {
    console.warn('Notificações não são suportadas neste sistema')
    return
  }
  
  // Criar ícone simples para a notificação
  const iconSize = 64
  const iconCanvas = Buffer.alloc(iconSize * iconSize * 4)
  const centerX = iconSize / 2
  const centerY = iconSize / 2
  
  for (let y = 0; y < iconSize; y++) {
    for (let x = 0; x < iconSize; x++) {
      const idx = (y * iconSize + x) * 4
      const dx = x - centerX
      const dy = y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist <= iconSize / 2 - 2) {
        // Círculo vermelho
        iconCanvas[idx] = 239     // R
        iconCanvas[idx + 1] = 68  // G
        iconCanvas[idx + 2] = 68  // B
        iconCanvas[idx + 3] = 255 // A
        
        // Desenhar X branco no centro
        if ((Math.abs(dx) < 8 && Math.abs(dy) < 2) || (Math.abs(dy) < 8 && Math.abs(dx) < 2) ||
            (Math.abs(dx - dy) < 2 && Math.abs(dx) < 10) || (Math.abs(dx + dy) < 2 && Math.abs(dx) < 10)) {
          iconCanvas[idx] = 255
          iconCanvas[idx + 1] = 255
          iconCanvas[idx + 2] = 255
        }
      } else {
        iconCanvas[idx] = 0
        iconCanvas[idx + 1] = 0
        iconCanvas[idx + 2] = 0
        iconCanvas[idx + 3] = 0
      }
    }
  }
  
  const notification = new Notification({
    title: 'NetMonitor - Problema de Conexão',
    body: message,
    icon: nativeImage.createFromBuffer(iconCanvas, { width: iconSize, height: iconSize }),
    urgency: 'critical' as const,
    timeoutType: 'default' as const
  })
  
  notification.on('click', () => {
    if (win) {
      win.show()
      win.focus()
    } else {
      createWindow()
    }
  })
  
  notification.show()
}

function updateTrayIcon(status: 'connected' | 'disconnected' | 'monitoring') {
  if (!tray) return
  const icon = createTrayIcon(status)
  tray.setImage(icon)
  
  let tooltip = 'NetMonitor'
  switch (status) {
    case 'connected':
      tooltip = 'NetMonitor - Conectado'
      break
    case 'disconnected':
      tooltip = 'NetMonitor - Desconectado'
      break
    case 'monitoring':
      tooltip = 'NetMonitor - Monitorando'
      break
  }
  tray.setToolTip(tooltip)
  updateTrayMenu()
}

function detectPingError(line: string): { isError: boolean; message?: string } {
  const lowerLine = line.toLowerCase()
  
  if (lowerLine.includes('esgotado') || lowerLine.includes('timed out') || lowerLine.includes('request timed out')) {
    return { isError: true, message: 'Timeout: conexão não respondeu' }
  }
  if (lowerLine.includes('unreachable') || lowerLine.includes('inacess') || lowerLine.includes('destination host unreachable')) {
    return { isError: true, message: 'Host inacessível: verifique a conexão' }
  }
  if (lowerLine.includes('falha') || lowerLine.includes('general failure') || lowerLine.includes('failure')) {
    return { isError: true, message: 'Falha de conexão detectada' }
  }
  
  return { isError: false }
}

function startMonitoring() {
  if (pingProcess) return

  isMonitoring = true
  updateTrayIcon('monitoring')
  pingProcess = spawn('ping', ['8.8.8.8', '-t'])

  // Notificar o renderer que o ping foi iniciado
  win?.webContents.send('ping-status-changed', { running: true })

  pingProcess.stdout.on('data', (data: Buffer) => {
    const dataStr = data.toString()
    win?.webContents.send('ping-data', dataStr)
    
    // Detectar erros no output do ping e enviar notificação
    const lines = dataStr.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    for (const line of lines) {
      const errorInfo = detectPingError(line)
      if (errorInfo.isError && errorInfo.message) {
        showConnectionErrorNotification(errorInfo.message)
        break // Só enviar uma notificação por batch de dados
      }
    }
  })

  pingProcess.stderr.on('data', (data: Buffer) => {
    const errorStr = data.toString()
    console.error(`Erro Ping: ${errorStr}`)
    
    // Detectar erros no stderr também
    const errorInfo = detectPingError(errorStr)
    if (errorInfo.isError && errorInfo.message) {
      showConnectionErrorNotification(errorInfo.message)
    }
  })

  pingProcess.on('close', () => {
    pingProcess = null
    isMonitoring = false
    updateTrayIcon('disconnected')
    // Notificar o renderer que o ping foi parado
    win?.webContents.send('ping-status-changed', { running: false })
  })
}

function stopMonitoring() {
  if (pingProcess) {
    pingProcess.kill()
    pingProcess = null
    isMonitoring = false
    updateTrayIcon('disconnected')
    // Notificar o renderer que o ping foi parado
    win?.webContents.send('ping-status-changed', { running: false })
  }
}

function updateTrayMenu() {
  if (!tray) return
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir NetMonitor',
      click: () => {
        if (win) {
          win.show()
          win.focus()
        } else {
          createWindow()
        }
      }
    },
    { type: 'separator' },
    {
      label: isMonitoring ? 'Pausar Monitoramento' : 'Iniciar Monitoramento',
      click: () => {
        if (isMonitoring) {
          stopMonitoring()
        } else {
          startMonitoring()
        }
      }
    },
    {
      label: 'Executar Teste de Velocidade',
      click: () => {
        if (win) {
          win.show()
          win.focus()
        } else {
          createWindow()
        }
        // Enviar comando para iniciar teste e mudar para aba de velocidade
        setTimeout(() => {
          win?.webContents.send('tray-start-speed-test')
        }, 500)
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        if (pingProcess) pingProcess.kill()
        app.quit()
      }
    }
  ])
  
  tray.setContextMenu(contextMenu)
}

function createTray() {
  const icon = createTrayIcon('disconnected')
  tray = new Tray(icon)
  updateTrayMenu()
  
  tray.on('click', () => {
    if (win) {
      win.show()
      win.focus()
    } else {
      createWindow()
    }
  })
}

let win: BrowserWindow | null = null
let pingProcess: ChildProcessWithoutNullStreams | null = null
let speedTestAbortController: AbortController | null = null
let tray: Tray | null = null
let isMonitoring = false
let lastNotificationTime = 0
const NOTIFICATION_COOLDOWN_MS = 30000 // 30 segundos entre notificações

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1200,
    height: 800,
    minWidth: 1200,
    maxWidth: 1200,
    minHeight: 800,
    maxHeight: 800,
    resizable: false,
    maximizable: false,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
  })

  win.setMenuBarVisibility(false)
  
  // Prevenir duplo clique na barra de título de maximizar
  win.on('maximize', () => {
    win?.restore()
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}


ipcMain.on('start-ping', () => {
  startMonitoring()
})

ipcMain.on('stop-ping', () => {
  stopMonitoring()
})

async function measureDownloadSpeed(url: string, durationMs: number = 10000): Promise<{ speed: number; progress: number }> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    let totalBytes = 0
    const chunks: Buffer[] = []
    let lastProgressUpdate = Date.now()

    const protocol = url.startsWith('https:') ? https : http
    const request = protocol.get(url, { signal: speedTestAbortController?.signal }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`))
        return
      }

      response.on('data', (chunk: Buffer) => {
        totalBytes += chunk.length
        chunks.push(chunk)
        const now = Date.now()
        const elapsed = now - startTime

        if (now - lastProgressUpdate > 100) {
          const currentSpeed = (totalBytes * 8) / (elapsed / 1000) / 1_000_000
          win?.webContents.send('speed-test-data', {
            type: 'download-progress',
            download: currentSpeed,
            progress: Math.min(100, (elapsed / durationMs) * 100)
          })
          lastProgressUpdate = now
        }

        if (elapsed >= durationMs) {
          response.destroy()
          const finalSpeed = (totalBytes * 8) / (elapsed / 1000) / 1_000_000
          resolve({ speed: finalSpeed, progress: 100 })
        }
      })

      response.on('end', () => {
        const elapsed = Date.now() - startTime
        const finalSpeed = (totalBytes * 8) / (elapsed / 1000) / 1_000_000
        resolve({ speed: finalSpeed, progress: 100 })
      })

      response.on('error', reject)
    })

    request.on('error', reject)
  })
}

async function measureUploadSpeed(url: string, dataSizeMB: number = 25): Promise<{ speed: number; progress: number }> {
  return new Promise((resolve, reject) => {
    const dataSize = Math.floor(dataSizeMB * 1024 * 1024)
    const chunkSize = 64 * 1024
    const data = Buffer.alloc(chunkSize, 'A')
    let uploadedBytes = 0
    const startTime = Date.now()
    let lastProgressUpdate = Date.now()

    const protocol = url.startsWith('https:') ? https : http
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': dataSize.toString()
      },
      signal: speedTestAbortController?.signal
    }

    const request = protocol.request(url, options, (response) => {
      response.on('data', () => {})
      response.on('end', () => {
        const elapsed = Date.now() - startTime
        const finalSpeed = (uploadedBytes * 8) / (elapsed / 1000) / 1_000_000
        resolve({ speed: finalSpeed, progress: 100 })
      })
      response.on('error', reject)
    })

    request.on('error', reject)

    const MIN_BYTES_FOR_CALC = 512 * 1024 // 512 KB mínimo antes de calcular
    const MIN_TIME_FOR_CALC = 500 // 500ms mínimo antes de calcular

    function updateProgress() {
      const now = Date.now()
      const elapsed = now - startTime
      
      // Só calcula velocidade se tiver tempo e bytes suficientes para evitar picos iniciais
      if (elapsed >= MIN_TIME_FOR_CALC && uploadedBytes >= MIN_BYTES_FOR_CALC && elapsed > 0) {
        const currentSpeed = (uploadedBytes * 8) / (elapsed / 1000) / 1_000_000
        win?.webContents.send('speed-test-data', {
          type: 'upload-progress',
          upload: currentSpeed,
          progress: Math.min(100, (uploadedBytes / dataSize) * 100)
        })
        lastProgressUpdate = now
      }
    }

    function sendChunk() {
      if (speedTestAbortController?.signal.aborted) {
        request.destroy()
        reject(new Error('Aborted'))
        return
      }

      const toSend = Math.min(chunkSize, dataSize - uploadedBytes)
      if (toSend <= 0) {
        request.end()
        return
      }

      const canContinue = request.write(data.slice(0, toSend))
      uploadedBytes += toSend

      const now = Date.now()
      if (now - lastProgressUpdate >= 100) {
        updateProgress()
      }

      if (!canContinue) {
        request.once('drain', () => {
          sendChunk()
        })
      } else {
        setImmediate(sendChunk)
      }
    }

    sendChunk()
  })
}

async function measurePing(host: string = 'https://www.google.com'): Promise<number> {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint()
    const protocol = host.startsWith('https:') ? https : http
    const url = new URL(host.startsWith('http') ? host : `https://${host}`)
    
    const request = protocol.get({
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/',
      timeout: 5000,
      signal: speedTestAbortController?.signal
    }, () => {
      const endTime = process.hrtime.bigint()
      const latency = Number(endTime - startTime) / 1_000_000
      resolve(latency)
    })

    request.on('error', () => {
      resolve(999)
    })

    request.on('timeout', () => {
      request.destroy()
      resolve(999)
    })
  })
}

ipcMain.on('start-speed-test', async () => {
  if (speedTestAbortController) {
    speedTestAbortController.abort()
  }
  speedTestAbortController = new AbortController()

  try {
    win?.webContents.send('speed-test-data', { type: 'start' })

    win?.webContents.send('speed-test-data', { type: 'ping-start' })
    const ping = await measurePing()
    win?.webContents.send('speed-test-data', { type: 'ping-complete', ping })

    win?.webContents.send('speed-test-data', { type: 'download-start' })
    const downloadResult = await measureDownloadSpeed('https://speed.cloudflare.com/__down?bytes=50000000', 10000)
    win?.webContents.send('speed-test-data', { type: 'download-complete', download: downloadResult.speed })

    win?.webContents.send('speed-test-data', { type: 'upload-start' })
    const uploadResult = await measureUploadSpeed('https://speed.cloudflare.com/__up', 25)
    win?.webContents.send('speed-test-data', { type: 'upload-complete', upload: uploadResult.speed })

    win?.webContents.send('speed-test-data', { type: 'complete' })
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      win?.webContents.send('speed-test-data', { type: 'error', error: error.message })
    }
  } finally {
    speedTestAbortController = null
  }
})

ipcMain.on('stop-speed-test', () => {
  if (speedTestAbortController) {
    speedTestAbortController.abort()
    speedTestAbortController = null
    win?.webContents.send('speed-test-data', { type: 'stopped' })
  }
})

ipcMain.on('window-minimize', () => {
  win?.minimize()
})

ipcMain.on('window-close', () => {
  // Em vez de fechar, minimizar para a bandeja
  if (win) {
    win.hide()
  }
})

// Handler para atualizar status da conexão do renderer
ipcMain.on('update-connection-status', (_event, status: 'connected' | 'disconnected' | 'monitoring') => {
  updateTrayIcon(status)
})

// Handler para o renderer solicitar notificação de erro
ipcMain.on('show-connection-error-notification', (_event, message: string) => {
  showConnectionErrorNotification(message)
})

app.on('window-all-closed', () => {
  // Não fechar o app quando todas as janelas são fechadas no Windows
  // O app continua rodando na bandeja
  if (process.platform !== 'darwin') {
    // Não fazer app.quit() aqui para manter o app rodando na bandeja
    if (win) {
      win.hide()
    }
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()
  createTray()
  
  // Prevenir que o app feche quando a janela é fechada
  app.on('before-quit', (event) => {
    // Se não for uma saída explícita (menu Sair), apenas esconder a janela
    if (win && !win.isDestroyed()) {
      event.preventDefault()
      win.hide()
    }
  })
})