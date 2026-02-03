import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class S3Service {
    constructor(private http: HttpClient) {}

    subirArchivo(presignedUrl: string, file: File): Observable<HttpEvent<Object>> {
        return this.http.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
            reportProgress: true,
            observe: 'events',
        });
    }

    bajarArchivo(presignedUrl: string, filename: string) {
        const a = document.createElement('a');
        a.href = presignedUrl;
        a.download = filename;
        a.click();
    }
}
