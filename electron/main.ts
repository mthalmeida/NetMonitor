import { app, BrowserWindow, ipcMain } from 'electron' // Adicionado ipcMain
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process' // Adicionado spawn para rodar o Ping
import https from 'node:https'
import http from 'node:http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null = null
let pingProcess: ChildProcessWithoutNullStreams | null = null
let speedTestAbortController: AbortController | null = null

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
  if (pingProcess) return

  pingProcess = spawn('ping', ['8.8.8.8', '-t'])

  pingProcess.stdout.on('data', (data: Buffer) => {
    win?.webContents.send('ping-data', data.toString())
  })

  pingProcess.stderr.on('data', (data: Buffer) => {
    console.error(`Erro Ping: ${data}`)
  })

  pingProcess.on('close', () => {
    pingProcess = null
  })
})

ipcMain.on('stop-ping', () => {
  if (pingProcess) {
    pingProcess.kill()
    pingProcess = null
  }
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
  win?.close()
})

app.on('window-all-closed', () => {
  if (pingProcess) pingProcess.kill()

  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)