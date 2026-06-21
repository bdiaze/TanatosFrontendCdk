import { environment } from '@/environments/environment';
import { afterNextRender, Component, effect, inject, Injector, untracked } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmH1, HlmP } from '@spartan-ng/helm/typography';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NegocioStore } from '@/app/services/negocio-store';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { FadeIn } from '@/app/directives/fade-in';
import { TourService } from '@/app/helpers/tour-service';
import { HlmButton } from '@spartan-ng/helm/button';
import { MenuHelper } from '@/app/helpers/menu-helper';
import { DriveStep } from 'driver.js';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-menu-inicial',
    imports: [HlmH1, HlmP, HlmItemImports, RouterLink, HlmSpinnerImports, HlmSkeletonImports, FadeIn, HlmButton],
    templateUrl: './menu-inicial.html',
})
export class MenuInicial {
    urlCalendario = `${environment.urlImages}/images/calendario-reloj-blanco.png`;
    urlCaracteristicas = `${environment.urlImages}/images/caracteristicas-blanco.png`;
    urlComprobacionLista = `${environment.urlImages}/images/comprobacion-de-lista-blanco.png`;
    urlTienda = `${environment.urlImages}/images/tienda-blanco.png`;

    negocioStore = inject(NegocioStore);
    negocioSeleccionado = this.negocioStore.negocioSeleccionado;
    informacionUsuario = this.negocioStore.informacionUsuario;

    private readonly menuHelper = inject(MenuHelper);
    private readonly tourService = inject(TourService);

    private readonly route = inject(ActivatedRoute);
    ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    constructor() {
        effect(() => {
            const ayuda = this.ayuda();
            untracked(() => {
                if (ayuda === '1') {
                    setTimeout(() => this.ayudaClick(), 300);
                }
            });
        });
    }

    ayudaClick(): void {
        const steps: DriveStep[] = [
            {
                popover: {
                    title: '¿Necesitas ayuda? Aquí estamos para guiarte',
                    description: 'Todo en Orden te ayudará a administrar tus negocios y gestionar tus obligaciones legales.',
                },
            },
        ];

        if (!document.getElementById('menu-header')) {
            steps.push({
                element: '#menu-estatico',
                popover: {
                    title: 'A tu izquierda, el menú principal',
                    description: 'Aquí podrás explorar las distintas funcionalidades de Todo en Orden.',
                },
            });
        } else {
            steps.push({
                element: '#menu-header',
                popover: {
                    title: 'En la esquina superior derecha, el menú principal',
                    description: 'Aquí podrás explorar las distintas funcionalidades de Todo en Orden.',
                },
                onHighlightStarted: () => {
                    this.menuHelper.cerrarMenu();
                },
            });
        }

        steps.push(
            ...[
                {
                    element: '#seleccion-negocio',
                    popover: {
                        title: 'Negocio seleccionado',
                        description: 'Si tienes múltiples negocios, puedes hacer click aquí para seleccionar un negocio distinto.',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.abrirMenu();
                    },
                },
                {
                    element: '#group-negocio-seleccionado',
                    popover: {
                        title: 'Menú del negocio seleccionado',
                        description: 'Por acá encuentras los menús asociados al negocio seleccionado.',
                    },
                },
                {
                    element: '#group-general',
                    popover: {
                        title: 'Menú general',
                        description: 'Y por acá encuentras los menús asociados a tu cuenta en general.',
                    },
                },
            ],
        );

        if (document.getElementById('recordatorio-suscripcion-gratuita')) {
            steps.push({
                element: '#recordatorio-suscripcion-gratuita',
                popover: {
                    title: '¿Cuántos días de plan Empresa me quedan?',
                    description: 'Por acá podrás ver cuantos días te quedan de acceso completo a nuestra plataforma.',
                },
                onHighlightStarted: () => {
                    this.menuHelper.cerrarMenu();
                },
            });
        }

        steps.push(
            ...[
                {
                    element: '#acceso-rapido-mi-calendario',
                    popover: {
                        title: 'Tu calendario',
                        description: 'Este es tu acceso rápido al calendario de obligaciones de tu negocio.',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.cerrarMenu();
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
        );

        this.tourService.iniciarTour(steps);
    }
}
