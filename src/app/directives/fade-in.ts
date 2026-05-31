import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
    selector: 'img[appFadeIn], video[appFadeIn]',
})
export class FadeIn implements AfterViewInit {
    constructor(
        private readonly el: ElementRef,
        private readonly renderer: Renderer2,
    ) {}

    ngAfterViewInit() {
        this.renderer.addClass(this.el.nativeElement, 'opacity-0');
        this.renderer.addClass(this.el.nativeElement, 'transition-opacity');
        this.renderer.addClass(this.el.nativeElement, 'duration-1000');
        this.renderer.addClass(this.el.nativeElement, 'ease-out');

        const el = this.el.nativeElement;
        if (el.complete || el.readyState >= 3) {
            this.show();
        }
    }

    @HostListener('load')
    @HostListener('canplay')
    onReady() {
        this.show();
    }

    private show() {
        this.renderer.removeClass(this.el.nativeElement, 'opacity-0');
        this.renderer.addClass(this.el.nativeElement, 'opacity-100');
    }
}
