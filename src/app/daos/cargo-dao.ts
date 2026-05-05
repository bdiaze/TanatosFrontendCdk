import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalCargo } from '../entities/others/sal-cargo';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { EntCargoCrear } from '../entities/others/ent-cargo-crear';
import { EntCargoActualizar } from '../entities/others/ent-cargo-actualizar';

@Injectable({
    providedIn: 'root',
})
export class CargoDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalCargo[]> {
        return this.http.get<SalCargo[]>(environment.tanatosService.apiUrl + `/Cargo/Vigentes/${idNegocio}`);
    }

    crear(entrada: EntCargoCrear): Observable<SalCargo> {
        return this.http.post<SalCargo>(environment.tanatosService.apiUrl + '/Cargo/', entrada);
    }

    actualizar(entrada: EntCargoActualizar): Observable<SalCargo> {
        return this.http.put<SalCargo>(environment.tanatosService.apiUrl + '/Cargo/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/Cargo/${id}`);
    }
}
