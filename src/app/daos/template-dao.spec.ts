import { TestBed } from '@angular/core/testing';

import { TemplateDao } from './template-dao';

describe('TemplateDao', () => {
  let service: TemplateDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
