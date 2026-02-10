import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart } from './chart';
import { createMockTicker } from '@shared/testing/mock-binance-stream';
import { ThemeService } from '@shared/services/theme.service';

describe('Chart', () => {
  let component: Chart;
  let fixture: ComponentFixture<Chart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart],
      providers: [ThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(Chart);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render chart container', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.chart-container')).toBeTruthy();
  });

  it('should accept cryptoData input', () => {
    const ticker = createMockTicker({ symbol: 'btcusdt', lastPrice: 50000 });
    fixture.componentRef.setInput('cryptoData', ticker);
    fixture.detectChanges();
    expect(component.cryptoData()).toEqual(ticker);
  });
});
