import { TestBed } from '@angular/core/testing';

import { NegocioStore } from './negocio-store';

describe('NegocioStore', () => {
  let service: NegocioStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NegocioStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
