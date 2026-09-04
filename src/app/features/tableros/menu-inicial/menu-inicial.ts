import { Component, effect, inject, signal, untracked } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmH1, HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { EditorTexto } from '@/app/components/editor-texto/editor-texto';
import { NegocioDao } from '@/app/daos/negocio-dao';
import { EntNegocioMisionVisionValores } from '@/app/entities/others/ent-negocio-mision-vision-valores';
import { SalNegocio } from '@/app/entities/others/sal-negocio';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartNoAxesCombined, lucideGoal, lucideTriangleAlert, lucideUserStar } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

@Component({
    selector: 'app-menu-inicial',
    imports: [
        HlmH1,
        HlmP,
        HlmH3,
        HlmH4,
        HlmItemImports,
        RouterLink,
        HlmSpinnerImports,
        HlmSkeletonImports,
        FadeIn,
        HlmButton,
        ModalEdicion,
        EditorTexto,
        HlmSpinnerImports,
        NgIcon,
        HlmIcon,
        HlmAlertImports,
    ],
    templateUrl: './menu-inicial.html',
    providers: [provideIcons({ lucideTriangleAlert, lucideGoal, lucideChartNoAxesCombined, lucideUserStar })],
})
export class MenuInicial {
    negocioStore = inject(NegocioStore);
    negocioSeleccionado = this.negocioStore.negocioSeleccionado;
    informacionUsuario = this.negocioStore.informacionUsuario;

    private readonly menuHelper = inject(MenuHelper);
    private readonly router = inject(Router);
    private readonly tourService = inject(TourService);
    private readonly negocioDao = inject(NegocioDao);

    private readonly route = inject(ActivatedRoute);
    ayuda = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('ayuda'))));

    camposEdicionMision = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'oculto', requerido: true, deshabilitado: true },
        {
            llave: 'mision',
            nombre: 'Misión',
            tipo: 'editor-texto',
            requerido: false,
            deshabilitado: false,
            toolbarEditarTexto: [['bold', 'italic', 'underline'], [{ header: [2] }]],
            formatsEditarTexto: ['bold', 'italic', 'underline', 'header'],
        },
        {
            llave: 'vision',
            nombre: 'Visión',
            tipo: 'oculto',
            requerido: false,
            deshabilitado: true,
        },
        {
            llave: 'valores',
            nombre: 'Valores',
            tipo: 'oculto',
            requerido: false,
            deshabilitado: true,
        },
    ]);

    camposEdicionVision = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'oculto', requerido: true, deshabilitado: true },
        {
            llave: 'mision',
            nombre: 'Misión',
            tipo: 'oculto',
            requerido: false,
            deshabilitado: true,
        },
        {
            llave: 'vision',
            nombre: 'Visión',
            tipo: 'editor-texto',
            requerido: false,
            deshabilitado: false,
            toolbarEditarTexto: [['bold', 'italic', 'underline'], [{ header: [false] }]],
            formatsEditarTexto: ['bold', 'italic', 'underline', 'header'],
        },
        {
            llave: 'valores',
            nombre: 'Valores',
            tipo: 'oculto',
            requerido: false,
            deshabilitado: true,
        },
    ]);

    camposEdicionValores = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'oculto', requerido: true, deshabilitado: true },
        {
            llave: 'mision',
            nombre: 'Misión',
            tipo: 'oculto',
            requerido: false,
            deshabilitado: true,
        },
        {
            llave: 'vision',
            nombre: 'Visión',
            tipo: 'oculto',
            requerido: false,
            deshabilitado: true,
        },
        {
            llave: 'valores',
            nombre: 'Valores',
            tipo: 'editor-texto',
            requerido: false,
            deshabilitado: false,
            toolbarEditarTexto: [['bold', 'italic', 'underline'], [{ header: [false] }]],
            formatsEditarTexto: ['bold', 'italic', 'underline', 'header'],
        },
    ]);

    constructor() {
        effect(() => {
            const ayuda = this.ayuda();
            untracked(() => {
                if (ayuda === '1') {
                    this.ayudaClick();
                }
            });
        });
    }

    showModalMision = signal<boolean>(false);
    openModalMision() {
        this.showModalMision.set(true);
    }
    closeModalMision() {
        this.showModalMision.set(false);
    }

    showModalVision = signal<boolean>(false);
    openModalVision() {
        this.showModalVision.set(true);
    }
    closeModalVision() {
        this.showModalVision.set(false);
    }

    showModalValores = signal<boolean>(false);
    openModalValores() {
        this.showModalValores.set(true);
    }
    closeModalValores() {
        this.showModalValores.set(false);
    }

    error = signal<string>('');
    actualizandoMisionVisionValores = signal<boolean>(false);
    tipoActualizando = signal<null | 'mision' | 'vision' | 'valores'>(null);
    actualizarMisionVisionValores(entrada: SalNegocio, tipo: 'mision' | 'vision' | 'valores') {
        this.actualizandoMisionVisionValores.set(true);
        this.tipoActualizando.set(tipo);
        this.negocioDao
            .actualizarMisionVisionValores({
                id: entrada.id,
                mision: entrada.mision,
                vision: entrada.vision,
                valores: entrada.valores,
            } as EntNegocioMisionVisionValores)
            .subscribe({
                error: (err) => {
                    console.error('Error al guardar tu misión, visión y valores', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al guardar tu misión, visión y valores');
                },
            })
            .add(() => {
                this.negocioDao
                    .obtenerVigentes()
                    .subscribe({})
                    .add(() => {
                        this.actualizandoMisionVisionValores.set(false);
                        this.tipoActualizando.set(null);
                    });
            });
        this.closeModalMision();
        this.closeModalVision();
        this.closeModalValores();
    }

    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Inicio',
                    description: 'Ahora que ya estamos en Inicio, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: '¿Necesitas ayuda? Aquí estamos para guiarte',
                    description: 'Todo en Orden te ayudará a administrar tus negocios y gestionar tus obligaciones legales.',
                },
            });
        }

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
                        description: 'Por acá encontrarás los menús asociados al negocio seleccionado.',
                    },
                },
                {
                    element: '#group-general',
                    popover: {
                        title: 'Menú general',
                        description: 'Y por acá encontrarás los menús asociados a tu cuenta en general.',
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

        let config: {
            pasos: DriveStep[];
            onFinish?: (element: Element | undefined, step: DriveStep, options: any) => void;
            showProgress?: boolean;
            doneBtnText?: string;
            onNextFromLast?: (element: Element | undefined, step: DriveStep, options: any) => void;
        } = {
            pasos: steps,
            onFinish: () => {
                this.menuHelper.cerrarMenu();
                if (this.ayuda() === '1') {
                    this.router.navigate(['/ayuda']);
                }
            },
        };

        if (this.ayuda() === '1') {
            config = {
                ...config,
                showProgress: true,
            };
        }

        this.tourService.iniciarTour(config);
    }
}
