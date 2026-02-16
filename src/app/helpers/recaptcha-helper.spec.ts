import { TestBed } from '@angular/core/testing';

import { RecaptchaHelper } from './recaptcha-helper';

describe('RecaptchaHelper', () => {
  let service: RecaptchaHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecaptchaHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
