import { ProcesoAutomaticoDao } from '@/app/daos/proceso-automatico-dao';
import { TipoProcesoAutomaticoDao } from '@/app/daos/tipo-proceso-automatico-dao';
import { ProcesoAutomatico } from '@/app/entities/models/proceso-automatico';
import { SalTipoProcesoAutomatico } from '@/app/entities/others/sal-tipo-proceso-automatico';
import { getErrorMessage } from '@/app/helpers/error-message';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBadgeX, lucideEllipsis, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmH3, HlmH4, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mantenedor-proceso-automatico',
    imports: [
        HlmButtonImports,
        HlmTableImports,
        HlmP,
        HlmH3,
        HlmH4,
        HlmAlertImports,
        NgIcon,
        HlmIcon,
        HlmDropdownMenuImports,
        HlmSpinnerImports,
        HlmScrollAreaImports,
        HlmSkeletonImports,
        ReactiveFormsModule,
        HlmInputImports,
        HlmInputGroupImports,
        HlmSelectImports,
        HlmFieldImports,
        HlmSeparatorImports,
        JsonPipe,
        NgClass,
    ],
    templateUrl: './mantenedor-proceso-automatico.html',
    styleUrl: './mantenedor-proceso-automatico.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideEllipsis, lucideBadgeCheck, lucideBadgeX }), DatePipe],
})
export class MantenedorProcesoAutomatico implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly procesoAutomaticoDao = inject(ProcesoAutomaticoDao);
    private readonly tipoProcesoAutomaticoDao = inject(TipoProcesoAutomaticoDao);
    private readonly datePipe = inject(DatePipe);

    procesosAutomaticos = signal([] as ProcesoAutomatico[]);
    tiposProcesosAutomaticos = signal([] as SalTipoProcesoAutomatico[]);
    mapTiposProcesosAutomaticos = computed(() => new Map(this.tiposProcesosAutomaticos().map((tipo) => [tipo.id, tipo])));

    cargandoProcesosAutomaticos = signal(true);
    cargandoTiposProcesosAutomaticos = signal(true);
    error = signal('');

    procesoAutomaticoSeleccionado = signal<ProcesoAutomatico | null>(null);
    seleccionarItem(item: ProcesoAutomatico) {
        const procesoAutomaticoSeleccionado = this.procesoAutomaticoSeleccionado();
        if (procesoAutomaticoSeleccionado?.id == item.id) {
            this.procesoAutomaticoSeleccionado.set(null);
        } else {
            this.procesoAutomaticoSeleccionado.set(item);
        }
    }

    siguienteId = signal<number | null>(null);
    filterForm: FormGroup<{
        cantidad: FormControl<number | null>;
        nombre: FormControl<string | null>;
        vigencia: FormControl<0 | 1 | 2 | null>;
    }> = new FormGroup({
        cantidad: new FormControl<number>({ value: 50, disabled: false }, [Validators.required, Validators.min(1), Validators.max(100)]),
        nombre: new FormControl<string>({ value: '', disabled: false }),
        vigencia: new FormControl<0 | 1 | 2>({ value: 1, disabled: false }, [Validators.required, Validators.min(0), Validators.max(2)]),
    });

    selectVigenciaItemToString = (value: 0 | 1 | 2) => {
        switch (value) {
            case 0:
                return 'Cualquiera';
            case 1:
                return 'Vigente';
            case 2:
                return 'No Vigente';
        }
    };

    ngOnInit(): void {
        this.obtenerProcesosAutomaticos();
        this.obtenerTiposProcesosAutomaticos();
    }

    nuevaBusqueda = signal(false);
    obtenerProcesosAutomaticos(borrarAnterior: boolean = true) {
        if (!this.filterForm.valid) {
            this.filterForm.markAllAsTouched();
            return;
        }

        this.cargandoProcesosAutomaticos.set(true);
        this.nuevaBusqueda.set(borrarAnterior);
        if (borrarAnterior) {
            this.siguienteId.set(null);
            this.procesosAutomaticos.set([]);
            this.procesoAutomaticoSeleccionado.set(null);
        }

        const siguienteId = this.siguienteId();
        const cantidad = this.filterForm.controls.cantidad.value;
        let nombre: string | null = this.filterForm.controls.nombre.value;
        if (nombre !== null && nombre.trim().length === 0) nombre = null;
        const idVigencia = this.filterForm.controls.vigencia.value;
        let vigencia: boolean | null;
        switch (idVigencia) {
            case 1:
                vigencia = true;
                break;
            case 2:
                vigencia = false;
                break;
            default:
                vigencia = null;
                break;
        }

        this.procesoAutomaticoDao
            .obtenerConPaginacion(siguienteId, cantidad, nombre, vigencia)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const sorted = res.items.sort((a, b) => a.id - b.id);
                    this.procesosAutomaticos.update((actuales) => [...actuales, ...sorted]);
                    this.siguienteId.set(res.siguienteId);
                },
                error: (err) => {
                    console.error('Error al obtener los procesos automáticos', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los procesos automáticos');
                },
            })
            .add(() => {
                this.cargandoProcesosAutomaticos.set(false);
            });
    }

    obtenerTiposProcesosAutomaticos() {
        this.cargandoTiposProcesosAutomaticos.set(true);

        this.tipoProcesoAutomaticoDao
            .obtenerVigentes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.tiposProcesosAutomaticos.set(res);
                },
                error: (err) => {
                    console.error('Error al obtener los tipos de procesos automáticos', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al obtener los tipos de procesos automáticos');
                },
            })
            .add(() => {
                this.cargandoTiposProcesosAutomaticos.set(false);
            });
    }

    nombreTipoProcesoAutomatico(idTipoProceso: number): string {
        return this.mapTiposProcesosAutomaticos().get(idTipoProceso)?.nombre ?? '';
    }

    formatearJson(texto: string) {
        try {
            return JSON.parse(texto);
        } catch {
            return texto;
        }
    }

    formatearFecha(texto: string | null | undefined) {
        if (!texto) return '';

        const fecha = new Date(texto);
        return this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm:ss');
    }
}
