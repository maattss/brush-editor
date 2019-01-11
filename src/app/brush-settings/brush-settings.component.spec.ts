import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushSettingsComponent } from './brush-settings.component';

describe('BrushSettingsComponent', () => {
  let component: BrushSettingsComponent;
  let fixture: ComponentFixture<BrushSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
