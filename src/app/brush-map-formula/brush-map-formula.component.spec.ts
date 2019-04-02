import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushMapFormulaComponent } from './brush-map-formula.component';

describe('BrushMapFormulaComponent', () => {
  let component: BrushMapFormulaComponent;
  let fixture: ComponentFixture<BrushMapFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushMapFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushMapFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
