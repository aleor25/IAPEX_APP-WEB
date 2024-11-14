import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ThemeService } from './core/services/util/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, ToastComponent]
})
export class AppComponent {
  title = 'IAPEX';

  private _themeService = inject(ThemeService);

  constructor() {
    this._themeService.themeSignal();
  }
}
