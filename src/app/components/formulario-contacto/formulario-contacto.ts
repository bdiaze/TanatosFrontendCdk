import { MensajeDao } from '@/app/daos/mensaje-dao';
import { EntMensajeIngresar } from '@/app/entities/others/ent-mensaje-ingresar';
import { getErrorMessage } from '@/app/helpers/error-message';
import { RecaptchaHelper } from '@/app/helpers/recaptcha-helper';
import { AuthStore } from '@/app/services/auth-store';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMailCheck, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTextarea } from '@spartan-ng/helm/textarea';

@Component({
    selector: 'app-formulario-contacto',
    imports: [
        HlmButton,
        HlmInput,
        HlmTextarea,
        FormsModule,
        ReactiveFormsModule,
        HlmFieldImports,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmSpinnerImports,
    ],
    templateUrl: './formulario-contacto.html',
    styleUrl: './formulario-contacto.scss',
    providers: [
        provideIcons({
            lucideTriangleAlert,
            lucideMailCheck,
        }),
    ],
})
export class FormularioContacto {
    recaptchHelper = inject(RecaptchaHelper);
    mensajeDao = inject(MensajeDao);
    authStore = inject(AuthStore);

    form: FormGroup<{
        nombre: FormControl<string | null>;
        correo: FormControl<string | null>;
        contenido: FormControl<string | null>;
    }> = new FormGroup({
        nombre: new FormControl<string | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
        correo: new FormControl<string | null>({ value: null, disabled: false }, [
            Validators.required,
            Validators.email,
        ]),
        contenido: new FormControl<string | null>({ value: null, disabled: false }, [
            Validators.required,
        ]),
    });

    procesando = signal<boolean>(false);
    error = signal<string>('');
    ingresado = signal<boolean>(false);

    async ingresarMensaje() {
        this.ingresado.set(false);
        this.procesando.set(true);

        const token = await this.recaptchHelper.execute('contact_form');

        const entrada: EntMensajeIngresar = {
            nombre: this.form.controls['nombre'].value,
            correo: this.form.controls['correo'].value,
            contenido: this.form.controls['contenido'].value,
            recaptchaToken: token,
        } as EntMensajeIngresar;

        let observableInsertar;
        if (this.authStore.sesionIniciada()) {
            observableInsertar = this.mensajeDao.ingresar(entrada);
        } else {
            observableInsertar = this.mensajeDao.ingresarAnonimo(entrada);
        }

        observableInsertar
            .subscribe({
                next: () => {
                    this.form.reset();
                    this.ingresado.set(true);
                },
                error: (err) => {
                    console.error('Error al ingresar el mensaje', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al ingresar el mensaje');
                },
            })
            .add(() => {
                this.procesando.set(false);
            });
    }

    invalid(llave: string) {
        const control = this.form.get(llave);
        return control?.invalid && control?.touched;
    }
}
