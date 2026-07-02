import { PreguntaFrecuenteDao } from '@/app/daos/pregunta-frecuente-dao';
import { SalPreguntaFrecuenteHabilitado } from '@/app/entities/others/sal-pregunta-frecuente-habilitado';
import { getErrorMessage } from '@/app/helpers/error-message';
import { Component, computed, DestroyRef, effect, inject, OnDestroy, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleQuestionMark, lucideX } from '@ng-icons/lucide';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { EditorTexto } from '@/app/components/editor-texto/editor-texto';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { Router } from '@angular/router';
import { AuthStore } from '@/app/services/auth-store';
import { TourService } from '@/app/helpers/tour-service';
import { DriveStep } from 'driver.js';
import { MenuHelper } from '@/app/helpers/menu-helper';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { VideoTutorialDao } from '@/app/daos/video-tutorial-dao';
import { SalVideoTutorialHabilitado } from '@/app/entities/others/sal-video-tutorial-habilitado';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-ayuda',
    imports: [HlmP, HlmH3, HlmH4, NgIcon, HlmIcon, HlmAccordionImports, EditorTexto, HlmSkeletonImports, HlmButtonImports],
    templateUrl: './ayuda.html',
    styleUrl: './ayuda.scss',
    providers: [provideIcons({ lucideCircleQuestionMark, lucideX })],
})
export class Ayuda implements OnInit, OnDestroy {
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    private readonly menuHelper = inject(MenuHelper);
    private readonly tourService = inject(TourService);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly preguntaFrecuenteDao = inject(PreguntaFrecuenteDao);
    private readonly videoTutorialDao = inject(VideoTutorialDao);
    authStore = inject(AuthStore);

    error = signal('');

    constructor() {
        effect(() => {
            const videoSeleccionado = this.videoSeleccionado();

            untracked(() => {
                if (videoSeleccionado) {
                    document.body.classList.add('overflow-hidden!');
                } else {
                    document.body.classList.remove('overflow-hidden!');
                }
            });
        });
    }

    ngOnInit(): void {
        this.obtenerPreguntasFrecuentes();
        this.obtenerVideosTutoriales();
    }

    ngOnDestroy(): void {
        document.body.classList.remove('overflow-hidden!');
    }

    cargandoPreguntasFrecuentes = signal<boolean>(false);
    preguntasFrecuentes = signal<SalPreguntaFrecuenteHabilitado[]>([]);

