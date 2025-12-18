import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[clickOutside]',
})
export class ClickOutside {
    @Output() onClickOutside = new EventEmitter<void>();

    constructor(private el: ElementRef<HTMLElement>) {}

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        const target = event.target;

        if (!(target instanceof HTMLElement)) return;

        if (target.closest('[hlmsidebartrigger]')) return;

        if (target.closest('hlm-sidebar')) return;

        if (target.closest('hlm-sheet-content')) return;

        if (target.closest('hlm-dropdown-menu[sidebar-dropdown-menu]')) return;

        if (!this.el.nativeElement.contains(target)) {
            this.onClickOutside.emit();
        }
    }
}
