import { TestBed } from '@angular/core/testing';

import { EmpleadoDao } from './empleado-dao';

describe('EmpleadoDao', () => {
  let service: EmpleadoDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpleadoDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
