import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

const api = {
  startPing: () => ipcRenderer.send('start-ping'),
  stopPing: () => ipcRenderer.send('stop-ping'),
  onPingData: (callback: (data: string) => void) => {
    const subscription = (_event: IpcRendererEvent, value: string) => callback(value)
    ipcRenderer.on('ping-data', subscription)
    return () => {
      ipcRenderer.removeListener('ping-data', subscription)
    }
  },
  startSpeedTest: () => ipcRenderer.send('start-speed-test'),
  stopSpeedTest: () => ipcRenderer.send('stop-speed-test'),
  onSpeedTestData: (callback: (data: { type: string; download?: number; upload?: number; ping?: number; progress?: number }) => void) => {
    const subscription = (_event: IpcRendererEvent, value: any) => callback(value)
    ipcRenderer.on('speed-test-data', subscription)
    return () => {
      ipcRenderer.removeListener('speed-test-data', subscription)
    }
  },
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  updateConnectionStatus: (status: 'connected' | 'disconnected' | 'monitoring') => {
    ipcRenderer.send('update-connection-status', status)
  },
  onTrayStartSpeedTest: (callback: () => void) => {
    const subscription = () => callback()
    ipcRenderer.on('tray-start-speed-test', subscription)
    return () => {
      ipcRenderer.removeListener('tray-start-speed-test', subscription)
    }
  },
  onPingStatusChanged: (callback: (data: { running: boolean }) => void) => {
    const subscription = (_event: IpcRendererEvent, value: { running: boolean }) => callback(value)
    ipcRenderer.on('ping-status-changed', subscription)
    return () => {
      ipcRenderer.removeListener('ping-status-changed', subscription)
    }
  },
  showConnectionErrorNotification: (message: string) => {
    ipcRenderer.send('show-connection-error-notification', message)
  }
}

export type ElectronAPI = typeof api

try {
  contextBridge.exposeInMainWorld('electron', api)
} catch (error) {
  console.error(error)
}