import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeneralViewComponent } from "./features/general-view/general-view.component";
import { ForgetpassComponent } from './features/forgetpass/forgetpass.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';

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
