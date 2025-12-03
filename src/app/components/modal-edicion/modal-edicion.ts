import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-modal-edicion',
    imports: [ReactiveFormsModule],
    templateUrl: './modal-edicion.html',
    styleUrl: './modal-edicion.scss',
})
export class ModalEdicion implements OnInit {
    @Input() campos: CampoDinamico[] = [];
    @Input() item: any;
    @Input() titulo: any;
    @Output() cerrar = new EventEmitter<void>();
    @Output() editar = new EventEmitter<any>();

    form: FormGroup<{ [key: string]: FormControl<any> }> = new FormGroup({});

    ngOnInit() {
        const camposForm: any = {};
        this.campos.forEach((campo) => {
            const valorInicial =
                campo.tipo === 'boolean'
                    ? this.item
                        ? this.item[campo.llave]
                        : false
                    : this.item
                    ? this.item[campo.llave]
                    : '';

            const validadores = [];
            if (campo.requerido) validadores.push(Validators.required);

            const control = new FormControl(
                { value: valorInicial, disabled: campo.deshabilitado },
                validadores
            );

            camposForm[campo.llave] = control;
        });

        this.form = new FormGroup(camposForm);
    }

    confirmar() {
        this.editar.emit(this.form?.getRawValue());
    }

    invalid(llave: string) {
        const control = this.form.get(llave);
        return control?.invalid && control?.touched;
    }
}

export interface CampoDinamico {
    llave: string;
    nombre?: string;
    tipo: 'string' | 'number' | 'boolean';
    requerido: boolean;
    deshabilitado: boolean;
}
