import { Component } from '@angular/core';
import { SearchBar } from './search-bar/search-bar';
import { Market } from './market/market';

@Component({
  selector: 'app-dashboard',
  imports: [SearchBar, Market],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
})
export class Dashboard {}
