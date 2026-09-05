import { Component, effect, inject, untracked } from '@angular/core';
import { Hero } from '@/app/components/hero/hero';
import { getCookie } from '@/app/helpers/cookie-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
    selector: 'app-inicio',
    imports: [Hero],
    templateUrl: './inicio.html',
    host: {
        class: 'inline-block h-full w-full',
    },
})
export class Inicio {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    noRedirect = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('nr'))));

    constructor() {
        effect(() => {
            const noRedirect = this.noRedirect();
            untracked(() => {
                if (noRedirect !== '1') {
                    const cookieSesionIniciada = getCookie('SesionIniciada') === 'true';
                    if (cookieSesionIniciada) {
                        this.router.navigateByUrl('/inicio');
                    }
                }
            });
        });
    }
}
