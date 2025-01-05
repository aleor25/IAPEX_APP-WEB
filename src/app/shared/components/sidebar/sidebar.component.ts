import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/util/theme.service';
import { NgClass } from '@angular/common';
import { RoleName } from '../../../core/models/role.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  userRole!: RoleName;
  RoleName = RoleName;

  private _router = inject(Router);
  private _authService = inject(AuthService);
  public _themeService = inject(ThemeService);
  
  ngOnInit(): void {
    this.userRole = this._authService.getRole() as RoleName;
  }

  toggleTheme() {
    this._themeService.updateTheme();
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/auth/login']);
  }
}