# NetMonitor

<div align="center">

![Electron](https://img.shields.io/badge/Electron-30-47848F?logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

**Monitor de conectividade de rede com telemetria em tempo real**

[Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Tecnologias](#-tecnologias)

![NetMonitor — Interface do aplicativo](public/netmonitor.gif)

</div>

---

## 📋 Sobre o projeto

O **NetMonitor** é um aplicativo desktop multiplataforma para monitoramento de conectividade de rede. Desenvolvido com Electron e React, oferece monitoramento contínuo via ping, testes de velocidade (download/upload) e notificações em tempo real quando ocorrem problemas de conexão.

O aplicativo roda na bandeja do sistema e continua monitorando mesmo com a janela fechada, ideal para usuários que precisam acompanhar a estabilidade da internet em segundo plano.

---

## ✨ Funcionalidades

### Monitoramento Ping
- Ping contínuo para `8.8.8.8` (Google DNS) em tempo real
- Gráfico de latência dos últimos 5 minutos
- Detecção automática de erros: timeout, host inacessível, falhas
- Log detalhado com timestamp e cores para erros
- Estatísticas: total de linhas, contagem de falhas
- Filtros: somente falhas, busca no log
- Opções: limpar log, copiar, exportar em arquivo `.txt`
- Auto-scroll configurável

### Teste de Velocidade
- Medição de ping, download e upload (servidores Cloudflare)
- Feedback em tempo real com barras de progresso
- Gráficos de evolução durante o teste
- Análise de qualidade e dicas personalizadas:
  - **Download**: Excelente, Boa, Regular ou Baixa (com orientações)
  - **Upload**: mesma classificação com recomendações
  - **Latência**: Excelente (≤20 ms), Bom (≤50 ms), Regular (≤100 ms), Ruim

### Interface e Integração
- Janela personalizada sem borda nativa (title bar customizada)
- Minimizar para bandeja (não fecha o app)
- Ícone na bandeja com estados: Conectado / Desconectado / Monitorando
- Menu de contexto na bandeja:
  - Abrir NetMonitor
  - Iniciar/Pausar monitoramento
  - Executar teste de velocidade
  - Sair
- Notificações do sistema ao detectar problemas de conexão (com cooldown de 30 s)

---

## 🛠 Tecnologias

| Stack | Tecnologia |
|-------|------------|
| **Desktop** | Electron 30 |
| **Frontend** | React 18 + TypeScript |
| **Build** | Vite 5 |
| **Empacotamento** | electron-builder |

### Estrutura do projeto
```
net-monitor/
├── electron/          # Processo principal Electron
│   ├── main.ts        # Janela, tray, ping, speed test, notificações
│   └── preload.ts     # API segura (contextBridge) para o renderer
├── src/               # Frontend React
│   ├── App.tsx        # UI principal (abas, gráficos, lógica)
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── dist/              # Build do renderer (Vite)
├── dist-electron/     # Build do main + preload
└── package.json
```

---

## 🚀 Instalação

### Pré-requisitos
- **Node.js** 18+ (recomendado LTS)
- **npm** ou **pnpm**

### Desenvolvimento
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/net-monitor.git
cd net-monitor

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### Build para produção
```bash
npm run build
```

O comando `build` executa `tsc`, `vite build` e `electron-builder`. O executável gerado ficará em `dist/` (ou conforme configurado no electron-builder).

### Scripts disponíveis
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia Vite + Electron em modo desenvolvimento |
| `npm run build` | Compila TypeScript, build Vite e empacota com electron-builder |
| `npm run lint` | Executa ESLint em `.ts` e `.tsx` |
| `npm run preview` | Preview do build Vite (modo web) |

---

## 📌 Observações

- **Sistema operacional**: O monitoramento via ping usa o comando nativo do SO (`ping 8.8.8.8 -t` no Windows). O app foi testado em Windows.
- **Modo web**: Rodando sem Electron (`npm run preview`), a interface carrega, mas funções que dependem de IPC (ping, speed test, tray) não funcionarão — o status mostrará "Modo web (IPC indisponível)".
- **Janela fixa**: A janela principal tem tamanho fixo (1200×800 px) e não é redimensionável.

---

## 📄 Licença

Este projeto está sob licença privada (`"private": true` no `package.json`). Consulte os termos antes de reutilizar ou redistribuir.

---

<div align="center">

**NetMonitor** — Monitor de conectividade com telemetria em tempo real

</div>
