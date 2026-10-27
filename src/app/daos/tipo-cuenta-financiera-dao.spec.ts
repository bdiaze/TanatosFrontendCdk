import { TestBed } from '@angular/core/testing';

import { TipoCuentaFinancieraDao } from './tipo-cuenta-financiera-dao';

describe('TipoCuentaFinancieraDao', () => {
  let service: TipoCuentaFinancieraDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoCuentaFinancieraDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
