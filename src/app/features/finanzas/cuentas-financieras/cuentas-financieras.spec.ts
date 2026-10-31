import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasFinancieras } from './cuentas-financieras';

describe('CuentasFinancieras', () => {
  let component: CuentasFinancieras;
  let fixture: ComponentFixture<CuentasFinancieras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentasFinancieras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasFinancieras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
