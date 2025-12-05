import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTipoUnidadTiempo } from './mantenedor-tipo-unidad-tiempo';

describe('MantenedorTipoUnidadTiempo', () => {
  let component: MantenedorTipoUnidadTiempo;
  let fixture: ComponentFixture<MantenedorTipoUnidadTiempo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTipoUnidadTiempo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTipoUnidadTiempo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
