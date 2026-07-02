import {
    Component,
    computed,
    ElementRef,
    EventEmitter,
    HostListener,
    input,
    Input,
    OnInit,
    Output,
    Signal,
    signal,
    ViewChild,
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
import { lucideBadgeCheck, lucideBadgeX, lucideSquarePen } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { normalize } from '@/app/helpers/string-comparator';
import { HlmH3 } from '@spartan-ng/helm/typography';
import { EditorTexto } from '../editor-texto/editor-texto';
import { NgClass } from '@angular/common';

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
        HlmH3,
        HlmSelectImports,
        HlmAutocompleteImports,
        EditorTexto,
        NgClass,
    ],
    templateUrl: './modal-edicion.html',
    providers: [provideIcons({ lucideBadgeCheck, lucideBadgeX, lucideSquarePen })],
})
export class ModalEdicion implements OnInit {
    campos = input<CampoDinamico[]>([]);
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

    contieneCampoEditorTexto = computed(() => {
        return this.campos().some((c) => c.tipo === 'editor-texto');
    });

    ngOnInit() {
        const camposForm: any = {};
        this.campos().forEach((campo) => {
            const valorDelItem = this.item ? this.item[campo.llave] : null;
            let valorInicial = campo.tipo === 'boolean' ? (valorDelItem ?? false) : valorDelItem;

            if (valorInicial === '') valorInicial = null;

            const validadores = [];
            if (campo.requerido) validadores.push(Validators.required);

            const control = new FormControl({ value: valorInicial, disabled: campo.deshabilitado }, validadores);

            if (campo.tipo === 'autocomplete') {
                const itemSeleccionado = campo.posiblesValores!.find((v) => v.id === valorInicial);
                campo.autocompleteSearch = signal(itemSeleccionado?.valor ?? '');
                campo.autocompleteFilteredOptions = computed(() => {
                    const filtrados = campo.posiblesValores!.filter(
                        (option) =>
                            normalize(option.valor).includes(normalize(campo.autocompleteSearch!())) ||
                            (option.categoria ? normalize(option.categoria!).includes(normalize(campo.autocompleteSearch!())) : false),
                    );

                    const categorizados: PosiblesValoresCategorizados[] = [];
                    [...new Set(filtrados.map((f) => f.categoria))].forEach((categoria) => {
                        categorizados.push({
                            categoria: categoria,
                            items: filtrados.filter((f) => f.categoria === categoria),
                        });
                    });

                    return categorizados;
                });
                campo.autocompleteItemToString = (id: number) => {
                    const item = campo.posiblesValores?.find((x) => x.id === id);
                    return `${item?.valor}`;
                };
            }

            if (campo.tipo === 'select') {
                campo.selectItemToString = (value: number) => {
                    return campo.posiblesValores?.find((c) => c.id === value)?.valor ?? '';
                };
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

    @ViewChild('overlay', { static: true })
    overlay!: ElementRef<HTMLDivElement>;

    private pointerStartedInOverlay = false;

    @HostListener('document:pointerdown', ['$event'])
    onPointerDown(event: PointerEvent) {
        this.pointerStartedInOverlay = event.target === this.overlay.nativeElement;
    }

    @HostListener('document:pointercancel')
    onPointerCancel() {
        this.pointerStartedInOverlay = false;
    }

    @HostListener('document:click', ['$event'])
    onClick(event: PointerEvent) {
        if (this.pointerStartedInOverlay && event.target === this.overlay.nativeElement) {
            this.cerrar.emit();
        }

        this.pointerStartedInOverlay = false;
    }
}

export interface CampoDinamico {
    llave: string;
    nombre?: string;
    tipo: 'string' | 'number' | 'boolean' | 'select' | 'autocomplete' | 'oculto' | 'editor-texto';
    requerido: boolean;
    deshabilitado: boolean;
    posiblesValores?: PosiblesValores[];
    autocompleteSearch?: WritableSignal<string>;
    autocompleteFilteredOptions?: Signal<PosiblesValoresCategorizados[]>;
    autocompleteItemToString?: (id: number) => string;
    selectItemToString?: (id: number) => string;
}

export interface PosiblesValores {
    id: number;
    valor: string;
    categoria?: string;
}

interface PosiblesValoresCategorizados {
    categoria?: string;
    items: PosiblesValores[];
}
