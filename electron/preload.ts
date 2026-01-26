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
  closeWindow: () => ipcRenderer.send('window-close')
}

export type ElectronAPI = typeof api

try {
  contextBridge.exposeInMainWorld('electron', api)
} catch (error) {
  console.error(error)
}