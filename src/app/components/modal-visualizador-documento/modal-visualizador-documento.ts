import { Component, input, output } from '@angular/core';
import { DocumentViewer } from '../document-viewer/document-viewer';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucideX } from '@ng-icons/lucide';
import { HlmH4 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-modal-visualizador-documento',
    imports: [DocumentViewer, NgIcon, HlmIcon, HlmH4],
    templateUrl: './modal-visualizador-documento.html',
    styleUrl: './modal-visualizador-documento.scss',
    providers: [
        provideIcons({
            lucideX,
        }),
    ],
})
export class ModalVisualizadorDocumento {
    url = input.required<string>();
    nombre = input<string>('');
    mime = input.required<string>();
    cerrar = output<void>();
}
