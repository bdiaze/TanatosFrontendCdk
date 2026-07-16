import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaEvaluacion } from './nueva-evaluacion';

describe('NuevaEvaluacion', () => {
  let component: NuevaEvaluacion;
  let fixture: ComponentFixture<NuevaEvaluacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaEvaluacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaEvaluacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
