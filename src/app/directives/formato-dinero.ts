import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, inject, Input } from '@angular/core';

@Directive({
    selector: '[formatoDinero]',
    providers: [DecimalPipe],
})
export class FormatoDinero implements AfterViewInit {
    @Input('formatoDinero') habilitado: boolean = true;

    private decimalPipe = inject(DecimalPipe);

    constructor(private readonly el: ElementRef<HTMLInputElement>) {}

    ngAfterViewInit(): void {
        if (!this.habilitado) return;
        const input = this.el.nativeElement;
        if (!input.value) return;

        const oldValue = input.value;
        let formatted = this.formatearDinero(input.value);
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

        const formatted = this.formatearDinero(input.value);
        if (formatted === oldValue) return;
        input.value = formatted;

        const delta = input.value.length - oldValue.length;
        const newPos = Math.max(0, Math.min(input.value.length, oldSelectionStart + delta));
        try {
            input.setSelectionRange(newPos, newPos);
        } catch (e) {}

        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    formatearDinero(value: string): string {
        let digitos = value.replace(/\D+/g, '');

        let formatted = '';
        if (digitos.length > 0) {
            formatted = '$' + this.decimalPipe.transform(Number(digitos), '1.0-0');
        } else if (value.startsWith('$')) {
            formatted = '$';
        }

        return formatted;
    }
}
