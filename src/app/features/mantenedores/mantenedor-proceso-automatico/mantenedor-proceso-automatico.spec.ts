import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorProcesoAutomatico } from './mantenedor-proceso-automatico';

describe('MantenedorProcesoAutomatico', () => {
  let component: MantenedorProcesoAutomatico;
  let fixture: ComponentFixture<MantenedorProcesoAutomatico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorProcesoAutomatico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorProcesoAutomatico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
