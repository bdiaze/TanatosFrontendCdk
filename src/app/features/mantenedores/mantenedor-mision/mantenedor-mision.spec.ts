import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorMision } from './mantenedor-mision';

describe('MantenedorMision', () => {
  let component: MantenedorMision;
  let fixture: ComponentFixture<MantenedorMision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorMision]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorMision);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
