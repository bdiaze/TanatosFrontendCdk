import { TestBed } from '@angular/core/testing';

import { PreguntaFrecuenteDao } from './pregunta-frecuente-dao';

describe('PreguntaFrecuenteDao', () => {
  let service: PreguntaFrecuenteDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntaFrecuenteDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
