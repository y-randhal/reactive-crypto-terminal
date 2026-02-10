import {
  ChangeDetectionStrategy,
  Component,
  inject,
  effect,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BinanceStream } from '@shared/services/binance-stream';
import { sampleTime } from 'rxjs';
import { CryptoTicker } from '@shared/models/binance.model';
import { CryptoPairPipe } from '@shared/pipes/cryptoPair';
import { Chart } from '../chart/chart';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-market',
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    DecimalPipe,
    CryptoPairPipe,
    Chart,
  ],
  templateUrl: './market.html',
  styleUrl: './market.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Market {
  protected readonly binanceStream = inject(BinanceStream);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      if (this.binanceStream.connectionStatus() === 'error') {
        const msg = this.binanceStream.errorMessage() ?? 'Connection failed';
        this.snackBar.open(`Market data: ${msg}`, 'Dismiss', {
          duration: 5000,
        });
      }
    });
  }

  cryptoData = toSignal(this.binanceStream.ticker$.pipe(sampleTime(100)), {
    requireSync: false,
  });

  readonly isLive = computed(
    () => this.binanceStream.connectionStatus() === 'connected',
  );
}
