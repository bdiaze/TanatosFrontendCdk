import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoVerificacion } from './codigo-verificacion';

describe('CodigoVerificacion', () => {
  let component: CodigoVerificacion;
  let fixture: ComponentFixture<CodigoVerificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodigoVerificacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigoVerificacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
