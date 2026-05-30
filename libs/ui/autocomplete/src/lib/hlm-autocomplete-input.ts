import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { BrnAutocompleteAnchor, BrnAutocompleteClear, BrnAutocompleteInput } from '@spartan-ng/brain/autocomplete';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
    selector: 'hlm-autocomplete-input',
    imports: [HlmInputGroupImports, NgIcon, BrnAutocompleteAnchor, BrnAutocompleteClear, BrnAutocompleteInput, NgClass],
    providers: [provideIcons({ lucideSearch, lucideX })],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <hlm-input-group brnAutocompleteAnchor class="w-auto" [ngClass]="classInputGroup()">
            <input
                brnAutocompleteInput
                #autocompleteInput="brnAutocompleteInput"
                hlmInputGroupInput
                [id]="inputId()"
                [placeholder]="placeholder()"
                [aria-invalid]="ariaInvalidOverride()"
                [ngClass]="classInput()"
            />

            @if (showSearch()) {
                <hlm-input-group-addon>
                    <ng-icon name="lucideSearch" [class.opacity-50]="autocompleteInput.disabled()" [ngClass]="classIcon()" />
                </hlm-input-group-addon>
            }

            @if (showClear()) {
                <hlm-input-group-addon align="inline-end">
                    <button
                        *brnAutocompleteClear
                        hlmInputGroupButton
                        data-slot="autocomplete-clear"
                        [disabled]="autocompleteInput.disabled()"
                        size="icon-xs"
                        variant="ghost"
                    >
                        <ng-icon name="lucideX" [ngClass]="classIcon()" />
                    </button>
                </hlm-input-group-addon>
            }
            <ng-content />
        </hlm-input-group>
    `,
})
export class HlmAutocompleteInput {
    private static _id = 0;

    public readonly inputId = input<string>(`hlm-autocomplete-input-${HlmAutocompleteInput._id++}`);

    public readonly placeholder = input<string>('');

    public readonly showSearch = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
    public readonly showClear = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

    public readonly classInput = input<string>('');
    public readonly classInputGroup = input<string>('');
    public readonly classIcon = input<string>('');

    /** Manual override for aria-invalid. When not set, auto-detects from the parent autocomplete error state. */
    public readonly ariaInvalidOverride = input<boolean | undefined, BooleanInput>(undefined, {
        transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
        alias: 'aria-invalid',
    });
}
