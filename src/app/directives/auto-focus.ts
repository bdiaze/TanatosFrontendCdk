import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[autoFocus]',
})
export class AutoFocus implements AfterViewInit {
    @Input('autoFocus') habilitado: boolean = true;

    constructor(private el: ElementRef<HTMLInputElement>) {}

    ngAfterViewInit() {
        if (!this.habilitado) return;
        setTimeout(() => this.el.nativeElement.focus());
    }
}
