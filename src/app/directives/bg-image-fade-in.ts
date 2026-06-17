import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[bgImageFadeIn]',
})
export class BgImageFadeIn implements OnInit {
    @Input({ required: true }) bgImageFadeIn = '';

    constructor(private readonly el: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
        const host = this.el.nativeElement;
        host.style.position = 'relative';

        const bg = document.createElement('div');
        bg.style.cssText = `
            position: absolute;
            inset: 0;
            background-image: url(${this.bgImageFadeIn});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0;
            transition: opacity 0.3s ease-out;
            z-index: -1;
        `;
        host.prepend(bg);

        const img = new Image();
        img.src = this.bgImageFadeIn;
        img.onload = () => {
            bg.style.opacity = '1';
        };
    }
}
