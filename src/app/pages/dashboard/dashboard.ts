import { Component } from '@angular/core';
import { SearchBar } from '../../../components/search-bar/search-bar';
import { Market } from '../../../components/market/market';

@Component({
  selector: 'app-dashboard',
  imports: [SearchBar, Market],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true
})
export class Dashboard {

}
