import { EvaluacionDao } from '@/app/daos/evaluacion-dao';
import { EntEvaluacionCrear } from '@/app/entities/others/ent-evaluacion-crear';
import { getErrorMessage } from '@/app/helpers/error-message';
import { NgClass } from '@angular/common';
import { Component, effect, ElementRef, inject, input, signal, untracked, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend, lucideStar, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { HlmH3, HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-nueva-evaluacion',
    imports: [HlmH3, HlmP, NgIcon, HlmIcon, HlmSpinnerImports, HlmButtonImports, HlmTextareaImports, NgClass, ReactiveFormsModule, HlmAlertImports],
    templateUrl: './nueva-evaluacion.html',
    styleUrl: './nueva-evaluacion.scss',
    providers: [provideIcons({ lucideTriangleAlert, lucideStar, lucideSend })],
})
export class NuevaEvaluacion {
    postEvaluacion = input<() => void>();

    private readonly evaluacionDao = inject(EvaluacionDao);

    @ViewChild('comentario')
    comentario!: ElementRef<HTMLTextAreaElement>;

    form: FormGroup<{
        puntaje: FormControl<number | null>;
        comentario: FormControl<string | null>;
    }> = new FormGroup({
        puntaje: new FormControl<number | null>({ value: null, disabled: false }, [Validators.required]),
        comentario: new FormControl<string | null>({ value: null, disabled: false }),
    });

    constructor() {
        effect(() => {
            const puntajeSeleccionado = this.puntajeSeleccionado();
            untracked(() => {
                this.form.controls.puntaje.setValue(puntajeSeleccionado);
            });
        });

        effect(() => {
            const evaluacionEnviada = this.evaluacionEnviada();
            untracked(() => {
                if (evaluacionEnviada) {
                    this.form.controls.comentario.disable();
                } else {
                    this.form.controls.comentario.enable();
                }
            });
        });
    }

    puntajeSeleccionado = signal<number | null>(null);
    puntajeHover = signal<number | null>(null);

    seleccionarPuntaje(puntaje: number) {
        if (this.puntajeSeleccionado() !== puntaje) {
            this.puntajeSeleccionado.set(puntaje);
            this.comentario.nativeElement.focus();
        } else {
            this.puntajeSeleccionado.set(null);
            this.puntajeHover.set(null);
            this.form.markAsUntouched();
        }
    }

    preseleccionarPuntaje(puntaje: number) {
        this.puntajeHover.set(puntaje);
    }

    quitarPreseleccion(puntaje: number) {
        if (this.puntajeHover() === puntaje) {
            this.puntajeHover.set(null);
        }
    }

    enviandoEvaluacion = signal(false);
    error = signal('');
    evaluacionEnviada = signal(false);

    enviarEvaluacion() {
        this.error.set('');

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formPuntaje = this.form.controls.puntaje.value;
        let formComentario = this.form.controls.comentario.value;
        if (formComentario) formComentario = formComentario!.trim();
        if (!formComentario) formComentario = null;

        this.enviandoEvaluacion.set(true);
        this.evaluacionDao
            .crear({
                puntaje: formPuntaje,
                comentario: formComentario,
            } as EntEvaluacionCrear)
            .subscribe({
                next: (res) => {
                    this.evaluacionEnviada.set(true);
                    this.postEvaluacion()?.();
                },
                error: (err) => {
                    console.error('Error al ingresar evaluación', err);
                    this.error.set(getErrorMessage(err) ?? 'Error al ingresar evaluación');
                },
            })
            .add(() => {
                this.enviandoEvaluacion.set(false);
            });
    }
}
