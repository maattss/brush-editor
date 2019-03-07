import { TestBed } from '@angular/core/testing';

import { ChooseFile } from './choose-file.service';

describe('BrushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChooseFile = TestBed.get(ChooseFile);
    expect(service).toBeTruthy();
  });
});
