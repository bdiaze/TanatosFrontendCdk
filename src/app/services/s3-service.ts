import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, Observable, retry, retryWhen, throwError, timeout, timer } from 'rxjs';
import { XhrHttpClient } from './xhr-http-client';
import { formatCurrency } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class S3Service {
    constructor(private xhrHttp: XhrHttpClient) {}

    subirArchivo(
        presignedUrl: string,
        presignedFields: Record<string, string>,
        file: File,
    ): Observable<HttpEvent<void>> {
        const formData = new FormData();

        // Se añaden los fields
        Object.entries(presignedFields).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Se añade content-type
        formData.append('Content-Type', file.type);

        // Se añade el archivo
        formData.append('file', file);

        return this.xhrHttp
            .post<void>(presignedUrl, formData, {
                reportProgress: true,
                observe: 'events',
            })
            .pipe(
                timeout(5 * 60 * 1000),
                retry({
                    count: 3,
                    delay: (error, retryCount) => {
                        if (
                            error.status === 400 ||
                            error.status === 403 ||
                            error.status === 401 ||
                            error.status === 413 ||
                            error.status === 412
                        ) {
                            return throwError(() => error);
                        }

                        // ⏱️ Backoff simple
                        return timer(1000 * retryCount);
                    },
                }),
            );
    }

    bajarArchivo(presignedUrl: string) {
        window.location.href = presignedUrl;
    }
}
