import { TestBed } from '@angular/core/testing';

import { TuneInService } from './tune-in.service';

describe('TuneInService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TuneInService = TestBed.get(TuneInService);
    expect(service).toBeTruthy();
  });
});
