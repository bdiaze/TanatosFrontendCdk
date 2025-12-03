import { TestBed } from '@angular/core/testing';

import { TipoReceptorNotificacionDao } from './tipo-receptor-notificacion-dao';

describe('TipoReceptorNotificacionDao', () => {
  let service: TipoReceptorNotificacionDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoReceptorNotificacionDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
