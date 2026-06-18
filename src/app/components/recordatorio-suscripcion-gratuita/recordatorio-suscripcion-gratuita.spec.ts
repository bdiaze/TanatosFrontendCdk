import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordatorioSuscripcionGratuita } from './recordatorio-suscripcion-gratuita';

describe('RecordatorioSuscripcionGratuita', () => {
  let component: RecordatorioSuscripcionGratuita;
  let fixture: ComponentFixture<RecordatorioSuscripcionGratuita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordatorioSuscripcionGratuita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordatorioSuscripcionGratuita);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
