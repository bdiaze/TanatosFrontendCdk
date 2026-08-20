import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectToHome } from './redirect-to-home';

describe('RedirectToHome', () => {
  let component: RedirectToHome;
  let fixture: ComponentFixture<RedirectToHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectToHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectToHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
