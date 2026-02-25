import { DestinatarioNotificacionDao } from '@/app/daos/destinatario-notificacion-dao';
import { TipoReceptorNotificacionDao } from '@/app/daos/tipo-receptor-notificacion-dao';
import { TipoReceptorNotificacion } from '@/app/entities/models/tipo-receptor-notificacion';
import { EntDestinatarioNotificacionCrear } from '@/app/entities/others/ent-destinatario-notificacion-crear';
import { SalDestinatarioNotificacion } from '@/app/entities/others/sal-destinatario-notificacion';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideSend, lucideSmartphone } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { FormatoTelefono } from '@/app/directives/formato-telefono';
import { FormatoCorreo } from '@/app/directives/formato-correo';
import { NegocioStore } from '@/app/services/negocio-store';
import { getErrorMessage } from '@/app/helpers/error-message';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
    selector: 'app-modal-creacion-destinatario',
    imports: [
        ReactiveFormsModule,
        HlmButtonImports,
        HlmCardImports,
        HlmInputImports,
        HlmLabelImports,
        HlmFieldImports,
        HlmSeparatorImports,
        HlmInputGroupImports,
        HlmButtonGroupImports,
        HlmIcon,
        NgIcon,
        HlmRadioGroupImports,
        HlmAlertImports,
        HlmSpinnerImports,
        FormatoTelefono,
        FormatoCorreo,
        HlmSkeletonImports,
    ],
    templateUrl: './modal-creacion-destinatario.html',
    styleUrl: './modal-creacion-destinatario.scss',
    providers: [provideIcons({ lucideMail, lucideSmartphone, lucideSend })],
})
export class ModalCreacionDestinatario implements OnInit {
    @Output() cerrar = new EventEmitter<void>();
    @Output() confirmar = new EventEmitter<SalDestinatarioNotificacion>();

    tipoReceptorDao = inject(TipoReceptorNotificacionDao);
    destinatarioDao = inject(DestinatarioNotificacionDao);
    negocioStore = inject(NegocioStore);

    form: FormGroup<{
        alias: FormControl<string | null>;
        destino: FormControl<string | null>;
        idTipoReceptor: FormControl<number | null>;
    }> = new FormGroup({
        alias: new FormControl<string | null>(
            { value: null, disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        destino: new FormControl<string | null>(
            { value: null, disabled: false },
            {
                validators: [
                    Validators.required,
                    (control) =>
                        control.value?.trim().length === 0 ? { soloEspacios: true } : null,
                ],
                nonNullable: true,
            },
        ),
        idTipoReceptor: new FormControl<number | null>(
            { value: 1, disabled: false },
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
    });

    error = signal<string>('');

    cargandoTipoReceptores = signal<boolean>(true);
    tiposReceptoresVigentes = signal<TipoReceptorNotificacion[]>([]);

    procesando = signal<boolean>(false);

    ngOnInit(): void {
        this.form.get('idTipoReceptor')!.valueChanges.subscribe(() => {
            this.form.get('destino')!.markAsUntouched();
            this.form.get('destino')!.setValue('', { emitEvent: false });
            this.error.set('');

            if (this.form.controls['idTipoReceptor'].value === 1) {
                this.form.get('destino')?.addValidators(Validators.email);
            } else {
                this.form.get('destino')?.removeValidators(Validators.email);
            }
        });

        this.cargandoTipoReceptores.set(true);
        this.tipoReceptorDao
            .obtenerVigentes()
            .subscribe({
                next: (vigentes) => {
                    vigentes = vigentes.sort((a, b) =>
                        a.nombre.toLocaleLowerCase().localeCompare(b.nombre.toLocaleLowerCase()),
                    );
                    this.tiposReceptoresVigentes.set(vigentes);
                },
                error: (err) => {
                    console.error('Error al obtener tipos de receptores', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener tipos de receptores');
                },
            })
            .add(() => {
                this.cargandoTipoReceptores.set(false);
            });
    }

    clickConfirmar() {
        const item: EntDestinatarioNotificacionCrear = {
            idNegocio: this.negocioStore.negocioSeleccionado()?.id!,
            alias: this.form.controls['alias'].value,
            destino: this.form.controls['destino'].value!.replaceAll(' ', ''),
            idTipoReceptor: this.form.controls['idTipoReceptor'].value!,
        };

        this.procesando.set(true);
        this.destinatarioDao
            .crear(item)
            .subscribe({
                next: (res) => {
                    this.confirmar.emit(res);
                },
                error: (err) => {
                    console.error('Error al registrar el destinatario', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al registrar el destinatario');
                },
            })
            .add(() => {
                this.procesando.set(false);
            });
    }

    obtenerIconName(idTipoReceptor: number): string {
        switch (idTipoReceptor) {
            case 1:
                return 'lucideMail';
            case 2:
                return 'lucideSmartphone';
            default:
                return 'lucideSend';
        }
    }

    obtenerDestinoPlaceholder(idTipoReceptor: number | null): string {
        switch (idTipoReceptor) {
            case 1:
                return 'ejemplo@ejemplo.cl';
            case 2:
                return '+56 9 8877 6655';
            default:
                return '';
        }
    }

    invalid(llave: string) {
        const control = this.form.get(llave);
        return control?.invalid && control?.touched;
    }
}
