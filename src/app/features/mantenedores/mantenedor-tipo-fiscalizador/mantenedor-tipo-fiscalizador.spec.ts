import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTipoFiscalizador } from './mantenedor-tipo-fiscalizador';

describe('MantenedorTipoFiscalizador', () => {
  let component: MantenedorTipoFiscalizador;
  let fixture: ComponentFixture<MantenedorTipoFiscalizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTipoFiscalizador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTipoFiscalizador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
