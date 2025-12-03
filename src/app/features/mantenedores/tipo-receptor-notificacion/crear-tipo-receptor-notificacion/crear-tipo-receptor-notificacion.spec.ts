import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoReceptorNotificacion } from './crear-tipo-receptor-notificacion';

describe('CrearTipoReceptorNotificacion', () => {
  let component: CrearTipoReceptorNotificacion;
  let fixture: ComponentFixture<CrearTipoReceptorNotificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTipoReceptorNotificacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTipoReceptorNotificacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
