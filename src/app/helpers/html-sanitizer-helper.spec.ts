import { TestBed } from '@angular/core/testing';

import { HtmlSanitizerHelper } from './html-sanitizer-helper';

describe('HtmlSanitizerHelper', () => {
  let service: HtmlSanitizerHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlSanitizerHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
