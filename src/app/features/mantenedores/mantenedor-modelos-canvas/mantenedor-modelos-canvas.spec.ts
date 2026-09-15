import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorModelosCanvas } from './mantenedor-modelos-canvas';

describe('MantenedorModelosCanvas', () => {
  let component: MantenedorModelosCanvas;
  let fixture: ComponentFixture<MantenedorModelosCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorModelosCanvas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorModelosCanvas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
