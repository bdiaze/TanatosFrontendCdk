import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { XhrHttpClient } from './xhr-http-client';

@Injectable({
    providedIn: 'root',
})
export class S3Service {
    constructor(private xhrHttp: XhrHttpClient) {}

    subirArchivo(presignedUrl: string, file: File): Observable<HttpEvent<Object>> {
        return this.xhrHttp.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
            reportProgress: true,
            observe: 'events',
        });
    }

    bajarArchivo(presignedUrl: string) {
        window.location.href = presignedUrl;
    }
}
