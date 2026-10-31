import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorCategoriasFinancieras } from './mantenedor-categorias-financieras';

describe('MantenedorCategoriasFinancieras', () => {
  let component: MantenedorCategoriasFinancieras;
  let fixture: ComponentFixture<MantenedorCategoriasFinancieras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorCategoriasFinancieras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorCategoriasFinancieras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
