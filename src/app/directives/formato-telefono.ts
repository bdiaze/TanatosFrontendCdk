import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[formatoTelefono]',
})
export class FormatoTelefono {
    @Input('formatoTelefono') habilitado: boolean = true;

    constructor(private el: ElementRef<HTMLInputElement>) {}

    @HostListener('input', ['$event'])
    onInput(event: Event) {
        if (!this.habilitado) return;
        if (event && (event as any).isComposing) return;

        const input = event.target as HTMLInputElement;
        const oldValue = input.value;
        const oldSelectionStart = input.selectionStart ?? input.value.length;

        let digitos = input.value.replace(/\D+/g, '');

        let formatted = '';
        if (digitos.length > 0) {
            formatted = '+' + digitos.substring(0, 2);
        }
        if (digitos.length > 2) {
            formatted += ' ' + digitos.substring(2, 3);
        }
        if (digitos.length > 3) {
            formatted += ' ' + digitos.substring(3, 7);
        }
        if (digitos.length > 7) {
            formatted += ' ' + digitos.substring(7, 11);
        }
        if (digitos.length > 11) {
            formatted += ' ' + digitos.substring(11);
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
