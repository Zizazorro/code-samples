import { TestBed } from '@angular/core/testing';

import { LikeTuneService } from './like-tune.service';

describe('LikeTuneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LikeTuneService = TestBed.get(LikeTuneService);
    expect(service).toBeTruthy();
  });
});
