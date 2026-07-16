import { Component } from '@angular/core';
import { NuevaEvaluacion } from '../nueva-evaluacion/nueva-evaluacion';

@Component({
    selector: 'app-pantalla-ingreso-evaluacion',
    imports: [NuevaEvaluacion],
    templateUrl: './pantalla-ingreso-evaluacion.html',
    styleUrl: './pantalla-ingreso-evaluacion.scss',
})
export class PantallaIngresoEvaluacion {}
