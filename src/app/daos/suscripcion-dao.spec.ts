import { TestBed } from '@angular/core/testing';

import { SuscripcionDao } from './suscripcion-dao';

describe('SuscripcionDao', () => {
  let service: SuscripcionDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuscripcionDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
