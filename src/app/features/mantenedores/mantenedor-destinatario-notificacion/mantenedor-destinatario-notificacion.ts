import { CampoDinamico, ModalEdicion } from '@/app/components/modal-edicion/modal-edicion';
import { ModalEliminacion } from '@/app/components/modal-eliminacion/modal-eliminacion';
import { DestinatarioNotificacionDao } from '@/app/daos/destinatario-notificacion-dao';
import { TipoReceptorNotificacionDao } from '@/app/daos/tipo-receptor-notificacion-dao';
import { DestinatarioNotificacion } from '@/app/entities/models/destinatario-notificacion';
import { TipoReceptorNotificacion } from '@/app/entities/models/tipo-receptor-notificacion';
import { EntDestinatarioNotificacionCrear } from '@/app/entities/others/ent-destinatario-notificacion-crear';
import { SalDestinatarioNotificacion } from '@/app/entities/others/sal-destinatario-notificacion';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import {
    lucideBadgeCheck,
    lucideBadgeX,
    lucideEllipsis,
    lucideSend,
    lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH4 } from '@spartan-ng/helm/typography';
import { ModalCreacionDestinatario } from '@/app/components/modal-creacion-destinatario/modal-creacion-destinatario';
import { BrnTooltipImports } from '@spartan-ng/brain/tooltip';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { FormatearTelefonoPipe } from '@/app/pipes/formatear-telefono-pipe';

@Component({
    selector: 'app-mantenedor-destinatario-notificacion',
    imports: [
        ModalEliminacion,
        HlmButtonImports,
        HlmTableImports,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        ModalCreacionDestinatario,
        BrnTooltipImports,
        HlmTooltipImports,
        FormatearTelefonoPipe,
    ],
    templateUrl: './mantenedor-destinatario-notificacion.html',
    styleUrl: './mantenedor-destinatario-notificacion.scss',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideEllipsis,
            lucideBadgeCheck,
            lucideBadgeX,
            lucideSend,
        }),
    ],
})
export class MantenedorDestinatarioNotificacion implements OnInit {
    private dao: DestinatarioNotificacionDao = inject(DestinatarioNotificacionDao);
    private tipoReceptorDao = inject(TipoReceptorNotificacionDao);

    listado = signal([] as SalDestinatarioNotificacion[]);
    cargando = signal(true);
    error = signal('');

    showModalEliminar = signal(false);
    showModalCrear = signal(false);

    itemSeleccionado = signal<SalDestinatarioNotificacion | null>(null);

    ngOnInit(): void {
        this.obtenerTodos();
    }

    obtenerTodos() {
        this.cargando.set(true);
        this.listado.set([]);

        this.dao
            .obtenerVigentes()
            .subscribe({
                next: (res) => {
                    const sorted = res.sort((a, b) =>
                        a.destino.toLocaleLowerCase().localeCompare(b.destino.toLocaleLowerCase())
                    );
                    this.listado.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener tipos de fiscalizadores', err);
                    this.error.set(err.error ?? 'Error al obtener tipos de fiscalizadores');
                },
            })
            .add(() => {
                this.cargando.set(false);
            });
    }

    openModalEliminar(item: SalDestinatarioNotificacion) {
        this.itemSeleccionado.set(item);
        this.showModalEliminar.set(true);
    }

    closeModalEliminar() {
        this.showModalEliminar.set(false);
        this.itemSeleccionado.set(null);
    }

    eliminar(item: SalDestinatarioNotificacion) {
        this.cargando.set(true);
        this.dao.eliminar(item.id).subscribe({
            next: () => {
                this.obtenerTodos();
            },
            error: (err) => {
                this.cargando.set(false);
                console.error('Error al eliminar el destinatario', err);
                this.error.set(err.error ?? 'Error al eliminar el destinatario');
            },
        });
        this.showModalEliminar.set(false);
    }

    openModalCrear() {
        this.itemSeleccionado.set(null);
        this.showModalCrear.set(true);
    }

    closeModalCrear() {
        this.showModalCrear.set(false);
        this.itemSeleccionado.set(null);
    }

    confirmar(item: SalDestinatarioNotificacion) {
        this.obtenerTodos();
        this.showModalCrear.set(false);
    }
}
