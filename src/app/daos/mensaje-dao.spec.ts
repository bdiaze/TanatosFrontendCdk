import { TestBed } from '@angular/core/testing';

import { MensajeDao } from './mensaje-dao';

describe('MensajeDao', () => {
  let service: MensajeDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajeDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
