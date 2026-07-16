import { EvaluacionDao } from '@/app/daos/evaluacion-dao';
import { SalEvaluacion } from '@/app/entities/others/sal-evaluacion';
import { getErrorMessage } from '@/app/helpers/error-message';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideStar, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-evaluaciones',
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
        DatePipe,
    ],
    templateUrl: './evaluaciones.html',
    styleUrl: './evaluaciones.scss',
    providers: [
        provideIcons({ lucideTriangleAlert, lucideStar, lucideSearch }),
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
export class Evaluaciones implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly evaluacionDao = inject(EvaluacionDao);

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

    evaluaciones = signal<SalEvaluacion[]>([]);
    error = signal('');

    cargandoEvaluaciones = signal<boolean>(false);
    filtrar() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        const fechaDesde = this.form.controls.fechaDesde.value!;
        fechaDesde.setHours(0, 0, 0, 0);
        const fechaHasta = this.form.controls.fechaHasta.value!;
        fechaHasta.setHours(23, 59, 59, 999);

        this.cargandoEvaluaciones.set(true);
        this.evaluacionDao
            .obtener(fechaDesde, fechaHasta)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = [...res].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
                    this.evaluaciones.set(sorted);
                },
                error: (err) => {
                    console.error('Error al obtener evaluaciones', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener evaluaciones');
                },
            })
            .add(() => {
                this.cargandoEvaluaciones.set(false);
            });
    }
}
