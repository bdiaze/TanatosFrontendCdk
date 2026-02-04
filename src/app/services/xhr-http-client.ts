import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class XhrHttpClient {
    private http: HttpClient;

    constructor(backend: HttpBackend) {
        this.http = new HttpClient(backend);
    }

    put<T>(url: string, body: any, options?: any) {
        return this.http.put<T>(url, body, options);
    }

    post<T>(url: string, body: any, options?: any) {
        return this.http.post<T>(url, body, options);
    }
}
