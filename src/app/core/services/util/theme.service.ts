import { effect, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    themeSignal = signal<string>(
        JSON.parse(window.localStorage.getItem('themeSignal') ?? 'dark')
    );

    updateTheme() {
        this.themeSignal.update((value) => (value === 'ligth' ? 'dark' : 'ligth'));
    }

    constructor() {
        effect(() => {
            console.log('ThemeService: ', this.themeSignal());
            document.documentElement.setAttribute('data-bs-theme', this.themeSignal());
            window.localStorage.setItem('themeSignal', JSON.stringify(this.themeSignal()));
        });
    }
}
