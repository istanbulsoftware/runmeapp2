import { TestBed } from '@angular/core/testing';

import { GlossifyService } from './glossify.service';

describe('GlossifyService', () => {
  let service: GlossifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlossifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
