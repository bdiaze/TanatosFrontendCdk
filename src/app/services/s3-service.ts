import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, Observable, retry, retryWhen, throwError, timer } from 'rxjs';
import { XhrHttpClient } from './xhr-http-client';

@Injectable({
    providedIn: 'root',
})
export class S3Service {
    constructor(private xhrHttp: XhrHttpClient) {}

    subirArchivo(presignedUrl: string, file: File): Observable<HttpEvent<void>> {
        return this.xhrHttp
            .put<void>(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                reportProgress: true,
                observe: 'events',
            })
            .pipe(
                retry({
                    count: 3,
                    delay: (error, retryCount) => {
                        if (error.status === 403 || error.status === 400) {
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
