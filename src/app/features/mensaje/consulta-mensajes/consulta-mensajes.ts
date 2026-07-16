import { MensajeDao } from '@/app/daos/mensaje-dao';
import { SalMensaje } from '@/app/entities/others/sal-mensaje';
import { getErrorMessage } from '@/app/helpers/error-message';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHam, lucideHash, lucideMail, lucideSearch, lucideTriangleAlert, lucideUserRound } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-consulta-mensajes',
    imports: [
        HlmButtonImports,
        HlmTableImports,
        HlmP,
        HlmH3,
        NgIcon,
        HlmIcon,
        HlmSkeletonImports,
        HlmDatePickerImports,
        ReactiveFormsModule,
        HlmSpinnerImports,
        HlmAlertImports,
        DatePipe,
    ],
    templateUrl: './consulta-mensajes.html',
    styleUrl: './consulta-mensajes.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideMail, lucideUserRound, lucideSearch, lucideHash }),
        provideHlmDatePickerConfig({
            autoCloseOnSelect: true,
            formatDate: (date: Date) => {
                return new Intl.DateTimeFormat('es-CL', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                }).format(date);
            },
        }),
    ],
})
export class ConsultaMensajes implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly mensajeDao = inject(MensajeDao);

    form: FormGroup<{
        fechaDesde: FormControl<Date | null>;
        fechaHasta: FormControl<Date | null>;
    }> = new FormGroup({
        fechaDesde: new FormControl<Date | null>({ value: null, disabled: false }, [Validators.required]),
        fechaHasta: new FormControl<Date | null>({ value: null, disabled: false }, [Validators.required]),
    });

    ngOnInit(): void {
        const fechaDesde = new Date();
        fechaDesde.setDate(fechaDesde.getDate() - 7);
        this.form.controls.fechaDesde.setValue(fechaDesde);

        const fechaHasta = new Date();
        this.form.controls.fechaHasta.setValue(fechaHasta);

        this.filtrar();
    }

    mensajes = signal<SalMensaje[]>([]);
    error = signal('');

    cargandoMensajes = signal<boolean>(false);

    filtrar() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        const fechaDesde = this.form.controls.fechaDesde.value!;
        fechaDesde.setHours(0, 0, 0, 0);
        const fechaHasta = this.form.controls.fechaHasta.value!;
        fechaHasta.setHours(23, 59, 59, 999);

        this.cargandoMensajes.set(true);
        this.mensajeDao
            .obtener(fechaDesde, fechaHasta)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = [...res].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
                    this.mensajes.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener evaluaciones', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener evaluaciones');
                },
            })
            .add(() => {
                this.cargandoMensajes.set(false);
            });
    }
}
