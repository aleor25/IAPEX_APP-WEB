import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ThemeService } from './core/services/util/theme.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, ToastComponent, SidebarComponent, NavbarComponent]
})
export class AppComponent {
  title = 'IAPEX';

  private _themeService = inject(ThemeService);
  private _router = inject(Router);

  isAuthRoute(): boolean {
    return this._router.url.includes('/auth');
  }

  isRestorePasswordRoute(): boolean {
    return this._router.url.includes('/auth/forgot-password')
  }

  constructor() {
    this._themeService.themeSignal();
  }
}
