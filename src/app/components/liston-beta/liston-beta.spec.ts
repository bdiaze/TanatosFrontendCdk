import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListonBeta } from './liston-beta';

describe('ListonBeta', () => {
  let component: ListonBeta;
  let fixture: ComponentFixture<ListonBeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListonBeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListonBeta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
