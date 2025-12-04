import { TipoReceptorNotificacionDao } from '@/app/daos/tipo-receptor-notificacion-dao';
import { TipoReceptorNotificacion } from '@/app/models/tipo-receptor-notificacion';
import { Component, inject, OnInit, signal } from '@angular/core';
import { catchError, combineLatest, of } from 'rxjs';
import { ModalEliminacion } from '@components/modal-eliminacion/modal-eliminacion';
import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
    selector: 'app-mantenedor-tipo-receptor-notificacion',
    imports: [ModalEliminacion, ModalEdicion, HlmButtonImports],
    templateUrl: './mantenedor-tipo-receptor-notificacion.html',
    styleUrl: './mantenedor-tipo-receptor-notificacion.scss',
})
export class MantenedorTipoReceptorNotificacion implements OnInit {
    private tipoReceptorNotificacionDao: TipoReceptorNotificacionDao = inject(
        TipoReceptorNotificacionDao
    );

    tiposReceptoresNotificacion = signal([] as TipoReceptorNotificacion[]);
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalEditar = signal(false);
    showModalCrear = signal(false);

    camposEdicion = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'number', requerido: true, deshabilitado: true },
        {
            llave: 'nombre',
            nombre: 'Nombre',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'vigencia',
            nombre: 'Vigencia',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    camposCreacion = signal<CampoDinamico[]>([
        { llave: 'id', nombre: 'ID', tipo: 'number', requerido: true, deshabilitado: false },
        {
            llave: 'nombre',
            nombre: 'Nombre',
            tipo: 'string',
            requerido: true,
            deshabilitado: false,
        },
        {
            llave: 'vigencia',
            nombre: 'Vigencia',
            tipo: 'boolean',
            requerido: true,
            deshabilitado: false,
        },
    ]);

    itemSeleccionado = signal<TipoReceptorNotificacion | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.tiposReceptoresNotificacion.set([]);

        const obsVigentes = this.tipoReceptorNotificacionDao.obtenerPorVigencia(true).pipe(
            catchError((err) => {
                console.error('Error al obtener tipos de receptores vigentes', err);
                this.error.set('Error al obtener tipos de receptores vigentes');
                return of([]);
            })
        );
        const obsNoVigente = this.tipoReceptorNotificacionDao.obtenerPorVigencia(false).pipe(
            catchError((err) => {
                console.error('Error al obtener tipos de receptores no vigentes', err);
                this.error.set('Error al obtener tipos de receptores no vigentes');
                return of([]);
            })
        );

        combineLatest([obsVigentes, obsNoVigente]).subscribe({
            next: ([resA, resB]) => {
                this.tiposReceptoresNotificacion.set([...resA, ...resB]);
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('Error inesperado');
                this.cargando.set(false);
            },
        });
    }

    openModalEliminar(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.itemSeleccionado.set(tipoReceptorNotificacion);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.cargando.set(true);
        this.tipoReceptorNotificacionDao.eliminar(tipoReceptorNotificacion.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el tipo de receptor de notificación', err);
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalEditar(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.itemSeleccionado.set(tipoReceptorNotificacion);
        this.showModalEditar.set(true);
    }

    closeModalEditar() {
        this.showModalEditar.set(false);
        this.itemSeleccionado.set(null);
    }

    editar(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.cargando.set(true);
        this.tipoReceptorNotificacionDao.actualizar(tipoReceptorNotificacion).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al editar el tipo de receptor de notificación', err);
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

    crear(tipoReceptorNotificacion: TipoReceptorNotificacion) {
        this.cargando.set(true);
        this.tipoReceptorNotificacionDao.crear(tipoReceptorNotificacion).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al crear el tipo de receptor de notificación', err);
            },
        });
        this.showModalCrear.set(false);
    }
}
