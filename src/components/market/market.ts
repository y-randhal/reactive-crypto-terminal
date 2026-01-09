import { Component, OnInit } from '@angular/core';
import { BinanceStream } from '../../services/binance-stream';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'market',
  imports: [JsonPipe],
  templateUrl: './market.html',
  styleUrl: './market.scss',
  standalone: true
})
export class MarketComponent implements OnInit {
  constructor(
    private binanceStream: BinanceStream
  ) {}
cryptoData:any
  ngOnInit() {
    this.binanceStream.ticker$.subscribe(data => this.cryptoData = data);
  }
}