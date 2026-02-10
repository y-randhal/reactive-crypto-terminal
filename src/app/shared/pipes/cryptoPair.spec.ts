import { CryptoPairPipe } from './cryptoPair';

describe('CryptoPairPipe', () => {
  const pipe = new CryptoPairPipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as unknown as string)).toBe('');
  });

  it('should format USDT pairs correctly', () => {
    expect(pipe.transform('btcusdt')).toBe('BTC/USDT');
    expect(pipe.transform('BTCUSDT')).toBe('BTC/USDT');
    expect(pipe.transform('ethusdt')).toBe('ETH/USDT');
  });

  it('should format USDC pairs correctly', () => {
    expect(pipe.transform('btcusdc')).toBe('BTC/USDC');
  });

  it('should format other quote assets correctly', () => {
    expect(pipe.transform('ethbtc')).toBe('ETH/BTC');
  });

  it('should return uppercase for unknown format', () => {
    expect(pipe.transform('xyz')).toBe('XYZ');
  });

  it('should handle symbol with no matching quote asset', () => {
    expect(pipe.transform('unknown')).toBe('UNKNOWN');
  });
});
