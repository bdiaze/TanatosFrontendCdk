import { EditorTexto } from '@/app/components/editor-texto/editor-texto';
import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { NegocioDao } from '@/app/daos/negocio-dao';
import { EntNegocioMisionVisionValores } from '@/app/entities/others/ent-negocio-mision-vision-valores';
import { SalNegocio } from '@/app/entities/others/sal-negocio';
import { getErrorMessage } from '@/app/helpers/error-message';
import { TourService } from '@/app/helpers/tour-service';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartNoAxesCombined, lucideGoal, lucideTriangleAlert, lucideUserStar } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { DriveStep } from 'driver.js';
import { map } from 'rxjs';

@Component({
    selector: 'app-mantenedor-mision',
    imports: [
        HlmH3,
        HlmH4,
        HlmP,
        HlmItemImports,
        HlmSpinnerImports,
        HlmSkeletonImports,
        HlmButton,
        ModalEdicion,
        EditorTexto,
        NgIcon,
        HlmIcon,
        HlmAlertImports,
        HlmBreadcrumbImports,
    ],
    templateUrl: './mantenedor-mision.html',
    styleUrl: './mantenedor-mision.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideGoal, lucideChartNoAxesCombined, lucideUserStar })],
})
export class MantenedorMision {
    negocioStore = inject(NegocioStore);
    negocioSeleccionado = this.negocioStore.negocioSeleccionado;

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
            toolbarEditarTexto: [['bold', 'italic', 'underline'], [{ header: [2, false] }]],
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

    misionMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return '<p>Por ejemplo, la misión de Viña Sutil:</p><h2>Entregar la mejor expresión de <strong>nuestra tierra, nuestra fruta y nuestra gente</strong> a través de nuestros vinos.</h2>';
        }
        return this.negocioSeleccionado()?.mision;
    });
    visionMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return '<p>Por ejemplo, la visión de Viña Sutil:</p><p>Ser reconocidos por entregar una propuesta de <strong>alto valor</strong> a través de nuestro diverso portafolio de <strong>marcas y productos</strong>, y por nuestra <strong>integridad</strong> y capacidad de <strong>comprender</strong> y <strong>adaptarse</strong> a las necesidades de nuestros clientes.</p>';
        }
        return this.negocioSeleccionado()?.vision;
    });
    valoresMostrar = computed(() => {
        if (this.ayudaRunning()) {
            return '<p>Por ejemplo, los valores de Viña Sutil:</p><p><strong>Integridad</strong> - <strong>Compromiso</strong> - <strong>Calidez</strong> - <strong>Orgullo</strong> por el trabajo bien hecho - <strong>Proactividad</strong></p>';
        }
        return this.negocioSeleccionado()?.valores;
    });

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

    ayudaRunning = signal<boolean>(false);
    ayudaClick(): void {
        const steps: DriveStep[] = [];

        if (this.ayuda() === '1') {
            steps.push({
                popover: {
                    title: '¡Listo! Llegamos a Mi Misión',
                    description: 'Ahora que ya estamos en Mi Misión, te mostraremos sus principales funciones.',
                },
            });
        } else {
            steps.push({
                popover: {
                    title: 'Misión, Visión y Valores',
                    description: 'Aquí podrás definir tu Misión, Visión y Valores, aspectos fundamentales de la identidad de tu negocio.',
                },
            });
        }

        steps.push(
            ...[
                {
                    element: '#mision',
                    popover: {
                        title: 'Primero la misión',
                        description: 'Acá podrás declarar la misión o la razón de ser de tu negocio.',
                    },
                },
                {
                    element: '#vision',
                    popover: {
                        title: 'Luego la visión',
                        description: 'Por acá podrás declarar la visión o las aspiraciones de tu negocio.',
                    },
                },
                {
                    element: '#valores',
                    popover: {
                        title: 'Y los valores',
                        description: 'Por último, los valores o principios que definen la identidad de tu negocio.',
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
                this.ayudaRunning.set(false);
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

        this.ayudaRunning.set(true);
        this.tourService.iniciarTour(config);
    }
}
