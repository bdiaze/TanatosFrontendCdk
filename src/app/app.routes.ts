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
import { Nosotros } from './features/tableros/nosotros/nosotros';
import { Planes } from './features/tableros/planes/planes';
import { Servicios } from './features/tableros/servicios/servicios';
import { Contacto } from './features/tableros/contacto/contacto';
import { Privacidad } from './features/tableros/privacidad/privacidad';
import { AvisoLegal } from './features/tableros/aviso-legal/aviso-legal';
import { PoliticaDeCookies } from './features/tableros/politica-de-cookies/politica-de-cookies';
import { ChatsWhatsapp } from './features/tableros/chats-whatsapp/chats-whatsapp';
import { MantenedorPlan } from './features/mantenedores/mantenedor-plan/mantenedor-plan';
import { MantenedorSuscripcion } from './features/mantenedores/mantenedor-suscripcion/mantenedor-suscripcion';
import { MantenedorEmpleado } from './features/mantenedores/mantenedor-empleado/mantenedor-empleado';
import { Bienvenida } from './features/tableros/bienvenida/bienvenida';
import { sesionIniciada } from './can-activate/sesion-iniciada';

export const routes: Routes = [
    { path: '', component: Inicio },
    {
        path: 'servicios',
        component: Servicios,
    },
    {
        path: 'planes',
        component: Planes,
    },
    {
        path: 'nosotros',
        component: Nosotros,
    },
    {
        path: 'contacto',
        component: Contacto,
    },
    {
        path: 'privacidad',
        component: Privacidad,
    },
    {
        path: 'aviso-legal',
        component: AvisoLegal,
    },
    {
        path: 'politica-de-cookies',
        component: PoliticaDeCookies,
    },
    { path: 'callback', component: Callback },
    { path: 'cargando-inicio', component: EmptyHero },
    { path: 'logout', redirectTo: '', pathMatch: 'full' },
    {
        path: 'flow-callback',
        redirectTo: 'mi-plan',
        pathMatch: 'full',
    },
    {
        path: 'validar-destinatario',
        component: ValidarDestinatario,
    },
    {
        path: 'obligacion/:codigoAccesoOIdNormaSuscrita',
        component: Vencimiento,
    },
    {
        path: 'bienvenido',
        component: Bienvenida,
        canActivate: [sesionIniciada],
    },
    {
        path: 'inicio',
        component: MenuInicial,
        canActivate: [sesionIniciada],
    },
    {
        path: 'mi-calendario',
        component: TableroVencimientos,
        canActivate: [sesionIniciada],
    },
    {
        path: 'obligacion/:codigoAccesoOIdNormaSuscrita/:idHistorialNormaSuscrita',
        component: Vencimiento,
        canActivate: [sesionIniciada],
    },
    {
        path: 'mis-obligaciones',
        component: MantenedorNormaSuscrita,
        canActivate: [sesionIniciada],
    },
    {
        path: 'crear-obligacion',
        component: MantenedorNormaSuscritaEdicion,
        canActivate: [sesionIniciada],
    },
    {
        path: 'editar-obligacion/:idNormaSuscrita',
        component: MantenedorNormaSuscritaEdicion,
        canActivate: [sesionIniciada],
    },
    {
        path: 'plantillas-inscritas',
        component: MantenedorPlantillasInscritas,
        canActivate: [sesionIniciada],
    },
    {
        path: 'mi-equipo',
        component: MantenedorEmpleado,
        canActivate: [sesionIniciada],
    },
    {
        path: 'mis-negocios',
        component: MantenedorNegocio,
        canActivate: [sesionIniciada],
    },
    {
        path: 'mi-plan',
        component: MantenedorSuscripcion,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/servicio-cliente/chats-whatsapp',
        component: ChatsWhatsapp,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/plan',
        component: MantenedorPlan,
        canActivate: [sesionIniciada],
    },

    {
        path: 'administracion/mantenedores/template',
        component: MantenedorTemplate,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/template/nuevo',
        component: MantenedorTemplateEdicion,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/template/:idTemplate',
        component: MantenedorTemplateEdicion,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/categoria-norma',
        component: MantenedorCategoriaNorma,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/tipo-rubro',
        component: MantenedorTipoRubro,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/tipo-actividad',
        component: MantenedorTipoActividad,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/tipo-receptor-notificacion',
        component: MantenedorTipoReceptorNotificacion,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/tipo-fiscalizador',
        component: MantenedorTipoFiscalizador,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/tipo-periodicidad',
        component: MantenedorTipoPeriodicidad,
        canActivate: [sesionIniciada],
    },
    {
        path: 'administracion/mantenedores/tipo-unidad-tiempo',
        component: MantenedorTipoUnidadTiempo,
        canActivate: [sesionIniciada],
    },
];
