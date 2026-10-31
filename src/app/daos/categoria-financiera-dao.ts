import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalCategoriaFinanciera } from '../entities/others/sal-categoria-financiera';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { EntCategoriaFinancieraCrear } from '../entities/others/ent-categoria-financiera-crear';
import { EntCategoriaFinancieraActualizar } from '../entities/others/ent-categoria-financiera-actualizar';

@Injectable({
    providedIn: 'root',
})
export class CategoriaFinancieraDao {
    constructor(private readonly http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalCategoriaFinanciera[]> {
        return this.http.get<SalCategoriaFinanciera[]>(environment.tanatosService.apiUrl + `/CategoriaFinanciera/Vigentes/${idNegocio}`);
    }

    crear(entrada: EntCategoriaFinancieraCrear): Observable<SalCategoriaFinanciera> {
        return this.http.post<SalCategoriaFinanciera>(environment.tanatosService.apiUrl + '/CategoriaFinanciera/', entrada);
    }

    actualizar(entrada: EntCategoriaFinancieraActualizar): Observable<SalCategoriaFinanciera> {
        return this.http.put<SalCategoriaFinanciera>(environment.tanatosService.apiUrl + '/CategoriaFinanciera/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/CategoriaFinanciera/${id}`);
    }
}
