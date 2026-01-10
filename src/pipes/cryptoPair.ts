import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cryptoPair',
  standalone: true
})
export class CryptoPairPipe implements PipeTransform {
  private readonly quoteAssets = ['USDT', 'USDC', 'BTC', 'ETH', 'BNB', 'DAI', 'USD', 'EUR'];

  transform(value: string): string {
    if (!value) return '';
    
    const upper = value.toUpperCase();
    
    // Find matching quote asset
    const match = this.quoteAssets.find(quote => upper.endsWith(quote));
    
    if (match) {
      const base = upper.replace(new RegExp(`${match}$`), '');
      return `${base}/${match}`;
    }

    return upper;
  }
}