    obtenerPreguntasFrecuentes() {
        this.cargandoPreguntasFrecuentes.set(true);
        this.preguntasFrecuentes.set([]);

        this.preguntaFrecuenteDao
            .obtenerHabilitados()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.orden - b.orden);
                    this.preguntasFrecuentes.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener preguntas frecuentes', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener preguntas frecuentes');
                },
            })
            .add(() => {
                this.cargandoPreguntasFrecuentes.set(false);
            });
    }

    cargandoVideosTutoriales = signal<boolean>(false);
    videosTutoriales = signal<SalVideoTutorialHabilitado[]>([]);

    obtenerVideosTutoriales() {
        this.cargandoVideosTutoriales.set(true);
        this.videosTutoriales.set([]);

        this.videoTutorialDao
            .obtenerHabilitados()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.orden - b.orden);
                    this.videosTutoriales.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener videos tutoriales', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener videos tutoriales');
                },
            })
            .add(() => {
                this.cargandoVideosTutoriales.set(false);
            });
    }
    datosVideosTutoriales = computed(() => {
        return this.videosTutoriales().map((video) => {
            const youtube = this.obtenerYoutubeData(video.url);

            return {
                titulo: video.titulo,
                descripcion: video.descripcion,
                url: video.url,
                ...(youtube ?? {}),
            };
        });
    });

    private obtenerYoutubeVideoId(urlString: string): string | null {
        try {
            const url = new URL(urlString);

            switch (url.hostname) {
                case 'youtube.com':
                case 'www.youtube.com':
                case 'm.youtube.com':
                    return url.searchParams.get('v');

                case 'youtu.be':
                    return url.pathname.slice(1);

                default:
                    return null;
            }
        } catch {
            return null;
        }
    }

    private obtenerYoutubeData(urlString: string) {
        const videoId = this.obtenerYoutubeVideoId(urlString);
        if (videoId) {
            const embeddedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&hl=es`;

            return {
                youtube: {
                    embeddedUrl: embeddedUrl,
                    bypassSecurityEmbeddedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(embeddedUrl),
                    miniaturaUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    miniaturaMaxResUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                },
            };
        }

        return undefined;
    }

    videoSeleccionado = signal<
        | {
              titulo: string;
              descripcion: string | null;
              url: string;
              youtube?: { embeddedUrl: string; bypassSecurityEmbeddedUrl: SafeResourceUrl; miniaturaUrl: string; miniaturaMaxResUrl: string } | undefined;
          }
        | undefined
    >(undefined);

    modulos = signal([
        {
            id: 'inicio',
            nombre: 'Inicio',
            link: ['/inicio'],
            steps: [
                {
                    element: '#group-negocio-seleccionado-item-inicio',
                    popover: {
                        title: '¿Cómo llegar?',
                        description: 'Primero, debes saber que para llegar a Inicio deberás hacer click aquí, ¡Vamos allá!',
                        side: 'bottom',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.abrirMenu();
                    },
                    onDeselected: () => {
                        this.menuHelper.cerrarMenu();
                    },
                },
            ] as DriveStep[],
        },
        {
            id: 'mi-calendario',
            nombre: 'Mi Calendario',
            link: ['/mi-calendario'],
            steps: [
                {
                    element: '#group-negocio-seleccionado-item-mi-calendario',
                    popover: {
                        title: '¿Cómo llegar?',
                        description: 'Primero, debes saber que para llegar a Mi Calendario deberás hacer click aquí, ¡Vamos allá!',
                        side: 'bottom',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.abrirMenu();
                    },
                    onDeselected: () => {
                        this.menuHelper.cerrarMenu();
                    },
                },
            ] as DriveStep[],
        },
        {
            id: 'mis-obligaciones',
            nombre: 'Mis Obligaciones',
            link: ['/mis-obligaciones'],
            steps: [
                {
                    element: '#group-negocio-seleccionado-item-mis-obligaciones',
                    popover: {
                        title: '¿Cómo llegar?',
                        description: 'Primero, debes saber que para llegar a Mis Obligaciones deberás hacer click aquí, ¡Vamos allá!',
                        side: 'bottom',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.abrirMenu();
                    },
                    onDeselected: () => {
                        this.menuHelper.cerrarMenu();
                    },
                },
            ] as DriveStep[],
        },
        {
            id: 'plantillas-inscritas',
            nombre: 'Plantillas Inscritas',
            link: ['/plantillas-inscritas'],
            steps: [
                {
                    element: '#group-negocio-seleccionado-item-plantillas-inscritas',
                    popover: {
                        title: '¿Cómo llegar?',
                        description: 'Primero, debes saber que para llegar a Plantillas Inscritas deberás hacer click aquí, ¡Vamos allá!',
                        side: 'bottom',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.abrirMenu();
                    },
                    onDeselected: () => {
                        this.menuHelper.cerrarMenu();
                    },
                },
            ] as DriveStep[],
        },
        {
            id: 'mi-equipo',
            nombre: 'Mi Equipo',
            link: ['/mi-equipo'],
            steps: [
                {
                    element: '#group-negocio-seleccionado-item-mi-equipo',
                    popover: {
                        title: '¿Cómo llegar?',
                        description: 'Primero, debes saber que para llegar a Mi Equipo deberás hacer click aquí, ¡Vamos allá!',
                        side: 'bottom',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.abrirMenu();
                    },
                    onDeselected: () => {
                        this.menuHelper.cerrarMenu();
                    },
                },
            ] as DriveStep[],
        },
        /*
        {
            id: 'mis-negocios',
            nombre: 'Mis Negocios',
            link: ['/mis-negocios'],
            steps: [
                {
                    element: '#group-general-item-mis-negocios',
                    popover: {
                        title: '¿Cómo llegar?',
                        description: 'Primero, debes saber que para llegar a Mis Negocios deberás hacer click aquí, ¡Vamos allá!',
                        side: 'bottom',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.abrirMenu();
                    },
                    onDeselected: () => {
                        this.menuHelper.cerrarMenu();
                    },
                },
            ] as DriveStep[],
        },
        {
            id: 'mi-plan',
            nombre: 'Mi Plan',
            link: ['/mi-plan'],
            steps: [
                {
                    element: '#group-general-item-mi-plan',
                    popover: {
                        title: '¿Cómo llegar?',
                        description: 'Primero, debes saber que para llegar a Mi Plan deberás hacer click aquí, ¡Vamos allá!',
                        side: 'bottom',
                    },
                    onHighlightStarted: () => {
                        this.menuHelper.abrirMenu();
                    },
                    onDeselected: () => {
                        this.menuHelper.cerrarMenu();
                    },
                },
            ] as DriveStep[],
        },
        */
    ]);

    ayudaClick(modulo: { nombre: string; link: readonly any[]; steps: DriveStep[] }): void {
        const steps = [
            {
                popover: {
                    title: 'Te tenemos un tour guiado',
                    description: `Para que conozcas mejor el módulo ${modulo.nombre}, te haremos un tour guiado por sus funciones más importantes.`,
                },
            },
            ...modulo.steps,
        ];

        this.tourService.iniciarTour({
            pasos: steps,
            showProgress: false,
            doneBtnText: 'Siguiente',
            onNextFromLast: () => {
                this.router.navigate(modulo.link, { queryParams: { ayuda: 1 } });
            },
        });
    }
}
