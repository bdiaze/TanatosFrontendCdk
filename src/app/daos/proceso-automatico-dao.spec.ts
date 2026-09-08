import { TestBed } from '@angular/core/testing';

import { ProcesoAutomaticoDao } from './proceso-automatico-dao';

describe('ProcesoAutomaticoDao', () => {
  let service: ProcesoAutomaticoDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesoAutomaticoDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
