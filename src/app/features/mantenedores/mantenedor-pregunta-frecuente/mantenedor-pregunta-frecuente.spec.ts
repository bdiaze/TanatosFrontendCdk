import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorPreguntaFrecuente } from './mantenedor-pregunta-frecuente';

describe('MantenedorPreguntaFrecuente', () => {
  let component: MantenedorPreguntaFrecuente;
  let fixture: ComponentFixture<MantenedorPreguntaFrecuente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorPreguntaFrecuente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorPreguntaFrecuente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
