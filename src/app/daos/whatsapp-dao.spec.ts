import { TestBed } from '@angular/core/testing';

import { WhatsappDao } from './whatsapp-dao';

describe('WhatsappDao', () => {
  let service: WhatsappDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsappDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
