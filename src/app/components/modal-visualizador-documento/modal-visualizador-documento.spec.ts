import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVisualizadorDocumento } from './modal-visualizador-documento';

describe('ModalVisualizadorDocumento', () => {
  let component: ModalVisualizadorDocumento;
  let fixture: ComponentFixture<ModalVisualizadorDocumento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVisualizadorDocumento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVisualizadorDocumento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
