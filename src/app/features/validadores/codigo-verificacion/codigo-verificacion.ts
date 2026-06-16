import { environment } from '@/environments/environment';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleX, lucideTriangleAlert } from '@ng-icons/lucide';
import { BrnInputOtpImports } from '@spartan-ng/brain/input-otp';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';
import { HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-codigo-verificacion',
    imports: [ReactiveFormsModule, BrnInputOtpImports, HlmInputOtpImports, NgIcon, HlmIcon, HlmP, HlmInputImports, HlmButtonImports],
    templateUrl: './codigo-verificacion.html',
    styleUrl: './codigo-verificacion.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideCircleX })],
})
export class CodigoVerificacion implements OnInit {
    private readonly route = inject(ActivatedRoute);

    urlImagen = `${environment.urlImages}/images/cognito-image-graphic-email-light.svg`;
    urlFondo = `${environment.urlImages}/images/joven-sosteniendo-tableta-blured.jpeg`;

    form: FormGroup<{
        correo: FormControl<string | null>;
        codigo: FormControl<string | null>;
    }> = new FormGroup({
        correo: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
        codigo: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    });

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const correo = params['correo'];
            const codigo = params['codigo'];

            console.log('codigo:', codigo);

            this.form.controls.correo.setValue(correo);
            this.form.controls.codigo.setValue(codigo);
        });
    }

    ocultarCorreo() {
        const correo = this.form.controls.correo.value;
        if (!correo || !correo.includes('@')) return '***@***';
        const partes = correo.split('@');
        const preArroba = partes[0].length > 0 ? partes[0].substring(0, 1) : '';
        const postArroba = partes[1].length > 0 ? partes[1].substring(0, 1) : '';
        return `${preArroba}***@${postArroba}***`;
    }

    verificarCodigo() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
    }

    reenviarCodigo() {}
}
