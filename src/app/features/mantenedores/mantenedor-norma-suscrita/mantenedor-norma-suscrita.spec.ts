import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorNormaSuscrita } from './mantenedor-norma-suscrita';

describe('MantenedorNormaSuscrita', () => {
  let component: MantenedorNormaSuscrita;
  let fixture: ComponentFixture<MantenedorNormaSuscrita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorNormaSuscrita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorNormaSuscrita);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
