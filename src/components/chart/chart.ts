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

  ngOnInit() {
    console.log('Chart component initialized');
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
  }

  ngOnChanges() {
    if (this.candlestickSeries && this.cryptoData) {
      this.updateChart(this.cryptoData);
    }
  }

  private initChart() {
    console.log('Initializing chart, container:', this.chartContainer?.nativeElement);

    if (!this.chartContainer?.nativeElement) {
      console.error('Chart container not found!');
      return;
    }

    const containerWidth = this.chartContainer.nativeElement.clientWidth;
    const width = containerWidth > 0 ? containerWidth : 600;

    this.chart = createChart(this.chartContainer.nativeElement, {
      width: width,
      height: 400,
      layout: {
        background: { color: '#1e1e1e' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2b2b43' },
        horzLines: { color: '#2b2b43' },
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
