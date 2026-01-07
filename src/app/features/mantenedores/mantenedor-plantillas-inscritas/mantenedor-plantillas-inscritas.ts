import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { InscripcionTemplateDao } from '@/app/daos/inscripcion-template-dao';
import { TemplateDao } from '@/app/daos/template-dao';
import {
    TemplateConInscripcion,
    TemplateNormasConInscripcion,
} from '@/app/entities/others/template-con-inscripcion';
import { getErrorMessage } from '@/app/helpers/error-message';
import { AuthStore } from '@/app/services/auth-store';
import { NegocioStore } from '@/app/services/negocio-store';
import { Component, effect, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideBadgeX,
    lucideClipboardPaste,
    lucideEllipsis,
    lucideTriangleAlert,
} from '@ng-icons/lucide';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmH4, HlmP } from '@spartan-ng/helm/typography';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-mantenedor-plantillas-inscritas',
    imports: [
        ModalEliminacion,
        ModalEdicion,
        HlmButtonImports,
        HlmTableImports,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmP,
        HlmBadgeImports,
        BrnTooltipImports,
        HlmTooltipImports,
    ],
    templateUrl: './mantenedor-plantillas-inscritas.html',
    styleUrl: './mantenedor-plantillas-inscritas.scss',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideEllipsis,
            lucideBadgeCheck,
            lucideBadgeX,
            lucideClipboardPaste,
        }),
    ],
})
export class MantenedorPlantillasInscritas {
    inscripcionTemplateDao: InscripcionTemplateDao = inject(InscripcionTemplateDao);
    templateDao: TemplateDao = inject(TemplateDao);
    authStore = inject(AuthStore);
    negocioStore = inject(NegocioStore);

    listado = signal([] as TemplateConInscripcion[]);
    cargando = signal(true);
    error = signal('');

    showModalDesinscribirse = signal(false);
    showModalInscribirse = signal(false);
    itemSeleccionado = signal<TemplateConInscripcion | null>(null);

    camposEdicion = signal<CampoDinamico[]>([
        {
            llave: 'idTemplate',
            nombre: 'ID Template',
            tipo: 'oculto',
            requerido: true,
            deshabilitado: true,
        },
        {
            llave: 'nombreTemplate',
            nombre: 'Nombre Template',
            tipo: 'oculto',
            requerido: true,
            deshabilitado: true,
        },
        {
            llave: 'inscrito',
            nombre: 'Inscrito',
            tipo: 'oculto',
            requerido: false,
            deshabilitado: true,
        },
    ]);

    constructor() {
        effect(() => {
            if (this.negocioStore.negocioSeleccionado()) {
                this.obtenerTemplatesEInscripciones();
            }
        });
    }

    obtenerTemplatesEInscripciones() {
        this.cargando.set(true);
        this.listado.set([]);

        forkJoin({
            inscripciones: this.inscripcionTemplateDao.obtenerVigentes(
                this.negocioStore.negocioSeleccionado()?.id!
            ),
            templates: this.templateDao.obtenerVigentesConNormas(),
        })
            .subscribe({
                next: ({ inscripciones, templates }) => {
                    const templatesSorted = templates.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase())
                    );

                    const templatesConInscripciones: TemplateConInscripcion[] = [];
                    templatesSorted.forEach((template) => {
                        const normasSorted =
                            template.templateNormas?.sort((a, b) =>
                                a.nombre
                                    .toLocaleLowerCase()
                                    .localeCompare(b.nombre.toLocaleLowerCase())
                            ) ?? [];

                        const templatesNormasConInscripciones: TemplateNormasConInscripcion[] = [];
                        normasSorted.forEach((norma) => {
                            templatesNormasConInscripciones.push({
                                idNorma: norma.idNorma,
                                nombreNorma: norma.nombre,
                            });
                        });

                        templatesConInscripciones.push({
                            idTemplate: template.id,
                            nombreTemplate: template.nombre,
                            inscrito: inscripciones.some((i) => i.idTemplate == template.id),
                            templateNormas: templatesNormasConInscripciones,
                        });
                    });

                    this.listado.set(templatesConInscripciones);
                },
                error: (err) => {
                    console.error('Error al obtener las plantillas inscritas', err);
                    this.error.set(
                        getErrorMessage(err) ?? 'Error al obtener las plantillas inscritas'
                    );
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalDesinscribirse(item: TemplateConInscripcion) {
        this.itemSeleccionado.set(item);
        this.showModalDesinscribirse.set(true);
    }

    closeModalDesinscribirse() {
        this.showModalDesinscribirse.set(false);
        this.itemSeleccionado.set(null);
    }

    desinscribirse(item: TemplateConInscripcion) {
        this.cargando.set(true);
        this.inscripcionTemplateDao
            .desactivar({
                idNegocio: this.negocioStore.negocioSeleccionado()?.id!,
                idTemplate: item.idTemplate,
            })
            .subscribe({
                next: () => {
                    this.obtenerTemplatesEInscripciones();
                },
                error: (err) => {
                    this.cargando.set(false);
                    console.error('Error al desinscribirse de la plantilla', err);
                    this.error.set(err.error ?? 'Error al desinscribirse de la plantilla');
                },
            });
        this.showModalDesinscribirse.set(false);
    }

    openModalInscribirse(item: TemplateConInscripcion) {
        this.itemSeleccionado.set(item);
        this.showModalInscribirse.set(true);
    }

    closeModalInscribirse() {
        this.showModalInscribirse.set(false);
        this.itemSeleccionado.set(null);
    }

    inscribirse(item: TemplateConInscripcion) {
        this.cargando.set(true);
        this.inscripcionTemplateDao
            .activar({
                idNegocio: this.negocioStore.negocioSeleccionado()?.id!,
                idTemplate: item.idTemplate,
            })
            .subscribe({
                next: () => {
                    this.obtenerTemplatesEInscripciones();
                },
                error: (err) => {
                    this.cargando.set(false);
                    console.error('Error al inscribirse a la plantilla', err);
                    this.error.set(err.error ?? 'Error al inscribirse a la plantilla');
                },
            });
        this.showModalInscribirse.set(false);
    }

    listadoHTMLNormas(item: TemplateConInscripcion | null): string {
        if (!item || item.templateNormas.length == 0) {
            return '';
        }

        let retorno = '<br/>';
        retorno += '<div class="mt-2">';
        retorno += '<p class="mb-1"><u>Obligaciones</u></p>';

        item.templateNormas.forEach((norma) => {
            retorno += `<p class="text-sm">· ${norma.nombreNorma}</p>`;
        });

        if (item.templateNormas.length > 0) {
            retorno += '</div>';
        }

        return retorno;
    }
}
