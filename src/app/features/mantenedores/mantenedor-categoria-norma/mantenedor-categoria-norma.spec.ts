import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorCategoriaNorma } from './mantenedor-categoria-norma';

describe('MantenedorCategoriaNorma', () => {
  let component: MantenedorCategoriaNorma;
  let fixture: ComponentFixture<MantenedorCategoriaNorma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorCategoriaNorma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorCategoriaNorma);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
