import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

export const hlmH1 = 'scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl font-serif';

@Directive({
    selector: '[hlmH1]',
    host: {
        '[class]': '_computedClass()',
    },
})
export class HlmH1 {
    public readonly userClass = input<ClassValue>('', { alias: 'class' });
    protected readonly _computedClass = computed(() => hlm(hlmH1, this.userClass()));
}
