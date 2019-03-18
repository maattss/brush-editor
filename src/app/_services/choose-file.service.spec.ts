import { TestBed } from '@angular/core/testing';

import { ChooseFileService } from './choose-file.service';

describe('BrushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChooseFileService = TestBed.get(ChooseFileService);
    expect(service).toBeTruthy();
  });
});
