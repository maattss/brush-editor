import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseFileRobotComponent } from './choose-file-robot.component';

describe('ChooseFileRobotComponent', () => {
    let component: ChooseFileRobotComponent;
    let fixture: ComponentFixture<ChooseFileRobotComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChooseFileRobotComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChooseFileRobotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
