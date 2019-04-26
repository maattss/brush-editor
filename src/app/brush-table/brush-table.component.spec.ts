import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushTableComponent } from './brush-table.component';

describe('BrushTableComponent', () => {
    let component: BrushTableComponent;
    let fixture: ComponentFixture<BrushTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushTableComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
