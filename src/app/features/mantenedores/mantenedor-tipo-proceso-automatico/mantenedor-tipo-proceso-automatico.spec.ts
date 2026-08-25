import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTipoProcesoAutomatico } from './mantenedor-tipo-proceso-automatico';

describe('MantenedorTipoProcesoAutomatico', () => {
  let component: MantenedorTipoProcesoAutomatico;
  let fixture: ComponentFixture<MantenedorTipoProcesoAutomatico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTipoProcesoAutomatico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTipoProcesoAutomatico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
