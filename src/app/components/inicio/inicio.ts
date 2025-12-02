import { Component } from '@angular/core';
import { Hero } from '@/app/components/hero/hero';

@Component({
    selector: 'app-inicio',
    imports: [Hero],
    templateUrl: './inicio.html',
    styleUrl: './inicio.scss',
})
export class Inicio {}
