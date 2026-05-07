import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorEmpleado } from './mantenedor-empleado';

describe('MantenedorEmpleado', () => {
  let component: MantenedorEmpleado;
  let fixture: ComponentFixture<MantenedorEmpleado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorEmpleado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorEmpleado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
