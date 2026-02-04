import { TestBed } from '@angular/core/testing';

import { XhrHttpClient } from './xhr-http-client';

describe('XhrHttpClient', () => {
  let service: XhrHttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XhrHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
