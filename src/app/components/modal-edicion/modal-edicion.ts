import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBadgeX } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
    selector: 'app-modal-edicion',
    imports: [
        ReactiveFormsModule,
        HlmButtonImports,
        HlmCardImports,
        HlmInputImports,
        HlmLabelImports,
        HlmFieldImports,
        HlmSeparatorImports,
        HlmSwitch,
        HlmInputGroupImports,
        HlmButtonGroupImports,
        HlmIcon,
        NgIcon,
    ],
    templateUrl: './modal-edicion.html',
    styleUrl: './modal-edicion.scss',
    providers: [provideIcons({ lucideBadgeCheck, lucideBadgeX })],
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
