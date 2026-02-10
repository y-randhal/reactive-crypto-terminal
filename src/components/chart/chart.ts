import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  Input,
  inject,
  afterNextRender,
  effect,
} from '@angular/core';
import { createChart, IChartApi, CandlestickData, Time, CandlestickSeries } from 'lightweight-charts';
import { CryptoTicker } from '../../models/binance.model';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.html',
  styleUrl: './chart.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Chart implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input() cryptoData?: CryptoTicker;

  private chart!: IChartApi;
  private candlestickSeries: { update: (data: CandlestickData) => void } | null = null;
  private currentCandle: CandlestickData | null = null;
  private candleInterval = 60000;
  private themeService = inject(ThemeService);

  private themeEffect = effect(() => {
    this.themeService.isDarkMode();
    if (this.chart) {
      this.reinitializeChart();
    }
  });

  ngAfterViewInit() {
    afterNextRender(() => this.initChart());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cryptoData'] && this.candlestickSeries && this.cryptoData) {
      this.updateChart(this.cryptoData);
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.remove();
    }
    window.removeEventListener('resize', this.handleResize);
  }

  private reinitializeChart() {
    if (this.chart) {
      this.chart.remove();
      this.chart = undefined as unknown as IChartApi;
    }
    setTimeout(() => this.initChart(), 0);
  }

  private initChart() {
    if (!this.chartContainer?.nativeElement) {
      return;
    }

    const containerWidth = this.chartContainer.nativeElement.clientWidth;
    const width = containerWidth > 0 ? containerWidth : 600;

    const isDarkMode = document.body.classList.contains('dark-theme');
    const backgroundColor = isDarkMode ? '#1e1e1e' : '#ffffff';
    const textColor = isDarkMode ? '#d1d4dc' : '#191919';
    const gridColor = isDarkMode ? '#2b2b43' : '#e0e0e0';

    this.chart = createChart(this.chartContainer.nativeElement, {
      width: width,
      height: 400,
      layout: {
        background: { color: backgroundColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    if (this.chart && this.chartContainer) {
      this.chart.applyOptions({
        width: this.chartContainer.nativeElement.clientWidth,
      });
    }
  };

  private updateChart(data: CryptoTicker) {
    if (!this.candlestickSeries) return;

    const timestamp = Math.floor(data.eventTime.getTime() / this.candleInterval) * this.candleInterval;
    const time = (timestamp / 1000) as Time;
    const price = data.lastPrice;

    if (!this.currentCandle || this.currentCandle.time !== time) {
      if (this.currentCandle) {
        this.candlestickSeries.update(this.currentCandle);
      }
      this.currentCandle = {
        time,
        open: price,
        high: price,
        low: price,
        close: price,
      };
    } else {
      this.currentCandle.high = Math.max(this.currentCandle.high, price);
      this.currentCandle.low = Math.min(this.currentCandle.low, price);
      this.currentCandle.close = price;
    }

    this.candlestickSeries.update(this.currentCandle);
  }
}
