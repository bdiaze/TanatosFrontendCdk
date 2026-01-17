import {
    Component,
    computed,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
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
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { normalize } from '@/app/helpers/string-comparator';

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
        BrnSelectImports,
        HlmSelectImports,
        HlmAutocompleteImports,
    ],
    templateUrl: './modal-edicion.html',
    styleUrl: './modal-edicion.scss',
    providers: [provideIcons({ lucideBadgeCheck, lucideBadgeX })],
})
export class ModalEdicion implements OnInit {
    @Input() campos: CampoDinamico[] = [];
    @Input() item: any;
    @Input() titulo: string = 'Editar';
    @Input() descripcion?: string;
    @Input() descripcionSecundaria?: string;
    @Input() conFuncionSecundaria: boolean = false;
    @Input() textoBotonGuardar: string = 'Guardar';
    @Input() textoBotonSecundario?: string;
    @Output() cerrar = new EventEmitter<void>();
    @Output() editar = new EventEmitter<any>();
    @Output() funcionSecundaria = new EventEmitter<any>();

    form: FormGroup<{ [key: string]: FormControl<any> }> = new FormGroup({});

    ngOnInit() {
        const camposForm: any = {};
        this.campos.forEach((campo) => {
            let valorInicial =
                campo.tipo === 'boolean'
                    ? this.item
                        ? this.item[campo.llave]
                        : false
                    : this.item
                      ? this.item[campo.llave]
                      : null;

            if (valorInicial === '') valorInicial = null;

            const validadores = [];
            if (campo.requerido) validadores.push(Validators.required);

            const control = new FormControl(
                { value: valorInicial, disabled: campo.deshabilitado },
                validadores,
            );

            if (campo.tipo === 'autocomplete') {
                campo.autocompleteSearch = signal('');
                campo.autocompleteFilteredOptions = computed(() => {
                    return campo.posiblesValores!.filter(
                        (option) =>
                            normalize(option.valor).includes(
                                normalize(campo.autocompleteSearch!()),
                            ) ||
                            (option.categoria
                                ? normalize(option.categoria!).includes(
                                      normalize(campo.autocompleteSearch!()),
                                  )
                                : false),
                    );
                });
                campo.autocompleteTransformOptionValue = (option: PosiblesValores) => option.id;
                campo.autocompleteDisplayWith = (id: number) =>
                    campo.posiblesValores?.find((option) => option.id === id)?.valor ?? '';
            }

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
    tipo: 'string' | 'number' | 'boolean' | 'select' | 'autocomplete' | 'oculto';
    requerido: boolean;
    deshabilitado: boolean;
    posiblesValores?: PosiblesValores[];
    autocompleteSearch?: WritableSignal<string>;
    autocompleteFilteredOptions?: Signal<PosiblesValores[]>;
    autocompleteTransformOptionValue?: (option: PosiblesValores) => number;
    autocompleteDisplayWith?: (id: number) => string;
}

export interface PosiblesValores {
    id: number;
    valor: string;
    categoria?: string;
}
