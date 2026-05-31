import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[formatoCorreo]',
})
export class FormatoCorreo implements AfterViewInit {
    @Input('formatoCorreo') habilitado: boolean = true;

    constructor(private readonly el: ElementRef<HTMLInputElement>) {}

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
        const oldSelectionStart = input.selectionStart ?? oldValue.length;

        let formatted = this.formatear(input.value);
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
        let formatted = value;

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

        return formatted;
    }
}
