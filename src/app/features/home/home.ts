import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  features = [
    {
      icon: 'show_chart',
      title: 'Real-Time Data',
      description:
        'Live cryptocurrency price updates via WebSocket connections',
    },
    {
      icon: 'candlestick_chart',
      title: 'Interactive Charts',
      description: 'Beautiful candlestick charts powered by Lightweight Charts',
    },
    {
      icon: 'search',
      title: 'Smart Search',
      description: 'Search by ticker symbol, name, or trading pair',
    },
    {
      icon: 'dark_mode',
      title: 'Dark Mode',
      description: 'Seamless light and dark theme support',
    },
  ];
}
