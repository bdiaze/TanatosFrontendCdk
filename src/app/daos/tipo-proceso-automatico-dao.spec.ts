import { TestBed } from '@angular/core/testing';

import { TipoProcesoAutomaticoDao } from './tipo-proceso-automatico-dao';

describe('TipoProcesoAutomaticoDao', () => {
  let service: TipoProcesoAutomaticoDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoProcesoAutomaticoDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
