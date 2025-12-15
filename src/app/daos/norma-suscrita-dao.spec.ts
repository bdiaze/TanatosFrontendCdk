import { TestBed } from '@angular/core/testing';

import { NormaSuscritaDao } from './norma-suscrita-dao';

describe('NormaSuscritaDao', () => {
  let service: NormaSuscritaDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NormaSuscritaDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
