import { TestBed } from '@angular/core/testing';

import { DocumentoAdjuntoDao } from './documento-adjunto-dao';

describe('DocumentoAdjuntoDao', () => {
  let service: DocumentoAdjuntoDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoAdjuntoDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
