import { PerfilDao } from '@/app/daos/perfil-dao';
import { EntPerfilConfirmarRegistro } from '@/app/entities/others/ent-perfil-confirmar-registro';
import { EntPerfilReenviarCodigoVerificacion } from '@/app/entities/others/ent-perfil-reenviar-codigo-verificacion';
import { getErrorMessage } from '@/app/helpers/error-message';
import { environment } from '@/environments/environment';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { redireccionarALogin } from '../../auth/login/login';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { BgImageFadeIn } from '@/app/directives/bg-image-fade-in';
import { PaginaSinMenuEstaticoHelper } from '@/app/helpers/pagina-sin-menu-estatico-helper';

@Component({
    selector: 'app-codigo-verificacion',
    imports: [
        ReactiveFormsModule,
        BrnInputOtpImports,
        HlmInputOtpImports,
        NgIcon,
        HlmIcon,
        HlmP,
        HlmInputImports,
        HlmButtonImports,
        HlmSpinnerImports,
        BgImageFadeIn,
    ],
    templateUrl: './codigo-verificacion.html',
    styleUrl: './codigo-verificacion.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideCircleX })],
})
export class CodigoVerificacion implements OnInit, OnDestroy {
    private readonly paginaSinMenuEstaticoHelper = inject(PaginaSinMenuEstaticoHelper);
    private readonly route = inject(ActivatedRoute);
    private readonly perfilDao = inject(PerfilDao);

    urlImagen = `${environment.urlImages}/images/cognito-image-graphic-email-light.svg`;
    urlFondo = `${environment.urlImages}/images/joven-sosteniendo-tableta-blured.jpeg`;

    form: FormGroup<{
        correo: FormControl<string | null>;
        codigo: FormControl<string | null>;
    }> = new FormGroup({
        correo: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required, Validators.email]),
        codigo: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    });

    error = signal<string>('');
    vienenCorreoElectronico = signal<boolean>(false);

    ngOnInit(): void {
        this.paginaSinMenuEstaticoHelper.quitarMenuEstatico();
        this.route.queryParams.subscribe((params) => {
            let correo: string | null = null;
            let codigo: string | null = null;

            const payload = params['p'];
            if (payload) {
                const jsonPayload = JSON.parse(atob(payload));
                correo = jsonPayload.correo ?? null;
                codigo = jsonPayload.codigo ?? null;
            }

            if (correo) this.vienenCorreoElectronico.set(true);
            else this.vienenCorreoElectronico.set(false);

            this.form.controls.correo.setValue(correo);
            this.form.controls.codigo.setValue(codigo);
        });
    }

    ngOnDestroy(): void {
        this.paginaSinMenuEstaticoHelper.mostrarMenuEstatico();
    }

    ocultarCorreo() {
        const correo = this.form.controls.correo.value;
        if (!correo || !correo.includes('@')) return '****@****';
        const partes = correo.split('@');
        const preArroba = partes[0].length > 0 ? partes[0].substring(0, 1) : '*';
        const postArroba = partes[1].length > 0 ? partes[1].substring(0, 1) : '*';
        return `${preArroba}***@${postArroba}***`;
    }

    verificandoCodigo = signal<boolean>(false);
    verificarCodigo() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.verificandoCodigo.set(true);
        this.perfilDao
            .confirmarRegistro({
                username: this.form.controls.correo.value,
                codigo: this.form.controls.codigo.value,
            } as EntPerfilConfirmarRegistro)
            .subscribe({
                next: () => {
                    redireccionarALogin('login');
                },
                error: (err) => {
                    console.error('Error al validar código de verificación', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al validar código de verificación');
                    this.verificandoCodigo.set(false);
                },
            });
    }

    reenviandoCodigo = signal<boolean>(false);
    reenviarCodigo() {
        this.reenviandoCodigo.set(true);
        this.perfilDao
            .reenviarCodigoVerificacion({
                username: this.form.controls.correo.value,
            } as EntPerfilReenviarCodigoVerificacion)
            .subscribe({
                next: () => {},
                error: (err) => {
                    console.error('Error al reenviar código de verificación', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al reenviar código de verificación');
                },
            })
            .add(() => {
                this.reenviandoCodigo.set(false);
            });
    }
}
