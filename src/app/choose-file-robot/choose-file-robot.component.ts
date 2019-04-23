import { Component, OnInit } from '@angular/core';
import { ChooseFileService } from '../_services/choose-file.service';
import { BrushService, ViewService } from '../_services';
import { Brush } from '../brush';

@Component({
    selector: 'app-choose-file-robot',
    templateUrl: './choose-file-robot.component.html',
    styleUrls: ['./choose-file-robot.component.scss'],
})
export class ChooseFileRobotComponent implements OnInit {
    constructor(
        private fileChooser: ChooseFileService,
        private data: BrushService,
        private view: ViewService
    ) {}

    // Class variables
    private brushes: Brush[];
    private fileName: string;
    private navFiles: string[];
    private navDirectories: string[];
    private navUnknowns: string[];
    private currentUrl: string;
    private currentUrlView: string;
    private showFileChooser: boolean;
    private backEnabled: boolean;

    ngOnInit() {
        // Subscribe
        this.data.currentBrush.subscribe(brushes => (this.brushes = brushes));
        this.data.fileName.subscribe(fileName => (this.fileName = fileName));
        this.fileChooser.files.subscribe(
            navFiles => (this.navFiles = navFiles)
        );
        this.fileChooser.directories.subscribe(
            navDirectories => (this.navDirectories = navDirectories)
        );
        this.fileChooser.unknowns.subscribe(
            navUnknowns => (this.navUnknowns = navUnknowns)
        );
        this.fileChooser.currentUrl.subscribe(currentUrl => {
            this.currentUrl = currentUrl;
            const urlSplitted = currentUrl.split('/');
            this.currentUrlView = 'Home';
            for (let i = 5; i < urlSplitted.length; i++) {
                this.currentUrlView += '/' + decodeURIComponent(urlSplitted[i]);
            }
        });
        this.fileChooser.backEnabled.subscribe(
            backEnabled => (this.backEnabled = backEnabled)
        );
        this.view.showFileChooser.subscribe(
            showFileChooser => (this.showFileChooser = showFileChooser)
        );
    }

    toggleFileChooser() {
        this.view.toggleFileChooserView();
    }

    changeFile(fileName: string) {
        this.data.changeFileName(fileName);
        this.fileChooser.getFile(fileName);
    }

    moveIntoDirectory(dirName: string) {
        this.fileChooser.addToUrl(dirName);
        this.fileChooser.getFSResource();
    }

    back() {
        this.fileChooser.moveBack();
    }

    exportFile() {
        this.fileChooser.exportOpenFile();
    }

    duplicateFile() {
        console.log('Not yet implemented');
    }

    createNewFile() {
        console.log('Not yet implemented');
    }

    createNewFolder() {
        console.log('Not yet implemented');
    }
}
