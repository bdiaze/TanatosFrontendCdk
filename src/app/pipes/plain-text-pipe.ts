import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'plainText',
})
export class PlainTextPipe implements PipeTransform {
    transform(html: string | null | undefined): string {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;

        // Se agregan saltos de línea a elementos de bloque
        div.querySelectorAll('p, div, br, li').forEach((el) => {
            el.appendChild(document.createTextNode('\n'));
        });

        return (div.textContent || '').replace(/\n+/g, '\n').trim();
    }
}
