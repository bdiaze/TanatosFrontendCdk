import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTemplateEdicion } from './mantenedor-template-edicion';

describe('MantenedorTemplateEdicion', () => {
  let component: MantenedorTemplateEdicion;
  let fixture: ComponentFixture<MantenedorTemplateEdicion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTemplateEdicion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTemplateEdicion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
