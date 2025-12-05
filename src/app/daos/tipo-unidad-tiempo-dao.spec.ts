import { TestBed } from '@angular/core/testing';

import { TipoUnidadTiempoDao } from './tipo-unidad-tiempo-dao';

describe('TipoUnidadTiempoDao', () => {
  let service: TipoUnidadTiempoDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoUnidadTiempoDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
