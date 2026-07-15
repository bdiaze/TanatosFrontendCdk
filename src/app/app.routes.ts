import { Routes } from '@angular/router';
import { Callback } from '@/app/features/auth/callback/callback';
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
import { Evaluaciones } from './features/tableros/evaluaciones/evaluaciones';

export const routes: Routes = [
    { path: '', component: Inicio },
    {
        title: 'Servicios',
        path: 'servicios',
        component: Servicios,
    },
    {
        title: 'Planes',
        path: 'planes',
        component: Planes,
    },
    {
        title: 'Nosotros',
        path: 'nosotros',
        component: Nosotros,
    },
    {
        title: 'Contacto',
        path: 'contacto',
        component: Contacto,
    },
    {
        title: 'Privacidad',
        path: 'privacidad',
        component: Privacidad,
    },
    {
        title: 'Aviso Legal',
        path: 'aviso-legal',
        component: AvisoLegal,
    },
    {
        title: 'Política de Cookies',
        path: 'politica-de-cookies',
        component: PoliticaDeCookies,
    },
    {
        title: 'Ayuda',
        path: 'ayuda',
        component: Ayuda,
    },
    {
        title: 'Verifica tu cuenta',
        path: 'codigo-verificacion',
        component: CodigoVerificacion,
    },
    {
        path: 'callback',
        component: Callback,
    },
    {
        path: 'cargando-inicio',
        component: EmptyHero,
    },
    {
        path: 'logout',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: 'flow-callback',
        redirectTo: 'mi-plan',
        pathMatch: 'full',
    },
    {
        title: 'Confirmar o rechazar',
        path: 'validar-destinatario',
        component: ValidarDestinatario,
    },
    {
        title: 'Completa tu obligación',
        path: 'obligacion/:codigoAccesoOIdNormaSuscrita',
        component: Vencimiento,
    },
    {
        title: 'Bienvenid@',
        path: 'bienvenido',
        component: Bienvenida,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Inicio',
        path: 'inicio',
        component: MenuInicial,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Mi Calendario',
        path: 'mi-calendario',
        component: TableroVencimientos,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Completa tu obligación',
        path: 'obligacion/:codigoAccesoOIdNormaSuscrita/:idHistorialNormaSuscrita',
        component: Vencimiento,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Mis Obligaciones',
        path: 'mis-obligaciones',
        component: MantenedorNormaSuscrita,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Crea una obligación',
        path: 'crear-obligacion',
        component: MantenedorNormaSuscritaEdicion,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Modifica tu obligación',
        path: 'editar-obligacion/:idNormaSuscrita',
        component: MantenedorNormaSuscritaEdicion,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Plantillas Inscritas',
        path: 'plantillas-inscritas',
        component: MantenedorPlantillasInscritas,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Mi Equipo',
        path: 'mi-equipo',
        component: MantenedorEmpleado,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Mis Negocios',
        path: 'mis-negocios',
        component: MantenedorNegocio,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Mi Plan',
        path: 'mi-plan',
        component: MantenedorSuscripcion,
        canActivate: [chainActivateGuards(sesionIniciada)],
    },
    {
        title: 'Chats de Whatsapp',
        path: 'administracion/servicio-cliente/chats-whatsapp',
        component: ChatsWhatsapp,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Evaluaciones',
        path: 'administracion/servicio-cliente/evaluaciones',
        component: Evaluaciones,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Preguntas Frecuentes',
        path: 'administracion/mantenedores/preguntas-frecuentes',
        component: MantenedorPreguntaFrecuente,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Videos Tutoriales',
        path: 'administracion/mantenedores/videos-tutoriales',
        component: MantenedorVideoTutorial,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Planes',
        path: 'administracion/mantenedores/plan',
        component: MantenedorPlan,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Plantillas',
        path: 'administracion/mantenedores/template',
        component: MantenedorTemplate,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Nueva plantilla',
        path: 'administracion/mantenedores/template/nuevo',
        component: MantenedorTemplateEdicion,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Edición plantilla',
        path: 'administracion/mantenedores/template/:idTemplate',
        component: MantenedorTemplateEdicion,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Categorías de Obligaciones',
        path: 'administracion/mantenedores/categoria-norma',
        component: MantenedorCategoriaNorma,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Rubros',
        path: 'administracion/mantenedores/tipo-rubro',
        component: MantenedorTipoRubro,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Actividades',
        path: 'administracion/mantenedores/tipo-actividad',
        component: MantenedorTipoActividad,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Tipos de Destinatarios',
        path: 'administracion/mantenedores/tipo-receptor-notificacion',
        component: MantenedorTipoReceptorNotificacion,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Fiscalizadores',
        path: 'administracion/mantenedores/tipo-fiscalizador',
        component: MantenedorTipoFiscalizador,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Periodicidades',
        path: 'administracion/mantenedores/tipo-periodicidad',
        component: MantenedorTipoPeriodicidad,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    {
        title: 'Unidades de Tiempo',
        path: 'administracion/mantenedores/tipo-unidad-tiempo',
        component: MantenedorTipoUnidadTiempo,
        canActivate: [chainActivateGuards(sesionIniciada, esAdmin)],
    },
    { path: '**', redirectTo: '' },
];
