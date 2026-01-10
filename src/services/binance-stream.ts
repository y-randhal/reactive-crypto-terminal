import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { timer, share, Observable, retry, BehaviorSubject, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BinanceRawTicker, CryptoTicker } from '../models/binance.model';

@Injectable({
  providedIn: 'root',
})
export class BinanceStream {
  private socket$!: WebSocketSubject<BinanceRawTicker>;
  public ticker$: Observable<CryptoTicker>;
  private tickerSubject = new BehaviorSubject<string>('btcusdt');

  constructor() {
    this.ticker$ = this.tickerSubject.pipe(
      switchMap(ticker => {
        if (this.socket$) {
          this.socket$.complete();
        }
        this.socket$ = webSocket(`wss://stream.binance.com:9443/ws/${ticker}@ticker`);
        return this.socket$.pipe(
          retry({
            delay: (_, retryCount) => timer(Math.pow(2, retryCount) * 1000)
          }),
          map((data: BinanceRawTicker): CryptoTicker => {
            return {
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
            };
          })
        );
      }),
      share()
    );
  }

  setTicker(ticker: string) {
    this.tickerSubject.next(ticker.toLowerCase());
  }

  getCurrentTicker(): string {
    return this.tickerSubject.value;
  }
}