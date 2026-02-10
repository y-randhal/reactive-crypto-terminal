import { TestBed } from '@angular/core/testing';
import { BinanceStream } from './binance-stream';

describe('BinanceStream', () => {
  let service: BinanceStream;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinanceStream);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default ticker on init', () => {
    expect(service.getCurrentTicker()).toBe('btcusdt');
  });

  it('should update ticker via setTicker', () => {
    service.setTicker('ethusdt');
    expect(service.getCurrentTicker()).toBe('ethusdt');
  });

  it('should normalize ticker to lowercase', () => {
    service.setTicker('BTCUSDT');
    expect(service.getCurrentTicker()).toBe('btcusdt');
  });

  it('should expose ticker$ observable', () => {
    expect(service.ticker$).toBeDefined();
  });
});
