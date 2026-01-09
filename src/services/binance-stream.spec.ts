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
});
