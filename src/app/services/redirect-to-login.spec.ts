import { TestBed } from '@angular/core/testing';

import { RedirectToLogin } from './redirect-to-login';

describe('RedirectToLogin', () => {
  let service: RedirectToLogin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectToLogin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
