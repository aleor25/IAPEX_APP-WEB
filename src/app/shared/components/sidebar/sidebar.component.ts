import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/util/theme.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  private _router = inject(Router);
  private _authService = inject(AuthService);
  public _themeService = inject(ThemeService);

  toggleTheme() {
    this._themeService.updateTheme();
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/auth/login']);
  }
}