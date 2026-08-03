import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaVencimiento } from './tarjeta-vencimiento';

describe('TarjetaVencimiento', () => {
  let component: TarjetaVencimiento;
  let fixture: ComponentFixture<TarjetaVencimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaVencimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaVencimiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
