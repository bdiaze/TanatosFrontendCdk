import { TestBed } from '@angular/core/testing';

import { MenuHelper } from './menu-helper';

describe('MenuHelper', () => {
  let service: MenuHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
