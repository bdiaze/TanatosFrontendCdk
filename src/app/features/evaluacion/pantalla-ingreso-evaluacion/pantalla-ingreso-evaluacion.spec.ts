import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaIngresoEvaluacion } from './pantalla-ingreso-evaluacion';

describe('PantallaIngresoEvaluacion', () => {
  let component: PantallaIngresoEvaluacion;
  let fixture: ComponentFixture<PantallaIngresoEvaluacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaIngresoEvaluacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaIngresoEvaluacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
