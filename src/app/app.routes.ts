import { Routes } from '@angular/router';
import { Login } from '@/app/components/login/login';
import { Inicio } from '@/app/components/inicio/inicio';
import { Callback } from '@/app/components/callback/callback';
import { Logout } from './components/logout/logout';

export const routes: Routes = [
    { path: '', component: Inicio },
    { path: 'login', component: Login },
    { path: 'callback', component: Callback },
    { path: 'logout', component: Logout },
];
