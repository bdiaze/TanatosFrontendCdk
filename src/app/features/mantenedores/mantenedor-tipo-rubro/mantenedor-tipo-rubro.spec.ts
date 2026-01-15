import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTipoRubro } from './mantenedor-tipo-rubro';

describe('MantenedorTipoRubro', () => {
  let component: MantenedorTipoRubro;
  let fixture: ComponentFixture<MantenedorTipoRubro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTipoRubro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTipoRubro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
