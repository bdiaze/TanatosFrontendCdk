import { TestBed } from '@angular/core/testing';

import { CuentaFinancieraDao } from './cuenta-financiera-dao';

describe('CuentaFinancieraDao', () => {
  let service: CuentaFinancieraDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentaFinancieraDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
