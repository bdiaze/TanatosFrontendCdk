import { TestBed } from '@angular/core/testing';

import { CategoriaNormaDao } from './categoria-norma-dao';

describe('CategoriaNormaDao', () => {
  let service: CategoriaNormaDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaNormaDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
