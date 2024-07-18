import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeneralViewComponent } from "./features/dashboard/general-view/general-view.component";
import { ForgotPasswordComponent } from './features/access/forgot-password/forgot-password.component';
import { LoginComponent } from './features/access/login/login.component';
import { RegisterComponent } from './features/access/register/register.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'IAPEX';
}
