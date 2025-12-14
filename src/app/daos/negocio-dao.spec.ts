import { TestBed } from '@angular/core/testing';

import { NegocioDao } from './negocio-dao';

describe('NegocioDao', () => {
  let service: NegocioDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NegocioDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
