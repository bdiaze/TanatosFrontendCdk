import { TestBed } from '@angular/core/testing';

import { MovimientoFinancieroDao } from './movimiento-financiero-dao';

describe('MovimientoFinancieroDao', () => {
  let service: MovimientoFinancieroDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientoFinancieroDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
