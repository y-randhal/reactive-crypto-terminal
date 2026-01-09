import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { timer, share, Observable, retry } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BinanceStream {
  private socket$: WebSocketSubject<any>;
  public ticker$: Observable<any>;

  constructor() {
    this.socket$ = webSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    this.ticker$ = this.socket$.pipe(
      retry({
        delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1000)
      }),
      share()
    );
  }
}