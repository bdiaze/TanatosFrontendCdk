import { TestBed } from '@angular/core/testing';

import { TipoActividadDao } from './tipo-actividad-dao';

describe('TipoActividadDao', () => {
  let service: TipoActividadDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoActividadDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
