import { Routes } from '@angular/router';
import { Login } from '@/app/features/auth/login/login';
import { Callback } from '@/app/features/auth/callback/callback';
import { Logout } from './features/auth/logout/logout';
import { MantenedorTipoReceptorNotificacion } from './features/mantenedores/mantenedor-tipo-receptor-notificacion/mantenedor-tipo-receptor-notificacion';
import { Inicio } from './components/inicio/inicio';
import { MantenedorTipoUnidadTiempo } from './features/mantenedores/mantenedor-tipo-unidad-tiempo/mantenedor-tipo-unidad-tiempo';

export const routes: Routes = [
    { path: '', component: Inicio },
    { path: 'callback', component: Callback },
    { path: 'logout', redirectTo: '', pathMatch: 'full' },
    {
        path: 'administracion/mantenedores/tipo-receptor-notificacion',
        component: MantenedorTipoReceptorNotificacion,
    },
    {
        path: 'administracion/mantenedores/tipo-unidad-tiempo',
        component: MantenedorTipoUnidadTiempo,
    },
];
