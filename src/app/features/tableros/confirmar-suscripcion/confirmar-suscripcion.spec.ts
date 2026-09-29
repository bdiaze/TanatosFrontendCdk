import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarSuscripcion } from './confirmar-suscripcion';

describe('ConfirmarSuscripcion', () => {
  let component: ConfirmarSuscripcion;
  let fixture: ComponentFixture<ConfirmarSuscripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarSuscripcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarSuscripcion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
