import { TestBed } from '@angular/core/testing';

import { EvaluacionDao } from './evaluacion-dao';

describe('EvaluacionDao', () => {
  let service: EvaluacionDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluacionDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
