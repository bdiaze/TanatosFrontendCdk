import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmP } from '@spartan-ng/helm/typography';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
    selector: 'app-modal-eliminacion',
    standalone: true,
    imports: [
        HlmButtonImports,
        HlmCardImports,
        HlmP,
        HlmSeparatorImports,
        NgIcon,
        HlmIcon,
        HlmInputImports,
    ],
    templateUrl: './modal-eliminacion.html',
    styleUrl: './modal-eliminacion.scss',
    providers: [provideIcons({ lucideCircleAlert })],
})
export class ModalEliminacion {
    @Input() item: any;
    @Input() titulo: any;
    @Input() descripcion: any;
    @Input() descripcionTextVerificacion?: string;
    @Input() textoVerificacion?: string;
    @Output() cerrar = new EventEmitter<void>();
    @Output() eliminar = new EventEmitter<any>();

    textoVerificacionIngresado = signal<string>('');

    confirmarEliminacion() {
        this.eliminar.emit(this.item);
    }
}
