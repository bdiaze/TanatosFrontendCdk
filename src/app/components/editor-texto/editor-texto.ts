import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';

@Component({
    selector: 'app-editor-texto',
    imports: [],
    templateUrl: './editor-texto.html',
    styleUrl: './editor-texto.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EditorTexto),
            multi: true,
        },
    ],
})
export class EditorTexto implements AfterViewInit, ControlValueAccessor, OnChanges {
    @Input() content: string | null | undefined = null;
    @Input() placeholder: string | null = null;
    @Input() readonly: boolean = false;
    @ViewChild('editor', { static: false }) editorElement!: ElementRef;

    quill!: Quill;

    value: string = '';

    private onChange = (value: string) => {};
    private onTouched = () => {};

    ngAfterViewInit(): void {
        if (!this.content) {
            this.quill = new Quill(this.editorElement.nativeElement, {
                theme: 'snow',
                readOnly: this.readonly,
                placeholder: this.placeholder ?? undefined,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ header: [1, 2, 3, false] }],
                        [{ script: 'sub' }, { script: 'super' }],
                        [{ indent: '-1' }, { indent: '+1' }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                    ],
                },
                formats: [
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'blockquote',
                    'script',
                    'list',
                    'indent',
                    'header',
                    'link',
                ],
            });

            if (this.value) {
                this.quill.root.innerHTML = this.value;
            }

            this.quill.on('text-change', () => {
                const html = this.quill.root.innerHTML;
                const value = html === '<p><br></p>' ? '' : html;
                this.value = value;
                this.onChange(value);
            });
        }
    }

    writeValue(value: string): void {
        this.value = value || '';
        if (this.quill) {
            this.quill.root.innerHTML = this.value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (this.quill) {
            this.quill.enable(!isDisabled);
        }
    }

    ngOnChanges(): void {
        if (this.quill) {
            this.quill.enable(!this.readonly);
        }
    }
}
