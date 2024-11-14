import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeSignal = signal<string>(
    window.localStorage.getItem('themeSignal') ?? 'dark'
  );

  updateTheme() {
    this.themeSignal.update((value) => (value === 'light' ? 'dark' : 'light'));
  }

  constructor() {
    effect(() => {
      console.log('ThemeService: ', this.themeSignal());
      document.documentElement.setAttribute('data-bs-theme', this.themeSignal());
      window.localStorage.setItem('themeSignal', this.themeSignal());
    });
  }
}