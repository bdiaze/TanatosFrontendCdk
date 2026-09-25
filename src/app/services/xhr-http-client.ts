import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class XhrHttpClient {
    private readonly http: HttpClient;

    constructor(backend: HttpBackend) {
        this.http = new HttpClient(backend);
    }

    put<T>(url: string, body: any, options: any = {}) {
        return this.http.put<T>(url, body, {
            ...options,
            headers: this.addBypassHeader(options.headers),
        });
    }

    post<T>(url: string, body: any, options: any = {}) {
        return this.http.post<T>(url, body, {
            ...options,
            headers: this.addBypassHeader(options.headers),
        });
    }

    private addBypassHeader(headers: HttpHeaders | Record<string, string> | undefined) {
        if (headers instanceof HttpHeaders) {
            return headers.set('ngsw-bypass', '');
        }

        return {
            ...(headers ?? {}),
            'ngsw-bypass': '',
        };
    }
}
