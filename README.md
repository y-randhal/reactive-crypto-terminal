# Reactive Crypto Terminal

Real-time cryptocurrency market data powered by RxJS and Angular. View live prices, interactive candlestick charts, and search for your favorite pairs via Binance WebSocket.

## Features

- **Live prices** – WebSocket connection to Binance for real-time ticker data
- **Candlestick chart** – Interactive price chart built with Lightweight Charts
- **Search** – Look up pairs by ticker (BTC, ETH, SOL, etc.) or symbol name
- **Quick select** – One-click chips for popular pairs
- **Dark mode** – Toggle between light and dark themes
- **Responsive** – Works on desktop and mobile

## Tech Stack

- **Angular 20** – Standalone components, signals, `inject()`
- **RxJS** – WebSocket streams, reactive patterns
- **Angular Material** – UI components
- **Lightweight Charts** – Candlestick charts
- **TypeScript 5.8**

## Getting Started

### Prerequisites

- **Node.js 20+**
- **npm**

### Install and run

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Production build (output in `dist/`) |
| `npm run watch` | Build in watch mode |
| `npm test` | Run unit tests (watch mode) |
| `npm run test:ci` | Run tests once (for CI) |

## Project Structure

```
src/app/
├── features/
│   ├── home/              # Landing page
│   └── dashboard/         # Market data, chart, search bar
│       ├── chart/
│       ├── market/
│       └── search-bar/
├── shared/
│   ├── layout/navbar/     # App shell, navigation
│   ├── services/          # BinanceStream, ThemeService
│   ├── pipes/             # cryptoPair
│   ├── models/            # Types, ticker mappings
│   └── testing/           # MockBinanceStream for tests
```

Path aliases: `@shared/*`, `@features/*`

## CI/CD

- **GitHub Actions** – Build and tests run on push/PR to `main`
- **Husky** – Pre-commit hooks run Prettier and `npm run build`

## License

MIT
