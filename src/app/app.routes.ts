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
import { CodigoVerificacion } from './features/validadores/codigo-verificacion/codigo-verificacion';
import { esAdmin } from './can-activate/es-admin';
import { chainActivateGuards } from './can-activate/chain-activate-guards';
import { MantenedorPreguntaFrecuente } from './features/mantenedores/mantenedor-pregunta-frecuente/mantenedor-pregunta-frecuente';
import { Ayuda } from './features/tableros/ayuda/ayuda';
import { MantenedorVideoTutorial } from './features/mantenedores/mantenedor-video-tutorial/mantenedor-video-tutorial';

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
    {
        path: 'ayuda',
        component: Ayuda,
    },
    { path: 'codigo-verificacion', component: CodigoVerificacion },
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
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'inicio',
        component: MenuInicial,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'mi-calendario',
        component: TableroVencimientos,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'obligacion/:codigoAccesoOIdNormaSuscrita/:idHistorialNormaSuscrita',
        component: Vencimiento,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'mis-obligaciones',
        component: MantenedorNormaSuscrita,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'crear-obligacion',
        component: MantenedorNormaSuscritaEdicion,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'editar-obligacion/:idNormaSuscrita',
        component: MantenedorNormaSuscritaEdicion,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'plantillas-inscritas',
        component: MantenedorPlantillasInscritas,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'mi-equipo',
        component: MantenedorEmpleado,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'mis-negocios',
        component: MantenedorNegocio,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'mi-plan',
        component: MantenedorSuscripcion,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        path: 'administracion/servicio-cliente/chats-whatsapp',
        component: ChatsWhatsapp,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/preguntas-frecuentes',
        component: MantenedorPreguntaFrecuente,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/videos-tutoriales',
        component: MantenedorVideoTutorial,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/plan',
        component: MantenedorPlan,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },

    {
        path: 'administracion/mantenedores/template',
        component: MantenedorTemplate,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/template/nuevo',
        component: MantenedorTemplateEdicion,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/template/:idTemplate',
        component: MantenedorTemplateEdicion,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/categoria-norma',
        component: MantenedorCategoriaNorma,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/tipo-rubro',
        component: MantenedorTipoRubro,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/tipo-actividad',
        component: MantenedorTipoActividad,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/tipo-receptor-notificacion',
        component: MantenedorTipoReceptorNotificacion,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/tipo-fiscalizador',
        component: MantenedorTipoFiscalizador,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/tipo-periodicidad',
        component: MantenedorTipoPeriodicidad,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        path: 'administracion/mantenedores/tipo-unidad-tiempo',
        component: MantenedorTipoUnidadTiempo,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    { path: '**', redirectTo: '' },
];
