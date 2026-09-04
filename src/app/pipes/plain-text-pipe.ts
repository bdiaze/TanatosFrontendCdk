import { inject, Pipe, PipeTransform } from '@angular/core';
import { HtmlSanitizerHelper } from '../helpers/html-sanitizer-helper';

@Pipe({
    name: 'plainText',
})
export class PlainTextPipe implements PipeTransform {
    private readonly sanitizer = inject(HtmlSanitizerHelper);

    transform(html: string | null | undefined): string {
        if (!html) return '';

        const sanitized = this.sanitizer.sanitizeQuill(html);

        const div = document.createElement('div');
        div.innerHTML = sanitized ?? '';

        // Se agregan saltos de línea a elementos de bloque
        div.querySelectorAll('h1, h2, h3, p, div, br, li').forEach((el) => {
            el.appendChild(document.createTextNode('\n'));
        });

        return (div.textContent || '').replace(/\n+/g, '\n').trim();
    }
}
