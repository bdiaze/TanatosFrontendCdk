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
import { RouterLink } from '@angular/router';
import { AuthStore } from '@/app/services/auth-store';

@Component({
    selector: 'app-ayuda',
    imports: [HlmP, HlmH3, HlmH4, NgIcon, HlmIcon, HlmAccordionImports, EditorTexto, HlmSkeletonImports, RouterLink],
    templateUrl: './ayuda.html',
    styleUrl: './ayuda.scss',
    providers: [provideIcons({ lucideCircleQuestionMark })],
})
export class Ayuda implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
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
            link: '/inicio',
        },
        {
            id: 'mi-calendario',
            nombre: 'Mi Calendario',
            link: '/mi-calendario',
        },
        {
            id: 'mis-obligaciones',
            nombre: 'Mis Obligaciones',
            link: '/mis-obligaciones',
        },
        {
            id: 'plantillas-inscritas',
            nombre: 'Plantillas Inscritas',
            link: '/plantillas-inscritas',
        },
        {
            id: 'mi-equipo',
            nombre: 'Mi Equipo',
            link: '/mi-equipo',
        },
        {
            id: 'mis-negocios',
            nombre: 'Mis Negocios',
            link: '/mis-negocios',
        },
        {
            id: 'mi-plan',
            nombre: 'Mi Plan',
            link: '/mi-plan',
        },
    ]);
}
