import { TestBed } from '@angular/core/testing';

import { PlanDao } from './plan-dao';

describe('PlanDao', () => {
  let service: PlanDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
