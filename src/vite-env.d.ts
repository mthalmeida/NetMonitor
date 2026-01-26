/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    electron?: import('../electron/preload').ElectronAPI
  }
}
