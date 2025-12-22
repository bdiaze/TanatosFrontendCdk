import { TestBed } from '@angular/core/testing';

import { RouterListener } from './router-listener';

describe('RouterListener', () => {
  let service: RouterListener;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterListener);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
