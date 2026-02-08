import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyHero } from './empty-hero';

describe('EmptyHero', () => {
  let component: EmptyHero;
  let fixture: ComponentFixture<EmptyHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyHero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
