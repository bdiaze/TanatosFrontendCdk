import { TestBed } from '@angular/core/testing';

import { VideoTutorialDao } from './video-tutorial-dao';

describe('VideoTutorialDao', () => {
  let service: VideoTutorialDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoTutorialDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
