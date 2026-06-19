import { DriveStep } from 'driver.js';
import { MenuHelper } from './menu-helper';
import { inject } from '@angular/core';

export type TourModule = 'Inicio' | 'Mi Calendario' | 'Mis Obligaciones' | 'Plantillas Inscritas' | 'Mi Equipo' | 'Mis Negocios' | 'Mi Plan';

export function ObtenerSteps(menuHelper: MenuHelper): Record<TourModule, DriveStep[]> {
    return {
        Inicio: [
            {
                popover: {
                    title: '¿Necesitas ayuda? Aquí estamos para guiarte',
                    description: 'Todo en Orden te ayudará a administrar tus negocios y gestionar tus obligaciones legales.',
                },
            },
            {
                element: '#menu-estatico',
                popover: {
                    title: 'A tu izquierda, el menú principal',
                    description: 'Aquí podrás explorar las distintas funcionalidades de Todo en Orden.',
                },
            },
            {
                element: '#menu-header',
                popover: {
                    title: 'En la esquina superior derecha, el menú principal',
                    description: 'Aquí podrás explorar las distintas funcionalidades de Todo en Orden.',
                },
                onHighlightStarted: () => {
                    menuHelper.cerrarMenu();
                },
            },
            {
                element: '#seleccion-negocio',
                popover: {
                    title: 'Negocio seleccionado',
                    description: 'Si tienes múltiples negocios, puedes hacer click aquí para seleccionar un negocio distinto.',
                },
                onHighlightStarted: () => {
                    menuHelper.abrirMenu();
                },
            },
            {
                element: '#group-negocio-seleccionado',
                popover: {
                    title: 'Menú del negocio seleccionado',
                    description: 'Por acá encuentras los menús asociados al negocio seleccionado.',
                },
                onHighlightStarted: () => {
                    menuHelper.abrirMenu();
                },
            },
            {
                element: '#group-general',
                popover: {
                    title: 'Menú general',
                    description: 'Y por acá encuentras los menús asociados a tu cuenta en general.',
                },
                onHighlightStarted: () => {
                    menuHelper.abrirMenu();
                },
            },
            {
                element: '#recordatorio-suscripcion-gratuita',
                popover: {
                    title: '¿Cuántos días de plan Empresa me quedan?',
                    description: 'Por acá podrás ver cuantos días te quedan de acceso completo a nuestra plataforma.',
                },
                onHighlightStarted: () => {
                    menuHelper.cerrarMenu();
                },
            },
            {
                element: '#acceso-rapido-mi-calendario',
                popover: {
                    title: 'Tu calendario',
                    description: 'Este es tu acceso rápido al calendario de obligaciones de tu negocio.',
                },
            },
            {
                element: '#acceso-rapido-mis-obligaciones',
                popover: {
                    title: 'Tus obligaciones',
                    description: 'Por acá podrás configurar todas las obligaciones que debe cumplir tu negocio.',
                },
            },
            {
                element: '#acceso-rapido-mis-negocios',
                popover: {
                    title: 'Tus negocios',
                    description: 'Acá tienes el acceso rápido que te llevará a tus distintos negocios.',
                },
            },
            {
                element: '#acceso-rapido-mi-plan',
                popover: {
                    title: 'Y por último, tu plan',
                    description: 'Configura tu suscripción al plan Empresa para obtener acceso completo a nuestra plataforma.',
                },
            },
        ],
        'Mi Calendario': [],
        'Mis Obligaciones': [],
        'Plantillas Inscritas': [],
        'Mi Equipo': [],
        'Mis Negocios': [],
        'Mi Plan': [],
    };
}
