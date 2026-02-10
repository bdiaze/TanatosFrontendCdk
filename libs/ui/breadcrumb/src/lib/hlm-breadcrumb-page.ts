import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
    selector: '[hlmBreadcrumbPage]',
    host: {
        role: 'link',
        'aria-disabled': 'true',
        'aria-current': 'page',
    },
})
export class HlmBreadcrumbPage {
    constructor() {
        classes(() => 'text-(--negro)/80 font-semibold font-serif');
    }
}
