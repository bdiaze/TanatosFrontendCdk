import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTipoPeriodicidad } from './mantenedor-tipo-periodicidad';

describe('MantenedorTipoPeriodicidad', () => {
  let component: MantenedorTipoPeriodicidad;
  let fixture: ComponentFixture<MantenedorTipoPeriodicidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTipoPeriodicidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTipoPeriodicidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
