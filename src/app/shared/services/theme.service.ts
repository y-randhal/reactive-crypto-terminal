import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'darkMode';

  readonly isDarkMode = signal(false);

  constructor() {
    this.loadSavedTheme();
  }

  toggle(): void {
    this.isDarkMode.update((value) => !value);
    this.applyTheme(this.isDarkMode());
    this.persistTheme(this.isDarkMode());
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
  }

  private loadSavedTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved !== null) {
      const isDark = saved === 'true';
      this.isDarkMode.set(isDark);
      this.applyTheme(isDark);
    }
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.toggle('dark-theme', isDark);
  }

  private persistTheme(isDark: boolean): void {
    localStorage.setItem(this.STORAGE_KEY, isDark.toString());
  }
}
