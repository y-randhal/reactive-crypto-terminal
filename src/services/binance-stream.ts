import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { timer, Observable, retry, BehaviorSubject, switchMap, catchError, of, tap, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, signal, computed } from '@angular/core';
import { BinanceRawTicker, CryptoTicker } from '../models/binance.model';

export type ConnectionStatus = 'connecting' | 'connected' | 'error' | 'disconnected';

@Injectable({
  providedIn: 'root',
})
export class BinanceStream {
  private socket: WebSocketSubject<BinanceRawTicker> | null = null;
  private readonly connectionStatusSignal = signal<ConnectionStatus>('connecting');
  private readonly errorMessageSignal = signal<string | null>(null);

  readonly connectionStatus = computed(() => this.connectionStatusSignal());
  readonly errorMessage = computed(() => this.errorMessageSignal());
  readonly currentTicker = signal<string>('btcusdt');

  readonly ticker$: Observable<CryptoTicker>;
  private readonly tickerSubject = new BehaviorSubject<string>('btcusdt');

  constructor() {
    this.ticker$ = this.tickerSubject.pipe(
      switchMap(ticker => {
        this.closeSocket();
        this.connectionStatusSignal.set('connecting');
        this.errorMessageSignal.set(null);

        this.socket = webSocket<BinanceRawTicker>(`wss://stream.binance.com:9443/ws/${ticker}@ticker`);

        return this.socket.pipe(
          tap({
            next: () => {
              this.connectionStatusSignal.set('connected');
              this.errorMessageSignal.set(null);
            },
            error: (err) => {
              this.connectionStatusSignal.set('error');
              this.errorMessageSignal.set(err?.message ?? 'Connection failed');
            }
          }),
          retry({
            delay: (_, retryCount) => timer(Math.pow(2, Math.min(retryCount, 5)) * 1000)
          }),
          map((data: BinanceRawTicker): CryptoTicker => ({
            symbol: data.s,
            lastPrice: parseFloat(data.c),
            priceChange: parseFloat(data.p),
            priceChangePercent: parseFloat(data.P),
            highPrice: parseFloat(data.h),
            lowPrice: parseFloat(data.l),
            openPrice: parseFloat(data.o),
            volumeBase: parseFloat(data.v),
            volumeQuote: parseFloat(data.q),
            totalTrades: data.n,
            eventTime: new Date(data.E)
          })),
          catchError(err => {
            this.connectionStatusSignal.set('error');
            this.errorMessageSignal.set(err?.message ?? 'Connection failed');
            return of();
          })
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.complete();
      this.socket = null;
    }
    this.connectionStatusSignal.set('disconnected');
  }

  setTicker(ticker: string): void {
    const normalized = ticker.toLowerCase();
    this.currentTicker.set(normalized);
    this.tickerSubject.next(normalized);
  }

  getCurrentTicker(): string {
    return this.tickerSubject.value;
  }
}