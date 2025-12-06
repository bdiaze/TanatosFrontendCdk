import { TestBed } from '@angular/core/testing';

import { TipoPeriodicidadDao } from './tipo-periodicidad-dao';

describe('TipoPeriodicidadDao', () => {
  let service: TipoPeriodicidadDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoPeriodicidadDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
