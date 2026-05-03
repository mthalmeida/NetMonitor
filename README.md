<div align="center">

<!-- Logo com altura automática para preservar a proporção original -->
<img src="https://raw.githubusercontent.com/mthalmeida/NetMonitor/refs/heads/main/src/assets/logo_app.png" alt="NetMonitor Logo" width="500" height="auto" />

<br>

**Monitor de conectividade de rede com telemetria em tempo real**

[![Electron](https://img.shields.io/badge/Electron-30-47848F?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)

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
- **Ping contínuo**: Monitoramento para `8.8.8.8` (Google DNS) em tempo real.
- **Visualização**: Gráfico de latência dos últimos 5 minutos.
- **Diagnóstico**: Detecção automática de erros (timeout, host inacessível, falhas).
- **Gestão de Logs**: Log detalhado com timestamp, filtros de busca, exportação para `.txt` e auto-scroll.

### Teste de Velocidade
- **Métricas**: Medição de ping, download e upload utilizando servidores Cloudflare.
- **Feedback Visual**: Barras de progresso e gráficos de evolução durante o teste.
- **Análise Inteligente**: Classificação de qualidade (Excelente a Baixa) com dicas personalizadas baseadas nos resultados.

### Interface e Integração
- **Custom UI**: Janela personalizada sem bordas nativas (title bar customizada).
- **System Tray**: Minimiza para a bandeja com ícone de estado dinâmico (Conectado/Desconectado).
- **Menu Rápido**: Acesso a testes e controles diretamente pelo botão direito no ícone da bandeja.
- **Alertas**: Notificações nativas do sistema ao detectar instabilidades (com cooldown de 30s).

---

## 🛠 Tecnologias

| Stack | Tecnologia |
|-------|------------|
| **Desktop** | Electron 30 |
| **Frontend** | React 18 + TypeScript |
| **Build** | Vite 5 |
| **Empacotamento** | electron-builder |

### Estrutura do projeto
