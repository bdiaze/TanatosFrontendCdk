import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[formatoCorreo]',
})
export class FormatoCorreo {
    @Input('formatoCorreo') habilitado: boolean = true;

    constructor(private el: ElementRef<HTMLInputElement>) {}

    @HostListener('input', ['$event'])
    onInput(event: Event) {
        if (!this.habilitado) return;
        if (event && (event as any).isComposing) return;

        const input = event.target as HTMLInputElement;
        const oldValue = input.value;
        const oldSelectionStart = input.selectionStart ?? oldValue.length;

        let formatted = input.value;

        const atIndex = formatted.indexOf('@');
        if (atIndex >= 0) {
            const local = formatted.slice(0, atIndex).replace(/\s+/g, '').toLocaleLowerCase();
            const domain = formatted
                .slice(atIndex + 1)
                .replace(/\s+/g, '')
                .replace(/@+/g, '')
                .toLocaleLowerCase();
            formatted = `${local}@${domain}`;
        } else {
            formatted = formatted.replace(/\s+/g, '').toLocaleLowerCase();
        }
        if (formatted === oldValue) return;

        input.value = formatted;

        const delta = input.value.length - oldValue.length;
        const newPos = Math.max(0, Math.min(input.value.length, oldSelectionStart + delta));
        try {
            input.setSelectionRange(newPos, newPos);
        } catch (e) {}

        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}
