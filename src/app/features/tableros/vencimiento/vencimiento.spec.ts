import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vencimiento } from './vencimiento';

describe('Vencimiento', () => {
  let component: Vencimiento;
  let fixture: ComponentFixture<Vencimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vencimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vencimiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
