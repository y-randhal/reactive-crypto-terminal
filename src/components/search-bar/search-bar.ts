import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BinanceStream } from '../../services/binance-stream';
import { TICKER_MAPPINGS } from '../../models/ticker-mappings';

@Component({
  selector: 'search-bar',
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  standalone: true
})
export class SearchBar {
  tickerInput: string = '';
  errorMessage: string = '';

  constructor(private binanceStream: BinanceStream) {}

  onSearch() {
    const input = this.tickerInput.trim().toLowerCase();

    if (!input) {
      this.errorMessage = 'Please enter a ticker symbol';
      return;
    }

    const normalizedTicker = this.normalizeTicker(input);

    if (normalizedTicker) {
      this.errorMessage = '';
      this.binanceStream.setTicker(normalizedTicker);
    } else {
      this.errorMessage = `Ticker "${this.tickerInput}" not found. Try: BTC, ETH, SOL, etc.`;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  private normalizeTicker(input: string): string | null {
    const lowerInput = input.toLowerCase();

    if (TICKER_MAPPINGS[lowerInput]) {
      return TICKER_MAPPINGS[lowerInput];
    }

    if (lowerInput.endsWith('usdt')) {
      return lowerInput;
    }

    const withUsdt = lowerInput + 'usdt';
    if (TICKER_MAPPINGS[withUsdt]) {
      return TICKER_MAPPINGS[withUsdt];
    }

    return null;
  }
}
