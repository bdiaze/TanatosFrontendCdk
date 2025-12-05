import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTipoReceptorNotificacion } from './mantenedor-tipo-receptor-notificacion';

describe('MantenedorTipoReceptorNotificacion', () => {
    let component: MantenedorTipoReceptorNotificacion;
    let fixture: ComponentFixture<MantenedorTipoReceptorNotificacion>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MantenedorTipoReceptorNotificacion],
        }).compileComponents();

        fixture = TestBed.createComponent(MantenedorTipoReceptorNotificacion);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
