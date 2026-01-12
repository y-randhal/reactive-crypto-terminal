import { Component, OnInit, OnDestroy } from '@angular/core';
import { BinanceStream } from '../../services/binance-stream';
import { Subscription, sampleTime } from 'rxjs';
import { CryptoTicker } from '../../models/binance.model';
import { CryptoPairPipe } from '../../pipes/cryptoPair';
import { Chart } from '../chart/chart';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'market',
  imports: [MatProgressSpinnerModule, CryptoPairPipe, Chart],
  templateUrl: './market.html',
  styleUrl: './market.scss',
  standalone: true
})
export class Market implements OnInit, OnDestroy {
  private subscription!: Subscription;
  cryptoData?: CryptoTicker;

  constructor(private binanceStream: BinanceStream) {}

  ngOnInit() {
    console.log('Market component initialized');
    this.subscription = this.binanceStream.ticker$
      .pipe(sampleTime(100))
      .subscribe((data: CryptoTicker) => {
        console.log('Received ticker data:', data);
        this.cryptoData = data;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}