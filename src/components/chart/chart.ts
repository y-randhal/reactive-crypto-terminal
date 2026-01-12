import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { createChart, IChartApi, CandlestickData, Time, CandlestickSeries } from 'lightweight-charts';
import { CryptoTicker } from '../../models/binance.model';

@Component({
  selector: 'chart',
  templateUrl: './chart.html',
  styleUrl: './chart.scss',
  standalone: true
})
export class Chart implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input() cryptoData?: CryptoTicker;

  private chart!: IChartApi;
  private candlestickSeries: any;
  private currentCandle: CandlestickData | null = null;
  private candleInterval = 60000;
  private themeObserver?: MutationObserver;

  ngOnInit() {
    console.log('Chart component initialized');
    // Listen for theme changes
    this.themeObserver = new MutationObserver(() => {
      this.reinitializeChart();
    });
    this.themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  ngAfterViewInit() {
    console.log('AfterViewInit - initializing chart');
    setTimeout(() => {
      this.initChart();
    }, 0);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.remove();
    }
    window.removeEventListener('resize', this.handleResize);
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  }

  ngOnChanges() {
    if (this.candlestickSeries && this.cryptoData) {
      this.updateChart(this.cryptoData);
    }
  }

  private reinitializeChart() {
    if (this.chart) {
      this.chart.remove();
      this.chart = undefined as any;
    }
    setTimeout(() => {
      this.initChart();
    }, 0);
  }

  private initChart() {
    console.log('Initializing chart, container:', this.chartContainer?.nativeElement);

    if (!this.chartContainer?.nativeElement) {
      console.error('Chart container not found!');
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

    console.log('Chart created:', this.chart);

    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    console.log('Candlestick series added:', this.candlestickSeries);

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
    console.log('Updating chart with data:', data);
    
    const timestamp = Math.floor(data.eventTime.getTime() / this.candleInterval) * this.candleInterval;
    const time = (timestamp / 1000) as Time;
    const price = data.lastPrice;

    console.log('Calculated time:', time, 'price:', price);

    if (!this.currentCandle || this.currentCandle.time !== time) {
      if (this.currentCandle) {
        console.log('Updating previous candle:', this.currentCandle);
        this.candlestickSeries.update(this.currentCandle);
      }
      this.currentCandle = {
        time,
        open: price,
        high: price,
        low: price,
        close: price,
      };
      console.log('Created new candle:', this.currentCandle);
    } else {
      this.currentCandle.high = Math.max(this.currentCandle.high, price);
      this.currentCandle.low = Math.min(this.currentCandle.low, price);
      this.currentCandle.close = price;
      console.log('Updated current candle:', this.currentCandle);
    }

    this.candlestickSeries.update(this.currentCandle);
  }
}
