import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BinanceStream } from '../../services/binance-stream';
import { TICKER_MAPPINGS } from '../../models/ticker-mappings';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule, MatIconModule, MatFormFieldModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {
  private binanceStream = inject(BinanceStream);

  tickerControl = new FormControl<string>('', { nonNullable: true });
  errorMessage = '';

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
