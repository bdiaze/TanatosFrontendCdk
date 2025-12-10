import { TestBed } from '@angular/core/testing';

import { DestinatarioNotificacionDao } from './destinatario-notificacion-dao';

describe('DestinatarioNotificacionDao', () => {
  let service: DestinatarioNotificacionDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestinatarioNotificacionDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
