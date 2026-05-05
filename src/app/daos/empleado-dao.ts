import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalEmpleado } from '../entities/others/sal-empleado';
import { environment } from '@/environments/environment';
import { EntEmpleadoCrear } from '../entities/others/ent-empleado-crear';
import { EntEmpleadoActualizar } from '../entities/others/ent-empleado-actualizar';

@Injectable({
    providedIn: 'root',
})
export class EmpleadoDao {
    constructor(private http: HttpClient) {}

    obtenerVigentes(idNegocio: number): Observable<SalEmpleado[]> {
        return this.http.get<SalEmpleado[]>(environment.tanatosService.apiUrl + `/Empleado/Vigentes/${idNegocio}`);
    }

    crear(entrada: EntEmpleadoCrear): Observable<SalEmpleado> {
        return this.http.post<SalEmpleado>(environment.tanatosService.apiUrl + '/Empleado/', entrada);
    }

    actualizar(entrada: EntEmpleadoActualizar): Observable<SalEmpleado> {
        return this.http.put<SalEmpleado>(environment.tanatosService.apiUrl + '/Empleado/', entrada);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(environment.tanatosService.apiUrl + `/Empleado/${id}`);
    }
}
