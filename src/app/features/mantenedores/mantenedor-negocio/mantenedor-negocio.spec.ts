import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorNegocio } from './mantenedor-negocio';

describe('MantenedorNegocio', () => {
  let component: MantenedorNegocio;
  let fixture: ComponentFixture<MantenedorNegocio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorNegocio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorNegocio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
