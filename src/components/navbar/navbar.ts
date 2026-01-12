import { Component, inject, signal, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SearchBar } from '../search-bar/search-bar';
import { Market } from "../market/market";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatSlideToggleModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink
]
})
export class Navbar implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  isDarkMode = signal(false);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      const isDark = savedTheme === 'true';
      this.isDarkMode.set(isDark);
      document.body.classList.toggle('dark-theme', isDark);
    }
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);
    const isDark = this.isDarkMode();
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }
}
