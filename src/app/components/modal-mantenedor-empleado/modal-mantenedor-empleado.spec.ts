import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMantenedorEmpleado } from './modal-mantenedor-empleado';

describe('ModalMantenedorEmpleado', () => {
  let component: ModalMantenedorEmpleado;
  let fixture: ComponentFixture<ModalMantenedorEmpleado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMantenedorEmpleado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMantenedorEmpleado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
