import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevoMovimiento } from './modal-nuevo-movimiento';

describe('ModalNuevoMovimiento', () => {
  let component: ModalNuevoMovimiento;
  let fixture: ComponentFixture<ModalNuevoMovimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNuevoMovimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNuevoMovimiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
