import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorNormaSuscritaEdicion } from './mantenedor-norma-suscrita-edicion';

describe('MantenedorNormaSuscritaEdicion', () => {
  let component: MantenedorNormaSuscritaEdicion;
  let fixture: ComponentFixture<MantenedorNormaSuscritaEdicion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorNormaSuscritaEdicion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorNormaSuscritaEdicion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
