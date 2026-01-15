import { TestBed } from '@angular/core/testing';

import { TipoRubroDao } from './tipo-rubro-dao';

describe('TipoRubroDao', () => {
  let service: TipoRubroDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoRubroDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
