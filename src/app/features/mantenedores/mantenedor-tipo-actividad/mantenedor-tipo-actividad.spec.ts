import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTipoActividad } from './mantenedor-tipo-actividad';

describe('MantenedorTipoActividad', () => {
  let component: MantenedorTipoActividad;
  let fixture: ComponentFixture<MantenedorTipoActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTipoActividad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTipoActividad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
