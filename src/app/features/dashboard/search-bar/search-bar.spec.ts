import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';
import { BinanceStream } from '@shared/services/binance-stream';
import { MockBinanceStream } from '@shared/testing/mock-binance-stream';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;
  let mockBinanceStream: MockBinanceStream;

  beforeEach(async () => {
    mockBinanceStream = new MockBinanceStream();

    await TestBed.configureTestingModule({
      imports: [SearchBar],
      providers: [{ provide: BinanceStream, useValue: mockBinanceStream }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when search with empty input', () => {
    component.onSearch();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Please enter a ticker symbol');
  });

  it('should call setTicker when valid ticker is searched', () => {
    spyOn(mockBinanceStream, 'setTicker');
    component.tickerControl.setValue('btc');
    component.onSearch();
    expect(mockBinanceStream.setTicker).toHaveBeenCalledWith('btcusdt');
    expect(component.errorMessage).toBe('');
  });

  it('should show error for unknown ticker', () => {
    component.tickerControl.setValue('unknownxyz');
    component.onSearch();
    expect(component.errorMessage).toContain('not found');
  });

  it('should select pair when chip is clicked', () => {
    spyOn(mockBinanceStream, 'setTicker');
    component.selectPair('ethusdt');
    expect(mockBinanceStream.setTicker).toHaveBeenCalledWith('ethusdt');
    expect(component.tickerControl.value).toBe('');
  });

  it('should highlight selected chip', () => {
    mockBinanceStream.setTicker('ethusdt');
    fixture.detectChanges();
    expect(component.isSelected('ethusdt')).toBe(true);
    expect(component.isSelected('btcusdt')).toBe(false);
  });
});
