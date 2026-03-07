import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'plainText',
})
export class PlainTextPipe implements PipeTransform {
    transform(html: string | null | undefined): string {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
}
