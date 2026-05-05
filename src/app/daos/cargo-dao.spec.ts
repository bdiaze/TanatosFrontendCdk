import { TestBed } from '@angular/core/testing';

import { CargoDao } from './cargo-dao';

describe('CargoDao', () => {
  let service: CargoDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargoDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
