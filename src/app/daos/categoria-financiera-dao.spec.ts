import { TestBed } from '@angular/core/testing';

import { CategoriaFinancieraDao } from './categoria-financiera-dao';

describe('CategoriaFinancieraDao', () => {
  let service: CategoriaFinancieraDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaFinancieraDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
