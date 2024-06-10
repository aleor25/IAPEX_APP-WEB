import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ForgetpassComponent } from './features/forgetpass/forgetpass.component';
import { GeneralViewComponent } from './features/general-view/general-view.component';

export const routes: Routes = [
    {
         path: 'login',
        component: LoginComponent 
    },
    { 
        path: 'register', 
        component: RegisterComponent 
    },
    { 
        path: 'forgetpass', 
        component: ForgetpassComponent 
    },
    { 
        path: 'general-view', 
        component: GeneralViewComponent 
    },
];
