import { NgClass } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmP } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-document-viewer',
    imports: [HlmSpinnerImports, HlmP, NgClass],
    templateUrl: './document-viewer.html',
    styleUrl: './document-viewer.scss',
})
export class DocumentViewer {
    url = input.required<string>();
    mime = input.required<string>();

    loading = signal(true);

    private readonly sanitizer = inject(DomSanitizer);

    isPdf = computed(() => this.mime() === 'application/pdf');

    isImage = computed(() => this.mime().startsWith('image/'));

    safeUrl = computed<SafeResourceUrl>(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.url()));

    documentoCargado(): void {
        setTimeout(() => {
            this.loading.set(false);
        }, 500);
    }
}
