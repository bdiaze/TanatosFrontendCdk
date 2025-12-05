import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmP } from '@spartan-ng/helm/typography';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
    selector: 'app-modal-eliminacion',
    standalone: true,
    imports: [HlmButtonImports, HlmCardImports, HlmP, HlmSeparatorImports],
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
