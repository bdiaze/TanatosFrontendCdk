import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-modal-eliminacion',
    standalone: true,
    imports: [],
    templateUrl: './modal-eliminacion.html',
    styleUrl: './modal-eliminacion.scss',
})
export class ModalEliminacion {
    @Input() item: any;
    @Input() titulo: any;
    @Input() descripcion: any;
    @Output() cerrar = new EventEmitter<void>();
    @Output() eliminar = new EventEmitter<any>();

    confirmarEliminacion() {
        this.eliminar.emit(this.item);
    }
}
