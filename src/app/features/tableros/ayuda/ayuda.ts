import { PreguntaFrecuenteDao } from '@/app/daos/pregunta-frecuente-dao';
import { SalPreguntaFrecuenteHabilitado } from '@/app/entities/others/sal-pregunta-frecuente-habilitado';
import { getErrorMessage } from '@/app/helpers/error-message';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleQuestionMark } from '@ng-icons/lucide';
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

@Component({
    selector: 'app-ayuda',
    imports: [HlmP, HlmH3, HlmH4, NgIcon, HlmIcon, HlmAccordionImports, EditorTexto, HlmSkeletonImports],
    templateUrl: './ayuda.html',
    styleUrl: './ayuda.scss',
    providers: [provideIcons({ lucideCircleQuestionMark })],
})
export class Ayuda implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    private readonly menuHelper = inject(MenuHelper);
    private readonly tourService = inject(TourService);
    private readonly preguntaFrecuenteDao = inject(PreguntaFrecuenteDao);
    authStore = inject(AuthStore);

    error = signal('');

    ngOnInit(): void {
        this.obtenerPreguntasFrecuentes();
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
                        description: 'Primero, debes saber que para llegar a Inicio deberás hacer click aquí.',
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
                        description: 'Primero, debes saber que para llegar a Mi Calendario deberás hacer click aquí.',
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
                        description: 'Primero, debes saber que para llegar a Mis Obligaciones deberás hacer click aquí.',
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
                        description: 'Primero, debes saber que para llegar a Plantillas Inscritas deberás hacer click aquí.',
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
                        description: 'Primero, debes saber que para llegar a Mi Equipo deberás hacer click aquí.',
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
            id: 'mis-negocios',
            nombre: 'Mis Negocios',
            link: ['/mis-negocios'],
            steps: [
                {
                    element: '#group-general-item-mis-negocios',
                    popover: {
                        title: '¿Cómo llegar?',
                        description: 'Primero, debes saber que para llegar a Mis Negocios deberás hacer click aquí.',
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
                        description: 'Primero, debes saber que para llegar a Mi Plan deberás hacer click aquí.',
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
    ]);

    ayudaClick(modulo: { nombre: string; link: readonly any[]; steps: DriveStep[] }): void {
        const steps = [
            {
                popover: {
                    title: 'Te tenemos un recorrido guiado',
                    description: `Para que conozcas mejor el módulo ${modulo.nombre}, te mostraremos un recorrido guiado por sus funciones más importantes.`,
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
