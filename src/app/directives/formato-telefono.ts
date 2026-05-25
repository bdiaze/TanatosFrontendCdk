import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[formatoTelefono]',
})
export class FormatoTelefono implements AfterViewInit {
    @Input('formatoTelefono') habilitado: boolean = true;

    constructor(private el: ElementRef<HTMLInputElement>) {}

    ngAfterViewInit() {
        if (!this.habilitado) return;
        const input = this.el.nativeElement;
        if (!input.value) return;

        const oldValue = input.value;
        let formatted = this.formatear(input.value);
        if (formatted === oldValue) return;
        input.value = formatted;
    }

    @HostListener('input', ['$event'])
    onInput(event: Event) {
        if (!this.habilitado) return;
        if (event && (event as any).isComposing) return;

        const input = event.target as HTMLInputElement;
        if (!input.value) return;
        const oldValue = input.value;
        const oldSelectionStart = input.selectionStart ?? input.value.length;

        const formatted = this.formatear(input.value);
        if (formatted === oldValue) return;
        input.value = formatted;

        const delta = input.value.length - oldValue.length;
        const newPos = Math.max(0, Math.min(input.value.length, oldSelectionStart + delta));
        try {
            input.setSelectionRange(newPos, newPos);
        } catch (e) {}

        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    private formatear(value: string): string {
        let digitos = value.replace(/\D+/g, '');

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

        return formatted;
    }
}
