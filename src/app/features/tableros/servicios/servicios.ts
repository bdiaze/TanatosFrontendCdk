import { environment } from '@/environments/environment';
import { Component } from '@angular/core';

@Component({
    selector: 'app-servicios',
    imports: [],
    templateUrl: './servicios.html',
    styleUrl: './servicios.scss',
})
export class Servicios {
    urlFondo1 = `${environment.urlImages}/images/vista-frontal-empleado-masculino-sirviendo-cafe.jpg`;
}
