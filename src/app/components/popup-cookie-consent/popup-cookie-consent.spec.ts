import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCookieConsent } from './popup-cookie-consent';

describe('PopupCookieConsent', () => {
  let component: PopupCookieConsent;
  let fixture: ComponentFixture<PopupCookieConsent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupCookieConsent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCookieConsent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
