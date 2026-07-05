import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordatorioSuscripcionPorVencer } from './recordatorio-suscripcion-por-vencer';

describe('RecordatorioSuscripcionGratuita', () => {
    let component: RecordatorioSuscripcionPorVencer;
    let fixture: ComponentFixture<RecordatorioSuscripcionPorVencer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RecordatorioSuscripcionPorVencer],
        }).compileComponents();

        fixture = TestBed.createComponent(RecordatorioSuscripcionPorVencer);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
