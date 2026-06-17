import { TestBed } from '@angular/core/testing';

import { PerfilDao } from './perfil-dao';

describe('PerfilDao', () => {
  let service: PerfilDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
