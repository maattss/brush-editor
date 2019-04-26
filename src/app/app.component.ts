import { Component, OnInit } from '@angular/core';
import { Brush } from './brush';
import { BrushService, ViewService } from './_services/index';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private data: BrushService, private view: ViewService) {}

    // Class variables
    private brushes: Brush[];
    private showFileInfo: boolean;
    private showFileChooser: boolean;
    private showSettings: boolean;
    private showSuccess: boolean;
    private showError: boolean;
    private showBrushMapping: boolean;

    ngOnInit() {
        // Subscribe
        this.data.currentBrush.subscribe(brushes => (this.brushes = brushes));
        this.view.showFileInfo.subscribe(
            showFileInfo => (this.showFileInfo = showFileInfo)
        );
        this.view.showFileChooser.subscribe(
            showFileChooser => (this.showFileChooser = showFileChooser)
        );
        this.view.showBrushMapping.subscribe(
            showBrushMapping => (this.showBrushMapping = showBrushMapping)
        );
        this.view.showSettings.subscribe(
            showSettings => (this.showSettings = showSettings)
        );
        this.view.showSuccess.subscribe(
            showSuccess => (this.showSuccess = showSuccess)
        );
        this.view.showError.subscribe(
            showError => (this.showError = showError)
        );
    }
}
