import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorSuscripcion } from './mantenedor-suscripcion';

describe('MantenedorSuscripcion', () => {
  let component: MantenedorSuscripcion;
  let fixture: ComponentFixture<MantenedorSuscripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorSuscripcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorSuscripcion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
