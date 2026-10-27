import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTipoCuentaFinanciera } from './mantenedor-tipo-cuenta-financiera';

describe('MantenedorTipoCuentaFinanciera', () => {
  let component: MantenedorTipoCuentaFinanciera;
  let fixture: ComponentFixture<MantenedorTipoCuentaFinanciera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTipoCuentaFinanciera]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTipoCuentaFinanciera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
