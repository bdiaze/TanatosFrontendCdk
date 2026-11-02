import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-icon',
    imports: [],
    templateUrl: './icon.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './icon.scss',
})
export class Icon {
    src = input.required<string>();
}
