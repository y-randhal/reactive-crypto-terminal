import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarketComponent } from "../components/market/market";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MarketComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('reactive-crypto-terminal');
}
