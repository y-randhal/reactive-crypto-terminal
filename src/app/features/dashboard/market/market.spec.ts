import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Market } from './market';
import { BinanceStream } from '@shared/services/binance-stream';
import {
  createMockTicker,
  MockBinanceStream,
} from '@shared/testing/mock-binance-stream';

describe('Market', () => {
  let component: Market;
  let fixture: ComponentFixture<Market>;
  let mockBinanceStream: MockBinanceStream;

  beforeEach(async () => {
    mockBinanceStream = new MockBinanceStream();

    await TestBed.configureTestingModule({
      imports: [Market],
      providers: [{ provide: BinanceStream, useValue: mockBinanceStream }],
    }).compileComponents();

    fixture = TestBed.createComponent(Market);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show loading state when no data', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-spinner')).toBeTruthy();
    expect(compiled.textContent).toContain('Connecting');
  });

  it('should call emitTicker and update mock state', () => {
    mockBinanceStream.emitTicker(
      createMockTicker({ symbol: 'ethusdt', lastPrice: 3000 }),
    );
    expect(mockBinanceStream.connectionStatus()).toBe('connected');
  });

  it('should call emitConnectionStatus', () => {
    mockBinanceStream.emitConnectionStatus('connected');
    expect(mockBinanceStream.connectionStatus()).toBe('connected');
  });

  it('should call emitError and set error state', () => {
    mockBinanceStream.emitError('Connection failed');
    expect(mockBinanceStream.connectionStatus()).toBe('error');
    expect(mockBinanceStream.errorMessage()).toBe('Connection failed');
  });
});
