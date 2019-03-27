import { TestBed } from '@angular/core/testing';

import { BrushMap } from './brush-map.service';

describe('BrushMapFormula', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrushMap = TestBed.get(BrushMap);
    expect(service).toBeTruthy();
  });
});
