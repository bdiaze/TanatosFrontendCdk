import { TestBed } from '@angular/core/testing';

import { CanActivateRunning } from './can-activate-running';

describe('CanActivateRunning', () => {
  let service: CanActivateRunning;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanActivateRunning);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
