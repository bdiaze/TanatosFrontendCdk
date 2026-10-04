import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleObligacion } from './detalle-obligacion';

describe('DetalleObligacion', () => {
  let component: DetalleObligacion;
  let fixture: ComponentFixture<DetalleObligacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleObligacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleObligacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
