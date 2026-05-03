import { TestBed } from '@angular/core/testing';

import { MobileHelper } from './mobile-helper';

describe('MobileHelper', () => {
  let service: MobileHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
