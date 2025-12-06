import { TestBed } from '@angular/core/testing';

import { TipoFiscalizadorDao } from './tipo-fiscalizador-dao';

describe('TipoFiscalizadorDao', () => {
  let service: TipoFiscalizadorDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoFiscalizadorDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
