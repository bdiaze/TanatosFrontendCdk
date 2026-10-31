import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartolaMovimientos } from './cartola-movimientos';

describe('CartolaMovimientos', () => {
  let component: CartolaMovimientos;
  let fixture: ComponentFixture<CartolaMovimientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartolaMovimientos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartolaMovimientos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
