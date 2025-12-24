import { TestBed } from '@angular/core/testing';

import { InscripcionTemplateDao } from './inscripcion-template-dao';

describe('InscripcionTemplateDao', () => {
  let service: InscripcionTemplateDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscripcionTemplateDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
