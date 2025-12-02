import { TestBed } from '@angular/core/testing';

import { AuthDao } from './auth-dao';

describe('AuthDao', () => {
  let service: AuthDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
