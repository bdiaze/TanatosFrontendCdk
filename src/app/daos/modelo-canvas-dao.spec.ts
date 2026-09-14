import { TestBed } from '@angular/core/testing';

import { ModeloCanvasDao } from './modelo-canvas-dao';

describe('ModeloCanvasDao', () => {
  let service: ModeloCanvasDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeloCanvasDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
