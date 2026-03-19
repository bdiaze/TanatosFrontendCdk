import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorPlan } from './mantenedor-plan';

describe('MantenedorPlan', () => {
  let component: MantenedorPlan;
  let fixture: ComponentFixture<MantenedorPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
