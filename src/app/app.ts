import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarketComponent } from "../components/market/market";
import { SearchBar } from '../components/search-bar/search-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MarketComponent, SearchBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('reactive-crypto-terminal');
}
