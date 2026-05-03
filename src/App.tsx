import { useMemo, useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import './App.css'
import logoApp from './assets/logo_app.png'

type LogEntry = {
  id: number
  raw: string
  isError: boolean
  timestamp: string
  time?: number
  latencyMs?: number | null
}

type LatencyChartPoint = {
  x: number
  y: number
  ms: number
  ts: string
  time: number
}

const FIVE_MIN_MS = 5 * 60 * 1000

type SpeedTestData = {
  download: number | null
  upload: number | null
  ping: number | null
  status: 'idle' | 'testing' | 'complete' | 'error'
  currentPhase: 'idle' | 'ping' | 'download' | 'upload'
  progress: number
  downloadHistory: number[]
  uploadHistory: number[]
}

function detectError(line: string) {
  const l = line.toLowerCase()
  return (
    l.includes('esgotado') ||
    l.includes('falha') ||
    l.includes('unreachable') ||
    l.includes('general failure') ||
    l.includes('request timed out') ||
    l.includes('timed out') ||
    l.includes('host de destino inacess') ||
    l.includes('destination host unreachable')
  )
}

function extractLatencyMs(line: string): number | null {
  // Windows PT-BR: "tempo=11ms" | EN: "time=11ms"
  const match = line.match(/(?:tempo|time)\s*[=<]?\s*(\d+(?:\.\d+)?)\s*ms/i)
  if (!match) return null
  const value = Number(match[1])
  return Number.isFinite(value) ? value : null
}

function getPingQuality(ping: number): { label: string; color: string; quality: 'excellent' | 'good' | 'fair' | 'poor' } {
  if (ping <= 20) {
    return { label: 'Excelente', color: 'var(--nm-good)', quality: 'excellent' }
  } else if (ping <= 50) {
    return { label: 'Bom', color: '#22d3ee', quality: 'good' }
  } else if (ping <= 100) {
    return { label: 'Regular', color: '#f59e0b', quality: 'fair' }
  } else {
    return { label: 'Ruim', color: 'var(--nm-bad)', quality: 'poor' }
  }
}

function getDownloadInfo(speed: number | null): { title: string; description: string; tips: string[] } {
  if (speed === null) {
    return {
      title: 'Velocidade de Download',
      description: 'A velocidade de download mede quantos dados você pode receber da internet por segundo.',
      tips: ['Execute o teste para ver sua velocidade de download atual']
    }
  }
  
  if (speed >= 100) {
    return {
      title: 'Velocidade de Download: Excelente',
      description: `Sua velocidade de download é ${speed.toFixed(2)} Mbps, o que é excelente para streaming em 4K, jogos online e downloads rápidos.`,
      tips: [
        'Mantenha sua conexão atual',
        'Use cabo Ethernet para melhor estabilidade',
        'Evite usar muitos dispositivos simultaneamente'
      ]
    }
  } else if (speed >= 50) {
    return {
      title: 'Velocidade de Download: Boa',
      description: `Sua velocidade de download é ${speed.toFixed(2)} Mbps, adequada para streaming HD, videoconferências e uso geral.`,
      tips: [
        'Considere usar cabo Ethernet em vez de Wi-Fi',
        'Feche aplicativos que consomem banda',
        'Verifique se há outros dispositivos usando a rede'
      ]
    }
  } else if (speed >= 25) {
    return {
      title: 'Velocidade de Download: Regular',
      description: `Sua velocidade de download é ${speed.toFixed(2)} Mbps, suficiente para streaming em qualidade padrão e navegação básica.`,
      tips: [
        'Conecte-se via cabo Ethernet se possível',
        'Aproxime-se do roteador se usar Wi-Fi',
        'Verifique seu plano de internet com o provedor',
        'Reinicie o roteador para melhorar a conexão'
      ]
    }
  } else {
    return {
      title: 'Velocidade de Download: Baixa',
      description: `Sua velocidade de download é ${speed.toFixed(2)} Mbps, o que pode causar lentidão em streaming e downloads.`,
      tips: [
        'Verifique seu plano de internet - pode ser necessário um upgrade',
        'Use cabo Ethernet em vez de Wi-Fi',
        'Reinicie o roteador e modem',
        'Verifique se há interferências no sinal Wi-Fi',
        'Contate seu provedor de internet para verificar problemas na linha'
      ]
    }
  }
}

function getUploadInfo(speed: number | null): { title: string; description: string; tips: string[] } {
  if (speed === null) {
    return {
      title: 'Velocidade de Upload',
      description: 'A velocidade de upload mede quantos dados você pode enviar para a internet por segundo.',
      tips: ['Execute o teste para ver sua velocidade de upload atual']
    }
  }
  
  if (speed >= 50) {
    return {
      title: 'Velocidade de Upload: Excelente',
      description: `Sua velocidade de upload é ${speed.toFixed(2)} Mbps, excelente para videoconferências, streaming ao vivo e backup de arquivos.`,
      tips: [
        'Mantenha sua conexão atual',
        'Use cabo Ethernet para melhor estabilidade',
        'Ideal para trabalho remoto e conteúdo criativo'
      ]
    }
  } else if (speed >= 20) {
    return {
      title: 'Velocidade de Upload: Boa',
      description: `Sua velocidade de upload é ${speed.toFixed(2)} Mbps, adequada para videoconferências e uploads de arquivos.`,
      tips: [
        'Use cabo Ethernet para melhor performance',
        'Evite uploads simultâneos de múltiplos arquivos',
        'Feche aplicativos que fazem upload em segundo plano'
      ]
    }
  } else if (speed >= 10) {
    return {
      title: 'Velocidade de Upload: Regular',
      description: `Sua velocidade de upload é ${speed.toFixed(2)} Mbps, suficiente para uso básico mas pode ser lenta para streaming ao vivo.`,
      tips: [
        'Conecte-se via cabo Ethernet',
        'Verifique seu plano de internet - uploads geralmente são mais lentos',
        'Evite fazer uploads durante videoconferências',
        'Considere um plano com melhor velocidade de upload'
      ]
    }
  } else {
    return {
      title: 'Velocidade de Upload: Baixa',
      description: `Sua velocidade de upload é ${speed.toFixed(2)} Mbps, o que pode causar problemas em videoconferências e uploads.`,
      tips: [
        'Verifique seu plano de internet - muitos planos têm upload muito menor que download',
        'Use cabo Ethernet em vez de Wi-Fi',
        'Reinicie o roteador e modem',
        'Considere fazer upgrade do seu plano de internet',
        'Evite múltiplos uploads simultâneos'
      ]
    }
  }
}

function getPingInfo(ping: number | null): { title: string; description: string; tips: string[] } {
  if (ping === null) {
    return {
      title: 'Latência (Ping)',
      description: 'O ping mede o tempo de resposta da sua conexão, importante para jogos online e videoconferências.',
      tips: ['Execute o teste para ver sua latência atual']
    }
  }
  
  const quality = getPingQuality(ping)
  
  if (ping <= 20) {
    return {
      title: `Latência: ${quality.label} (${Math.round(ping)} ms)`,
      description: `Sua latência é ${Math.round(ping)} ms, excelente para jogos online competitivos, streaming e videoconferências sem atraso.`,
      tips: [
        'Mantenha sua conexão atual',
        'Use cabo Ethernet para manter latência baixa',
        'Ideal para jogos online e trabalho remoto'
      ]
    }
  } else if (ping <= 50) {
    return {
      title: `Latência: ${quality.label} (${Math.round(ping)} ms)`,
      description: `Sua latência é ${Math.round(ping)} ms, boa para a maioria das atividades online, incluindo jogos casuais e streaming.`,
      tips: [
        'Use cabo Ethernet em vez de Wi-Fi para reduzir latência',
        'Feche aplicativos que consomem banda',
        'Verifique se há outros dispositivos usando a rede'
      ]
    }
  } else if (ping <= 100) {
    return {
      title: `Latência: ${quality.label} (${Math.round(ping)} ms)`,
      description: `Sua latência é ${Math.round(ping)} ms, pode causar pequenos atrasos em jogos online e videoconferências.`,
      tips: [
        'Conecte-se via cabo Ethernet se possível',
        'Aproxime-se do roteador se usar Wi-Fi',
        'Reinicie o roteador para melhorar a conexão',
        'Verifique se há interferências no sinal Wi-Fi',
        'Considere usar um servidor DNS mais próximo'
      ]
    }
  } else {
    return {
      title: `Latência: ${quality.label} (${Math.round(ping)} ms)`,
      description: `Sua latência é ${Math.round(ping)} ms, alta e pode causar problemas significativos em jogos online e videoconferências.`,
      tips: [
        'Use cabo Ethernet em vez de Wi-Fi',
        'Reinicie o roteador e modem',
        'Verifique se há problemas na linha com seu provedor',
        'Feche todos os aplicativos que usam internet',
        'Verifique se há interferências próximas ao roteador'
      ]
    }
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<'ping' | 'speed'>('ping')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [query, setQuery] = useState('')
  const [onlyErrors, setOnlyErrors] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [showLogPanel, setShowLogPanel] = useState(false)
  const [pingMenuOpen, setPingMenuOpen] = useState(false)
  const [hoveredLatencyIndex, setHoveredLatencyIndex] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pingMenuRef = useRef<HTMLDivElement>(null)
  const [speedTest, setSpeedTest] = useState<SpeedTestData>({
    download: null,
    upload: null,
    ping: null,
    status: 'idle',
    currentPhase: 'idle',
    progress: 0,
    downloadHistory: [],
    uploadHistory: []
  })
  const [speedTestFlash, setSpeedTestFlash] = useState<'idle' | 'start' | 'end'>('idle')

  useEffect(() => {
    const api = window.electron
    if (!api?.onPingData) return

    const cleanup = api.onPingData((data: string) => {
      // Se recebeu dados, o ping está rodando
      if (!isRunning) {
        setIsRunning(true)
      }

      const now = new Date()
      const timestamp = now.toLocaleTimeString()
      const time = now.getTime()

      const lines = data
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean)

      if (lines.length === 0) return

      setLogs(prev => {
        const next = [...prev]
        for (const line of lines) {
          const isError = detectError(line)
          const latencyMs = extractLatencyMs(line)
          next.push({
            id: time + Math.random(),
            raw: line,
            isError,
            latencyMs,
            timestamp,
            time,
          })
        }
        return next.slice(-500)
      })
    })

    return () => cleanup()
  }, [isRunning])

  useEffect(() => {
    if (!autoScroll) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs, autoScroll])

  useEffect(() => {
    const api = window.electron
    if (!api?.onSpeedTestData) return

    const cleanup = api.onSpeedTestData((data: any) => {
      if (data.type === 'start') {
        setSpeedTestFlash('start')
        setSpeedTest(prev => ({
          ...prev,
          status: 'testing',
          currentPhase: 'ping',
          progress: 0,
          download: null,
          upload: null,
          ping: null,
          downloadHistory: [],
          uploadHistory: []
        }))
      } else if (data.type === 'download-start') {
        setSpeedTest(prev => ({
          ...prev,
          currentPhase: 'download',
          progress: 10
        }))
      } else if (data.type === 'download-progress') {
        setSpeedTest(prev => ({
          ...prev,
          download: typeof data.download === 'number' ? data.download : prev.download,
          progress: 10 + (data.progress * 0.45),
          downloadHistory: typeof data.download === 'number'
            ? [...prev.downloadHistory.slice(-29), data.download]
            : prev.downloadHistory
        }))
      } else if (data.type === 'download-complete') {
        setSpeedTest(prev => ({
          ...prev,
          download: data.download,
          currentPhase: 'upload',
          progress: 55
        }))
      } else if (data.type === 'upload-start') {
        setSpeedTest(prev => ({
          ...prev,
          currentPhase: 'upload',
          progress: 55,
          upload: 0,
          uploadHistory: []
        }))
      } else if (data.type === 'upload-progress') {
        setSpeedTest(prev => ({
          ...prev,
          upload: data.upload,
          progress: 55 + (data.progress * 0.45),
          uploadHistory: [...prev.uploadHistory.slice(-29), data.upload]
        }))
      } else if (data.type === 'upload-complete') {
        setSpeedTest(prev => ({
          ...prev,
          upload: data.upload,
          currentPhase: 'idle',
          progress: 100
        }))
      } else if (data.type === 'ping-start') {
        setSpeedTest(prev => ({
          ...prev,
          currentPhase: 'ping',
          progress: 0
        }))
      } else if (data.type === 'ping-complete') {
        setSpeedTest(prev => ({
          ...prev,
          ping: data.ping,
          currentPhase: 'download',
          progress: 10
        }))
      } else if (data.type === 'complete') {
        setSpeedTestFlash('end')
        setSpeedTest(prev => ({
          ...prev,
          status: 'complete',
          currentPhase: 'idle',
          progress: 100
        }))
      } else if (data.type === 'error') {
        setSpeedTestFlash('end')
        setSpeedTest(prev => ({
          ...prev,
          status: 'error',
          currentPhase: 'idle'
        }))
      } else if (data.type === 'stopped') {
        setSpeedTest(prev => ({
          ...prev,
          status: 'idle',
          currentPhase: 'idle',
          progress: 0
        }))
      }
    })

    return () => cleanup()
  }, [])

  useEffect(() => {
    if (speedTestFlash === 'start') {
      const t = setTimeout(() => setSpeedTestFlash('idle'), 520)
      return () => clearTimeout(t)
    }
    if (speedTestFlash === 'end') {
      const t = setTimeout(() => setSpeedTestFlash('idle'), 860)
      return () => clearTimeout(t)
    }
  }, [speedTestFlash])

  // Escutar comando do tray para iniciar teste de velocidade
  useEffect(() => {
    const api = window.electron
    if (!api?.onTrayStartSpeedTest) return

    const cleanup = api.onTrayStartSpeedTest(() => {
      // Mudar para aba de velocidade
      setActiveTab('speed')
      // Iniciar teste após um pequeno delay para garantir que a aba foi mudada
      setTimeout(() => {
        const electronApi = window.electron
        if (electronApi?.startSpeedTest) {
          electronApi.startSpeedTest()
        }
      }, 100)
    })

    return () => cleanup()
  }, [])

  // Sincronizar isRunning com o estado real do ping
  useEffect(() => {
    const api = window.electron
    if (!api?.onPingStatusChanged) return

    const cleanup = api.onPingStatusChanged((data: { running: boolean }) => {
      setIsRunning(data.running)
    })

    return () => cleanup()
  }, [])

  useEffect(() => {
    if (!pingMenuOpen) return
    const onMouseDown = (e: MouseEvent) => {
      if (pingMenuRef.current && !pingMenuRef.current.contains(e.target as Node)) setPingMenuOpen(false)
    }
    window.addEventListener('mousedown', onMouseDown)
    return () => window.removeEventListener('mousedown', onMouseDown)
  }, [pingMenuOpen])

  const isElectron = typeof window !== 'undefined' && !!window.electron

  const stats = useMemo(() => {
    const total = logs.length
    const errors = logs.reduce((acc, l) => acc + (l.isError ? 1 : 0), 0)
    const last = logs[logs.length - 1]
    const lastLatency = [...logs].reverse().find(l => l.latencyMs != null)?.latencyMs ?? null
    return { total, errors, last, lastLatency }
  }, [logs])

  const recentError = useMemo(() => {
    if (!isRunning || logs.length === 0) return null
    const now = Date.now()
    const ERROR_WINDOW_MS = 30 * 1000
    const recentLogs = logs.filter(l => l.time != null && (now - l.time) <= ERROR_WINDOW_MS)
    const lastError = [...recentLogs].reverse().find(l => l.isError)
    if (lastError) {
      const errorCount = recentLogs.filter(l => l.isError).length
      return {
        message: lastError.raw.includes('timed out') || lastError.raw.includes('esgotado') 
          ? 'Timeout: conexão não respondeu'
          : lastError.raw.includes('unreachable') || lastError.raw.includes('inacess')
          ? 'Host inacessível: verifique a conexão'
          : 'Erro de conexão detectado',
        count: errorCount,
        lastTime: lastError.time || now
      }
    }
    return null
  }, [logs, isRunning])

  const visibleLogs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return logs.filter(l => {
      if (onlyErrors && !l.isError) return false
      if (!q) return true
      return l.raw.toLowerCase().includes(q)
    })
  }, [logs, onlyErrors, query])

  const latencyChart = useMemo(() => {
    const w = 640
    const h = 260
    const pad = { left: 52, right: 22, top: 18, bottom: 38 }
    const gW = w - pad.left - pad.right
    const gH = h - pad.top - pad.bottom
    const withTime = logs.filter((l): l is LogEntry & { time: number } => l.time != null)
    const refTime = withTime.length > 0 ? Math.max(...withTime.map(l => l.time)) : Date.now()
    const cutoff = refTime - FIVE_MIN_MS
    const points = withTime
      .filter(l => l.latencyMs != null && l.time >= cutoff)
      .map(l => ({ time: l.time, ms: l.latencyMs!, ts: l.timestamp }))
      .sort((a, b) => a.time - b.time)
    if (points.length === 0) {
      return { points: [] as LatencyChartPoint[], maxMs: 50, path: '', areaPath: '', pad, w, h, gW, gH, refTime, windowMs: FIVE_MIN_MS }
    }
    const maxMs = Math.max(20, ...points.map(p => p.ms), 1)
    const displayMax = Math.ceil((maxMs * 1.2) / 10) * 10
    const scaleY = (ms: number) => pad.top + gH - (ms / displayMax) * gH
    const scaleX = (t: number) => pad.left + ((t - cutoff) / FIVE_MIN_MS) * gW
    const coords = points.map(p => ({
      x: scaleX(p.time),
      y: scaleY(p.ms),
      ms: p.ms,
      ts: p.ts,
      time: p.time
    }))
    let path = ''
    let areaPath = ''
    if (coords.length) {
      path = coords.map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`)).join(' ')
      const last = coords[coords.length - 1]
      const first = coords[0]
      const baseY = pad.top + gH
      areaPath = `${path} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`
    }
    return { points: coords, maxMs: displayMax, path, areaPath, pad, w, h, gW, gH, refTime, windowMs: FIVE_MIN_MS }
  }, [logs])

  const hoveredLatencyPoint = hoveredLatencyIndex != null ? latencyChart.points[hoveredLatencyIndex] : null

  useEffect(() => {
    if (hoveredLatencyIndex != null && hoveredLatencyIndex >= latencyChart.points.length) {
      setHoveredLatencyIndex(null)
    }
  }, [hoveredLatencyIndex, latencyChart.points.length])

  const handleLatencyChartMouseMove = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (latencyChart.points.length === 0) return

    const rect = event.currentTarget.getBoundingClientRect()
    const scale = Math.min(rect.width / latencyChart.w, rect.height / latencyChart.h)
    const offsetX = (rect.width - latencyChart.w * scale) / 2
    const svgX = (event.clientX - rect.left - offsetX) / scale
    const clampedX = Math.max(latencyChart.pad.left, Math.min(latencyChart.pad.left + latencyChart.gW, svgX))

    let closestIndex = 0
    let closestDistance = Math.abs(latencyChart.points[0].x - clampedX)

    for (let i = 1; i < latencyChart.points.length; i += 1) {
      const distance = Math.abs(latencyChart.points[i].x - clampedX)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    setHoveredLatencyIndex(closestIndex)
  }

  const health = useMemo(() => {
    if (!isRunning) return 'idle' as const
    if (!stats.last) return 'idle' as const
    return stats.last.isError ? ('bad' as const) : ('good' as const)
  }, [isRunning, stats.last])

  // Atualizar status da conexão no system tray
  useEffect(() => {
    const api = window.electron
    if (!api?.updateConnectionStatus) return

    let status: 'connected' | 'disconnected' | 'monitoring'
    if (!isRunning) {
      status = 'disconnected'
    } else if (health === 'bad') {
      status = 'disconnected'
    } else if (health === 'good') {
      status = 'connected'
    } else {
      // Quando está rodando mas ainda não tem dados suficientes
      status = 'monitoring'
    }

    api.updateConnectionStatus(status)
  }, [isRunning, health])

  // Detectar novos erros e enviar notificação
  const prevErrorTimeRef = useRef<number | null>(null)
  useEffect(() => {
    if (!recentError || !isRunning) {
      prevErrorTimeRef.current = null
      return
    }

    const api = window.electron
    if (!api?.showConnectionErrorNotification) return

    // Se é um novo erro (diferente do anterior)
    const isNewError = prevErrorTimeRef.current === null || 
                       recentError.lastTime !== prevErrorTimeRef.current

    if (isNewError) {
      prevErrorTimeRef.current = recentError.lastTime
      // Enviar notificação quando detectar erro (o cooldown é gerenciado no main process)
      api.showConnectionErrorNotification(recentError.message)
    }
  }, [recentError, isRunning])

  const clearLogs = () => setLogs([])

  const copyLogs = async () => {
    const content = logs.map(l => `[${l.timestamp}] ${l.raw}`).join('\n')
    await navigator.clipboard.writeText(content)
  }

  const exportLogs = () => {
    const content = logs.map(l => `[${l.timestamp}] ${l.raw}`).join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `net-monitor-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const togglePing = () => {
    const api = window.electron
    if (!api) return

    if (isRunning) {
      api.stopPing()
    } else {
      api.startPing()
    }
    setIsRunning(v => !v)
  }

  const startSpeedTest = () => {
    const api = window.electron
    if (!api) return
    api.startSpeedTest()
  }

  const stopSpeedTest = () => {
    const api = window.electron
    if (!api) return
    api.stopSpeedTest()
  }

  const minimizeWindow = () => {
    const api = window.electron
    if (!api) return
    api.minimizeWindow()
  }

  const closeWindow = () => {
    const api = window.electron
    if (!api) return
    api.closeWindow()
  }

  return (
    <div className="nmApp">
      <div className="nmTitleBar">
        <div className="nmTitleBarDrag"></div>
        <div className="nmWindowControls">
          <button
            className="nmWindowControl nmWindowControlMinimize"
            onClick={minimizeWindow}
            title="Minimizar"
            disabled={!isElectron}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            className="nmWindowControl nmWindowControlClose"
            onClick={closeWindow}
            title="Fechar"
            disabled={!isElectron}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="nmShell">
        <header className="nmTopbar">
          <div className="nmBrand">
            <div className="nmTitleRow">
              <img className="nmMark" src={logoApp} alt="Logo do NetMonitor" />
            </div>
          </div>

          <div className="nmPills" aria-live="polite">
            <div className="nmPill" title="Status do monitoramento">
              <span
                className={[
                  'nmDot',
                  health === 'good' ? 'nmDotGood' : '',
                  health === 'bad' ? 'nmDotBad' : '',
                  isRunning ? 'nmDotPulse' : '',
                ].join(' ')}
              />
              <span>
                {isRunning ? (health === 'bad' ? 'Monitorando (falhas detectadas)' : 'Monitorando') : 'Parado'}
              </span>
              {stats.lastLatency != null && (() => {
                const quality = getPingQuality(stats.lastLatency)
                return (
                  <span 
                    className={['nmBadge', `nmBadgePing${quality.quality.charAt(0).toUpperCase() + quality.quality.slice(1)}`].join(' ')}
                    style={{ borderColor: quality.color, backgroundColor: `${quality.color}15`, color: quality.color }}
                  >
                    {Math.round(stats.lastLatency)} ms
                  </span>
                )
              })()}
            </div>

            <div className="nmPill" title="Integração com Electron">
              <span className={['nmDot', isElectron ? 'nmDotGood' : 'nmDotBad'].join(' ')} />
              <span>{isElectron ? 'Servidor conectado' : 'Modo web (IPC indisponível)'}</span>
            </div>
          </div>
        </header>

        <div className="nmTabs">
          <button
            className={['nmTab', activeTab === 'ping' ? 'nmTabActive' : ''].join(' ')}
            onClick={() => setActiveTab('ping')}
          >
            <span>Monitoramento Ping</span>
          </button>
          <button
            className={['nmTab', activeTab === 'speed' ? 'nmTabActive' : ''].join(' ')}
            onClick={() => setActiveTab('speed')}
          >
            <span>Teste de Velocidade</span>
          </button>
        </div>

        <div className="nmTabContent">
        {activeTab === 'ping' && (
          <div className="nmPingPage">
            <div className="nmPingTopBar">
              <button
                className={['nmPrimaryBtn', 'nmPingStartBtn', isRunning ? 'nmDangerBtn' : ''].join(' ')}
                onClick={togglePing}
                disabled={!isElectron}
              >
                {isRunning ? 'Parar' : 'Iniciar'} monitoramento
              </button>
              <div className="nmPingTopBarRight" ref={pingMenuRef}>
                <button
                  type="button"
                  className="nmPingMenuBtn"
                  onClick={() => setPingMenuOpen(v => !v)}
                  title="Opções"
                  aria-expanded={pingMenuOpen}
                >
                  ⋯
                </button>
                {pingMenuOpen && (
                  <div className="nmPingDropdown">
                    <button type="button" className="nmPingDropdownItem" onClick={() => { clearLogs(); setPingMenuOpen(false) }} disabled={logs.length === 0}>Limpar log</button>
                    <button type="button" className="nmPingDropdownItem" onClick={() => { void copyLogs(); setPingMenuOpen(false) }} disabled={logs.length === 0}>Copiar</button>
                    <button type="button" className="nmPingDropdownItem" onClick={() => { exportLogs(); setPingMenuOpen(false) }} disabled={logs.length === 0}>Exportar</button>
                    <button type="button" className="nmPingDropdownItem" onClick={() => { setQuery(''); setPingMenuOpen(false) }} disabled={!query}>Reset busca</button>
                    <div className="nmPingDropdownDivider" />
                    <div className="nmPingDropdownToggle">
                      <span>Somente falhas</span>
                      <div role="switch" aria-checked={onlyErrors} className={['nmSwitch', onlyErrors ? 'nmSwitchOn' : ''].join(' ')} onClick={() => setOnlyErrors(v => !v)} />
                    </div>
                    <div className="nmPingDropdownToggle">
                      <span>Auto-scroll no log</span>
                      <div role="switch" aria-checked={autoScroll} className={['nmSwitch', autoScroll ? 'nmSwitchOn' : ''].join(' ')} onClick={() => setAutoScroll(v => !v)} />
                    </div>
                    <div className="nmPingDropdownStats">
                      Linhas: {stats.total} · Falhas: {stats.errors}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className={['nmPingLogToggle', showLogPanel ? 'nmPingLogToggleActive' : ''].join(' ')}
                  onClick={() => setShowLogPanel(v => !v)}
                >
                  {showLogPanel ? 'Ocultar log' : 'Ver log'}
                </button>
              </div>
            </div>

            {!showLogPanel && (
              <section className={['nmCard', 'nmLatencyChartCard', recentError ? 'nmLatencyChartCard--hasError' : ''].filter(Boolean).join(' ')}>
              <div className="nmLatencyChartHeader">
                <div className="nmLatencyChartTitle">Latência em tempo real</div>
                {recentError && (
                  <div className="nmLatencyErrorAlert">
                    <span className="nmLatencyErrorIcon">⚠</span>
                    <span className="nmLatencyErrorText">{recentError.message}</span>
                    {recentError.count > 1 && (
                      <span className="nmLatencyErrorCount">({recentError.count} erros nos últimos 30s)</span>
                    )}
                  </div>
                )}
                <div className="nmLatencyCurrentResult">
                  {stats.lastLatency != null ? (
                    <>
                      <span className="nmLatencyCurrentValue">{Math.round(stats.lastLatency)}</span>
                      <span className="nmLatencyCurrentUnit"> ms</span>
                      {(() => {
                        const q = getPingQuality(stats.lastLatency)
                        return <span className="nmLatencyCurrentQuality" style={{ color: q.color }}>{q.label}</span>
                      })()}
                    </>
                  ) : (
                    <span className="nmLatencyCurrentEmpty">— ms · Inicie o monitoramento</span>
                  )}
                  {latencyChart.points.length > 0 && (
                    <span className="nmLatencyChartHint"> · janela 5 min ({latencyChart.points.length} pontos)</span>
                  )}
                </div>
              </div>
              <div className="nmLatencyChartBody">
                <div className="nmLatencyChartWrap">
                  <svg
                    className="nmLatencyChartSvg"
                    viewBox={`0 0 ${latencyChart.w} ${latencyChart.h}`}
                    preserveAspectRatio="xMidYMid meet"
                    onMouseMove={handleLatencyChartMouseMove}
                    onMouseLeave={() => setHoveredLatencyIndex(null)}
                  >
                    <defs>
                      <linearGradient id="latencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
                        <stop offset="55%" stopColor="rgba(124, 58, 237, 0.12)" />
                        <stop offset="100%" stopColor="rgba(34, 211, 238, 0.01)" />
                      </linearGradient>
                      <linearGradient id="latencyLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="55%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                    {latencyChart.points.length > 0 && (
                      <>
                        <rect className="nmLatencyChartPlot" x={latencyChart.pad.left} y={latencyChart.pad.top} width={latencyChart.gW} height={latencyChart.gH} rx="8" />
                        {[0, 0.25, 0.5, 0.75, 1].map(frac => (
                          <line key={frac} className="nmLatencyChartGrid" x1={latencyChart.pad.left} y1={latencyChart.pad.top + latencyChart.gH * (1 - frac)} x2={latencyChart.pad.left + latencyChart.gW} y2={latencyChart.pad.top + latencyChart.gH * (1 - frac)} />
                        ))}
                        {[0, 0.25, 0.5, 0.75, 1].map(frac => (
                          <line key={frac} className="nmLatencyChartGrid" x1={latencyChart.pad.left + latencyChart.gW * frac} y1={latencyChart.pad.top} x2={latencyChart.pad.left + latencyChart.gW * frac} y2={latencyChart.pad.top + latencyChart.gH} />
                        ))}
                        <path d={latencyChart.areaPath} fill="url(#latencyGradient)" className="nmLatencyChartArea" />
                        <path d={latencyChart.path} fill="none" stroke="url(#latencyLineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="nmLatencyChartLine" />
                        {latencyChart.points.map((point, index) => {
                          const quality = getPingQuality(point.ms)
                          return (
                            <circle
                              key={`${point.time}-${index}`}
                              className={['nmLatencyChartPoint', hoveredLatencyIndex === index ? 'nmLatencyChartPointActive' : ''].join(' ')}
                              cx={point.x}
                              cy={point.y}
                              r={hoveredLatencyIndex === index ? 5 : 3}
                              style={{ fill: quality.color }}
                            />
                          )
                        })}
                        {[0, 0.25, 0.5, 0.75, 1].map(frac => (
                          <text key={frac} x={latencyChart.pad.left - 8} y={latencyChart.pad.top + latencyChart.gH * (1 - frac) + 3} textAnchor="end" className="nmLatencyChartAxisLabel">
                            {Math.round(latencyChart.maxMs * frac)}
                          </text>
                        ))}
                        <text x={latencyChart.pad.left} y={latencyChart.h - 10} textAnchor="start" className="nmLatencyChartAxisLabel nmLatencyChartTimeLabel">5 min atrás</text>
                        <text x={latencyChart.pad.left + latencyChart.gW / 2} y={latencyChart.h - 10} textAnchor="middle" className="nmLatencyChartAxisLabel nmLatencyChartTimeLabel">2:30 atrás</text>
                        <text x={latencyChart.pad.left + latencyChart.gW} y={latencyChart.h - 10} textAnchor="end" className="nmLatencyChartAxisLabel nmLatencyChartTimeLabel">agora</text>
                        {hoveredLatencyPoint && (
                          <g className="nmLatencyChartHover">
                            <line className="nmLatencyChartCrosshair" x1={hoveredLatencyPoint.x} y1={latencyChart.pad.top} x2={hoveredLatencyPoint.x} y2={latencyChart.pad.top + latencyChart.gH} />
                            <line className="nmLatencyChartCrosshair nmLatencyChartCrosshairMuted" x1={latencyChart.pad.left} y1={hoveredLatencyPoint.y} x2={latencyChart.pad.left + latencyChart.gW} y2={hoveredLatencyPoint.y} />
                            <circle className="nmLatencyChartHoverRing" cx={hoveredLatencyPoint.x} cy={hoveredLatencyPoint.y} r="8" />
                            {(() => {
                              const tooltipW = 136
                              const tooltipH = 58
                              const rawX = hoveredLatencyPoint.x + 12
                              const rawY = hoveredLatencyPoint.y - tooltipH - 12
                              const x = Math.max(latencyChart.pad.left + 8, Math.min(rawX, latencyChart.w - tooltipW - 8))
                              const y = Math.max(latencyChart.pad.top + 8, rawY)
                              const quality = getPingQuality(hoveredLatencyPoint.ms)
                              return (
                                <g transform={`translate(${x} ${y})`} className="nmLatencyChartTooltip">
                                  <rect width={tooltipW} height={tooltipH} rx="8" />
                                  <text x="12" y="21" className="nmLatencyChartTooltipValue">{Math.round(hoveredLatencyPoint.ms)} ms</text>
                                  <text x="12" y="39" className="nmLatencyChartTooltipTime">{hoveredLatencyPoint.ts}</text>
                                  <text x={tooltipW - 12} y="39" textAnchor="end" className="nmLatencyChartTooltipQuality" style={{ fill: quality.color }}>{quality.label}</text>
                                </g>
                              )
                            })()}
                          </g>
                        )}
                      </>
                    )}
                    {latencyChart.points.length === 0 && (
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="nmLatencyChartEmpty">Inicie o monitoramento para ver o gráfico</text>
                    )}
                  </svg>
                </div>
              </div>
            </section>
            )}

            {showLogPanel && (
              <section className="nmCard nmLogsCard">
                <div className="nmCardHeader">
                  <div className="nmCardTitle">Log</div>
                  <div className="nmLogsHeader">
                    <input className="nmSearch" placeholder="Buscar (ex.: tempo=, esgotado)" value={query} onChange={e => setQuery(e.target.value)} />
                  </div>
                </div>
                <div className="nmLogsMeta">
                  <span><strong>{visibleLogs.length}</strong> de <strong>{stats.total}</strong></span>
                  <span>{onlyErrors ? 'Falhas' : 'Tudo'}</span>
                </div>
                <div className="nmLogList">
                  {visibleLogs.length === 0 ? (
                    <div className="nmEmpty">
                      <div className="nmEmptyTitle">Nenhuma linha</div>
                      <div className="nmEmptyText">Inicie o monitoramento ou ajuste busca/filtro.</div>
                    </div>
                  ) : (
                    visibleLogs.map(log => (
                      <div key={log.id} className={['nmRow', log.isError ? 'nmRowError' : 'nmRowOk'].join(' ')}>
                        <div className="nmTime">[{log.timestamp}]</div>
                        <div className="nmMsg">{log.isError ? `FALHA: ${log.raw}` : log.raw}</div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'speed' && (
          <div className="nmSpeedTestPage">
            <section
              className={
                'nmCard nmSpeedTestCard' +
                (speedTestFlash === 'start' ? ' nmSpeedTestCard--effectStart' : '') +
                (speedTestFlash === 'end' ? ' nmSpeedTestCard--effectEnd' : '')
              }
            >
              <div className="nmCardHeader">
                <div className="nmCardTitle">Teste de Velocidade</div>
                <div className="nmCardTitle" style={{ opacity: 0.75 }}>
                  Internet
                </div>
              </div>
              <div className="nmCardBody">
                <div className="nmSpeedTestContainer">
                  <div className="nmSpeedMeter">
                    <svg className="nmSpeedMeterSvg" viewBox="0 0 200 200">
                      <circle
                        className="nmSpeedMeterBg"
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="14"
                      />
                      <circle
                        className="nmSpeedMeterProgress"
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="url(#speedGradient)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - speedTest.progress / 100)}`}
                        transform="rotate(-90 100 100)"
                      />
                      <defs>
                        <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="50%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="nmSpeedMeterContent">
                      {speedTest.status === 'testing' ? (
                        <>
                          <div className="nmSpeedMeterValue">
                            {speedTest.currentPhase === 'ping' && 'Testando Ping...'}
                            {speedTest.currentPhase === 'download' && (
                              speedTest.download != null ? `${speedTest.download.toFixed(2)}` : '0.00'
                            )}
                            {speedTest.currentPhase === 'upload' && (
                              speedTest.upload != null ? `${speedTest.upload.toFixed(2)}` : '0.00'
                            )}
                          </div>
                          <div className="nmSpeedMeterUnit">
                            {speedTest.currentPhase === 'download' || speedTest.currentPhase === 'upload' ? 'Mbps' : ''}
                          </div>
                          <div className="nmSpeedMeterPhase">
                            {speedTest.currentPhase === 'ping' && 'Medindo latência'}
                            {speedTest.currentPhase === 'download' && 'Testando download'}
                            {speedTest.currentPhase === 'upload' && 'Testando upload'}
                          </div>
                        </>
                      ) : speedTest.status === 'complete' ? (
                        <>
                          <div className="nmSpeedMeterValue">
                            {speedTest.download != null ? speedTest.download.toFixed(2) : '—'}
                          </div>
                          <div className="nmSpeedMeterUnit">Mbps</div>
                          <div className="nmSpeedMeterPhase">Download</div>
                        </>
                      ) : (
                        <>
                          <div className="nmSpeedMeterValue">—</div>
                          <div className="nmSpeedMeterUnit">Mbps</div>
                          <div className="nmSpeedMeterPhase">Pronto para testar</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="nmSpeedStats">
                    <div className="nmSpeedStat nmSpeedStatTooltip">
                      <div className="nmSpeedStatLabel">Download</div>
                      <div className="nmSpeedStatValue">
                        {speedTest.download != null ? `${speedTest.download.toFixed(2)} Mbps` : '—'}
                      </div>
                      {speedTest.downloadHistory.length > 0 && (
                        <div className="nmSpeedChart">
                          {speedTest.downloadHistory.map((val, i) => {
                            const max = Math.max(...speedTest.downloadHistory, 1)
                            const height = (val / max) * 100
                            return (
                              <div
                                key={i}
                                className="nmSpeedChartBar"
                                style={{ height: `${height}%` }}
                              />
                            )
                          })}
                        </div>
                      )}
                      <div className="nmTooltip">
                        <div className="nmTooltipTitle">{getDownloadInfo(speedTest.download).title}</div>
                        <div className="nmTooltipDescription">{getDownloadInfo(speedTest.download).description}</div>
                        <div className="nmTooltipTips">
                          <div className="nmTooltipTipsTitle">💡 Sugestões:</div>
                          <ul className="nmTooltipTipsList">
                            {getDownloadInfo(speedTest.download).tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="nmSpeedStat nmSpeedStatTooltip">
                      <div className="nmSpeedStatLabel">Upload</div>
                      <div className="nmSpeedStatValue">
                        {speedTest.upload != null ? `${speedTest.upload.toFixed(2)} Mbps` : '—'}
                      </div>
                      {speedTest.uploadHistory.length > 0 && (
                        <div className="nmSpeedChart">
                          {speedTest.uploadHistory.map((val, i) => {
                            const max = Math.max(...speedTest.uploadHistory, 1)
                            const height = (val / max) * 100
                            return (
                              <div
                                key={i}
                                className="nmSpeedChartBar"
                                style={{ height: `${height}%` }}
                              />
                            )
                          })}
                        </div>
                      )}
                      <div className="nmTooltip">
                        <div className="nmTooltipTitle">{getUploadInfo(speedTest.upload).title}</div>
                        <div className="nmTooltipDescription">{getUploadInfo(speedTest.upload).description}</div>
                        <div className="nmTooltipTips">
                          <div className="nmTooltipTipsTitle">💡 Sugestões:</div>
                          <ul className="nmTooltipTipsList">
                            {getUploadInfo(speedTest.upload).tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="nmSpeedStat nmSpeedStatTooltip">
                      <div className="nmSpeedStatLabel">Ping</div>
                      <div className="nmSpeedStatValue">
                        {speedTest.ping != null ? `${Math.round(speedTest.ping)} ms` : '—'}
                      </div>
                      {speedTest.ping != null && (
                        <div className="nmPingQuality">
                          {(() => {
                            const quality = getPingQuality(speedTest.ping!)
                            return (
                              <>
                                <span
                                  className={['nmPingQualityDot', `nmPingQuality${quality.quality.charAt(0).toUpperCase() + quality.quality.slice(1)}`].join(' ')}
                                  style={{ backgroundColor: quality.color }}
                                />
                                <span className="nmPingQualityLabel" style={{ color: quality.color }}>
                                  {quality.label}
                                </span>
                              </>
                            )
                          })()}
                        </div>
                      )}
                      <div className="nmTooltip">
                        <div className="nmTooltipTitle">{getPingInfo(speedTest.ping).title}</div>
                        <div className="nmTooltipDescription">{getPingInfo(speedTest.ping).description}</div>
                        <div className="nmTooltipTips">
                          <div className="nmTooltipTipsTitle">💡 Sugestões:</div>
                          <ul className="nmTooltipTipsList">
                            {getPingInfo(speedTest.ping).tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="nmSpeedTestActions">
                    {speedTest.status === 'testing' ? (
                      <button
                        className="nmPrimaryBtn nmDangerBtn"
                        onClick={stopSpeedTest}
                        disabled={!isElectron}
                      >
                        Parar Teste
                      </button>
                    ) : (
                      <button
                        className="nmPrimaryBtn"
                        onClick={startSpeedTest}
                        disabled={!isElectron}
                      >
                        Iniciar Teste de Velocidade
                      </button>
                    )}
                    <div className="nmHint">
                      {isElectron
                        ? 'O teste mede download, upload e latência em tempo real.'
                        : 'Abra via Electron para executar o teste de velocidade.'}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default App
