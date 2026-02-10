import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CryptoTicker } from '../models/binance.model';
import type { ConnectionStatus } from '../services/binance-stream';

export const createMockTicker = (
  overrides: Partial<CryptoTicker> = {},
): CryptoTicker => ({
  symbol: 'btcusdt',
  lastPrice: 50000,
  priceChange: 500,
  priceChangePercent: 1.0,
  highPrice: 51000,
  lowPrice: 49000,
  openPrice: 49500,
  volumeBase: 1000,
  volumeQuote: 50000000,
  totalTrades: 100000,
  eventTime: new Date(),
  ...overrides,
});

@Injectable()
export class MockBinanceStream {
  private readonly tickerSubject = new BehaviorSubject<CryptoTicker | null>(
    null,
  );
  readonly ticker$ = this.tickerSubject.asObservable();
  readonly connectionStatus = signal<ConnectionStatus>('connected');
  readonly errorMessage = signal<string | null>(null);
  readonly currentTicker = signal<string>('btcusdt');

  setTicker(ticker: string): void {
    this.currentTicker.set(ticker.toLowerCase());
    this.tickerSubject.next(createMockTicker({ symbol: ticker.toLowerCase() }));
  }

  getCurrentTicker(): string {
    return this.currentTicker() ?? 'btcusdt';
  }

  emitTicker(ticker: CryptoTicker): void {
    this.tickerSubject.next(ticker);
  }

  emitConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus.set(status);
  }

  emitError(message: string): void {
    this.errorMessage.set(message);
    this.connectionStatus.set('error');
  }
}
