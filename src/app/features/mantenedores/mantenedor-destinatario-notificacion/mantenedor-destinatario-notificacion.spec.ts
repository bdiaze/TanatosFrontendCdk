import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorDestinatarioNotificacion } from './mantenedor-destinatario-notificacion';

describe('MantenedorDestinatarioNotificacion', () => {
  let component: MantenedorDestinatarioNotificacion;
  let fixture: ComponentFixture<MantenedorDestinatarioNotificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorDestinatarioNotificacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorDestinatarioNotificacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
