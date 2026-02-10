import { Routes } from '@angular/router';
import { Login } from '@/app/features/auth/login/login';
import { Callback } from '@/app/features/auth/callback/callback';
import { Logout } from './features/auth/logout/logout';
import { MantenedorTipoReceptorNotificacion } from './features/mantenedores/mantenedor-tipo-receptor-notificacion/mantenedor-tipo-receptor-notificacion';
import { Inicio } from './components/inicio/inicio';
import { MantenedorTipoUnidadTiempo } from './features/mantenedores/mantenedor-tipo-unidad-tiempo/mantenedor-tipo-unidad-tiempo';
import { MantenedorTipoPeriodicidad } from './features/mantenedores/mantenedor-tipo-periodicidad/mantenedor-tipo-periodicidad';
import { MantenedorTipoFiscalizador } from './features/mantenedores/mantenedor-tipo-fiscalizador/mantenedor-tipo-fiscalizador';
import { MantenedorCategoriaNorma } from './features/mantenedores/mantenedor-categoria-norma/mantenedor-categoria-norma';
import { MantenedorTemplate } from './features/mantenedores/mantenedor-template/mantenedor-template';
import { MantenedorDestinatarioNotificacion } from './features/mantenedores/mantenedor-destinatario-notificacion/mantenedor-destinatario-notificacion';
import { ValidarDestinatario } from './features/validadores/validar-destinatario/validar-destinatario';
import { MantenedorNegocio } from './features/mantenedores/mantenedor-negocio/mantenedor-negocio';
import { MantenedorNormaSuscrita } from './features/mantenedores/mantenedor-norma-suscrita/mantenedor-norma-suscrita';
import { MantenedorTemplateEdicion } from './features/mantenedores/mantenedor-template-edicion/mantenedor-template-edicion';
import { MantenedorNormaSuscritaEdicion } from './features/mantenedores/mantenedor-norma-suscrita-edicion/mantenedor-norma-suscrita-edicion';
import { MantenedorPlantillasInscritas } from './features/mantenedores/mantenedor-plantillas-inscritas/mantenedor-plantillas-inscritas';
import { MantenedorTipoRubro } from './features/mantenedores/mantenedor-tipo-rubro/mantenedor-tipo-rubro';
import { MantenedorTipoActividad } from './features/mantenedores/mantenedor-tipo-actividad/mantenedor-tipo-actividad';
import { TableroVencimientos } from './features/tableros/tablero-vencimientos/tablero-vencimientos';
import { Vencimiento } from './features/tableros/vencimiento/vencimiento';
import { MenuInicial } from './features/tableros/menu-inicial/menu-inicial';
import { EmptyHero } from './components/empty-hero/empty-hero';

export const routes: Routes = [
    { path: '', component: Inicio },
    { path: 'cargando-inicio', component: EmptyHero },
    { path: 'callback', component: Callback },
    { path: 'logout', redirectTo: '', pathMatch: 'full' },
    {
        path: 'inicio',
        component: MenuInicial,
    },
    {
        path: 'mi-calendario',
        component: TableroVencimientos,
    },
    {
        path: 'obligacion/:idNormaSuscrita/:idHistorialNormaSuscrita',
        component: Vencimiento,
    },
    {
        path: 'administracion/mantenedores/tipo-receptor-notificacion',
        component: MantenedorTipoReceptorNotificacion,
    },
    {
        path: 'administracion/mantenedores/tipo-unidad-tiempo',
        component: MantenedorTipoUnidadTiempo,
    },
    {
        path: 'administracion/mantenedores/tipo-periodicidad',
        component: MantenedorTipoPeriodicidad,
    },
    {
        path: 'administracion/mantenedores/tipo-fiscalizador',
        component: MantenedorTipoFiscalizador,
    },
    {
        path: 'administracion/mantenedores/tipo-rubro',
        component: MantenedorTipoRubro,
    },
    {
        path: 'administracion/mantenedores/tipo-actividad',
        component: MantenedorTipoActividad,
    },
    {
        path: 'administracion/mantenedores/categoria-norma',
        component: MantenedorCategoriaNorma,
    },
    {
        path: 'administracion/mantenedores/template',
        component: MantenedorTemplate,
    },
    {
        path: 'administracion/mantenedores/template/:idTemplate',
        component: MantenedorTemplateEdicion,
    },
    {
        path: 'administracion/mantenedores/template/nuevo',
        component: MantenedorTemplateEdicion,
    },
    {
        path: 'mis-destinatario',
        component: MantenedorDestinatarioNotificacion,
    },
    {
        path: 'mis-negocios',
        component: MantenedorNegocio,
    },
    {
        path: 'mis-obligaciones',
        component: MantenedorNormaSuscrita,
    },
    {
        path: 'editar-obligacion/:idNormaSuscrita',
        component: MantenedorNormaSuscritaEdicion,
    },
    {
        path: 'crear-obligacion',
        component: MantenedorNormaSuscritaEdicion,
    },
    {
        path: 'plantillas-inscritas',
        component: MantenedorPlantillasInscritas,
    },
    {
        path: 'validar-destinatario',
        component: ValidarDestinatario,
    },
];
