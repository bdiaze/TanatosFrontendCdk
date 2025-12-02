import { AuthStore } from '@services/auth-store';
import { Component, inject } from '@angular/core';
import { NgIf } from 'D:/Users/Benjam\u00EDn D\u00EDaz/Documents/Proyectos Angular/tanatos-frontend/node_modules/@angular/common/types/_common_module-chunk';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    sesionIniciada = inject(AuthStore).sesionIniciada;
}
