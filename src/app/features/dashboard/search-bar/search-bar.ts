import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BinanceStream } from '@shared/services/binance-stream';
import { TICKER_MAPPINGS } from '@shared/models/ticker-mappings';

const QUICK_PAIRS = [
  { label: 'BTC', ticker: 'btcusdt' },
  { label: 'ETH', ticker: 'ethusdt' },
  { label: 'SOL', ticker: 'solusdt' },
  { label: 'BNB', ticker: 'bnbusdt' },
  { label: 'XRP', ticker: 'xrpusdt' },
  { label: 'DOGE', ticker: 'dogeusdt' },
  { label: 'ADA', ticker: 'adausdt' },
  { label: 'LTC', ticker: 'ltcusdt' },
];

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatChipsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  private binanceStream = inject(BinanceStream);

  protected readonly quickPairs = QUICK_PAIRS;
  tickerControl = new FormControl<string>('', { nonNullable: true });
  errorMessage = '';

  selectPair(ticker: string): void {
    this.binanceStream.setTicker(ticker);
    this.tickerControl.setValue('');
    this.errorMessage = '';
  }

  isSelected(ticker: string): boolean {
    return this.binanceStream.currentTicker() === ticker;
  }

  onSearch() {
    const input = this.tickerControl.value.trim().toLowerCase();

    if (!input) {
      this.errorMessage = 'Please enter a ticker symbol';
      return;
    }

    const normalizedTicker = this.normalizeTicker(input);

    if (normalizedTicker) {
      this.errorMessage = '';
      this.binanceStream.setTicker(normalizedTicker);
    } else {
      this.errorMessage = `Ticker "${this.tickerControl.value}" not found. Try: BTC, ETH, SOL, etc.`;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  clearError() {
    this.errorMessage = '';
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
