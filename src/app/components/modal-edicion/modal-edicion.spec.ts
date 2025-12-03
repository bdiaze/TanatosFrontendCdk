import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEdicion } from './modal-edicion';

describe('ModalEdicion', () => {
  let component: ModalEdicion;
  let fixture: ComponentFixture<ModalEdicion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEdicion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEdicion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
