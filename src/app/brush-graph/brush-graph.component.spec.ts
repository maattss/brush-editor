import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushGraphComponent } from './brush-graph.component';

describe('BrushGraphComponent', () => {
    let component: BrushGraphComponent;
    let fixture: ComponentFixture<BrushGraphComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushGraphComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
