import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntAuthObtenerAccessToken } from '@models/ent-auth-obtener-access-token';
import { environment } from '@environment';
import { SalAuthObtenerAccessToken } from '@models/sal-auth-obtener-access-token';
import { Observable } from 'rxjs';
import { getCookie } from '../helpers/cookie-helper';

@Injectable({
    providedIn: 'root',
})
export class AuthDao {
    constructor(private http: HttpClient) {}

    obtenerAccessToken(entrada: EntAuthObtenerAccessToken): Observable<SalAuthObtenerAccessToken> {
        return this.http.post<SalAuthObtenerAccessToken>(
            environment.tanatosService.apiUrl + '/public/Auth/ObtenerAccessToken',
            entrada,
            {
                withCredentials: true,
            }
        );
    }

    refreshAccessToken(): Observable<SalAuthObtenerAccessToken> {
        const csrfToken = getCookie('csrf_token');

        return this.http.post<SalAuthObtenerAccessToken>(
            environment.tanatosService.apiUrl + '/public/Auth/RefreshAccessToken',
            {},
            {
                headers: new HttpHeaders({ 'X-CSRF-Token': csrfToken ?? '' }),
                withCredentials: true,
            }
        );
    }

    limpiarAuthCookies(): Observable<void> {
        return this.http.post<void>(
            environment.tanatosService.apiUrl + '/Auth/LimpiarAuthCookies',
            {},
            {
                withCredentials: true,
            }
        );
    }
}
