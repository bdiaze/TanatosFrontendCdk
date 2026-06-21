import { EditorTexto } from '@/app/components/editor-texto/editor-texto';
import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { PreguntaFrecuenteDao } from '@/app/daos/pregunta-frecuente-dao';
import { EntPreguntaFrecuenteActualizar } from '@/app/entities/others/ent-pregunta-frecuente-actualizar';
import { EntPreguntaFrecuenteCrear } from '@/app/entities/others/ent-pregunta-frecuente-crear';
import { SalPreguntaFrecuente } from '@/app/entities/others/sal-pregunta-frecuente';
import { getErrorMessage } from '@/app/helpers/error-message';
import { PlainTextPipe } from '@/app/pipes/plain-text-pipe';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBadgeX, lucideEllipsis, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mantenedor-pregunta-frecuente',
    imports: [
        ModalEliminacion,
        ModalEdicion,
        HlmButtonImports,
        HlmTableImports,
        HlmH3,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmScrollAreaImports,
        HlmSkeletonImports,
        PlainTextPipe,
    ],
    templateUrl: './mantenedor-pregunta-frecuente.html',
    styleUrl: './mantenedor-pregunta-frecuente.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX })],
})
export class MantenedorPreguntaFrecuente implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly dao: PreguntaFrecuenteDao = inject(PreguntaFrecuenteDao);

    listado = signal([] as SalPreguntaFrecuente[]);
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    camposEdicion = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'oculto', requerido: true, deshabilitado: true },
        {
            llave: 'pregunta',
            nombre: 'Pregunta',
            tipo: 'editor-texto',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'respuesta',
            nombre: 'Respuesta',
            tipo: 'editor-texto',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'orden',
            nombre: 'Orden',
            tipo: 'number',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'habilitado',
            nombre: 'Habilitado',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    camposCreacion = signal<CampoDinamico[]>([
        {
            llave: 'pregunta',
            nombre: 'Pregunta',
            tipo: 'editor-texto',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'respuesta',
            nombre: 'Respuesta',
            tipo: 'editor-texto',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'orden',
            nombre: 'Orden',
            tipo: 'number',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'habilitado',
            nombre: 'Habilitado',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    itemSeleccionado = signal<SalPreguntaFrecuente | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        this.dao
            .obtenerVigentes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) => a.orden - b.orden);
                    this.listado.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener preguntas frecuentes', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener preguntas frecuentes');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalEliminar(item: SalPreguntaFrecuente) {
        this.itemSeleccionado.set({
            id: item.id,
            pregunta: item.pregunta,
            respuesta: item.respuesta,
            habilitado: item.habilitado,
            orden: item.orden,
        } as SalPreguntaFrecuente);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: SalPreguntaFrecuente) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar la pregunta frecuente', err);
                this.error.set(getErrorMessage(err) ?? 'Error al eliminar la pregunta frecuente');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(item: SalPreguntaFrecuente) {
        this.itemSeleccionado.set({
            id: item.id,
            pregunta: item.pregunta,
            respuesta: item.respuesta,
            habilitado: item.habilitado,
            orden: item.orden,
        } as SalPreguntaFrecuente);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(item: EntPreguntaFrecuenteActualizar) {
        this.cargando.set(true);

        this.dao.actualizar(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar la pregunta frecuente', err);
                this.error.set(getErrorMessage(err) ?? 'Error al editar la pregunta frecuente');
            },
        });
        this.showModalEditar.set(false);
    }

    openModalCrear() {
        this.itemSeleccionado.set(null);
        this.showModalCrear.set(true);
    }

    closeModalCrear() {
        this.showModalCrear.set(false);
        this.itemSeleccionado.set(null);
    }

    crear(item: EntPreguntaFrecuenteCrear) {
        this.cargando.set(true);

        this.dao.crear(item).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear la pregunta frecuente', err);
                this.error.set(getErrorMessage(err) ?? 'Error al crear la pregunta frecuente');
            },
        });
        this.showModalCrear.set(false);
    }
}
