import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BinanceStream } from '../../services/binance-stream';
import { sampleTime } from 'rxjs';
import { CryptoTicker } from '../../models/binance.model';
import { CryptoPairPipe } from '../../pipes/cryptoPair';
import { Chart } from '../chart/chart';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'market',
  imports: [MatProgressSpinnerModule, CryptoPairPipe, Chart],
  templateUrl: './market.html',
  styleUrl: './market.scss',
  standalone: true
})
export class Market {
  private binanceStream = inject(BinanceStream);

  cryptoData = toSignal(
    this.binanceStream.ticker$.pipe(sampleTime(100)),
    { requireSync: false }
  );
}