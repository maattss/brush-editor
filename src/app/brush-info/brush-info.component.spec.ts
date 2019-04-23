import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushInfoComponent } from './brush-info.component';

describe('BrushInfoComponent', () => {
    let component: BrushInfoComponent;
    let fixture: ComponentFixture<BrushInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushInfoComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
