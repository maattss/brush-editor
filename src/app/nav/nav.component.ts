import { Component, OnInit } from '@angular/core';
import { Brush, ChannelMaxValues, ChannelNames } from '../brush';
import { BrushService, ViewService } from '../_services/index';
import { saveAs } from 'file-saver';
import { ChooseFileService } from '../_services/choose-file.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    constructor(
        private data: BrushService,
        private view: ViewService,
        private fileChooser: ChooseFileService
    ) {}

    // Class variables
    private brushes: Brush[];
    private channelMaxValues: ChannelMaxValues;
    private channelNames: ChannelNames;
    private file: any;
    private fileComment: string;
    private fileName: string;

    ngOnInit() {
        // Subscribe
        this.data.currentBrush.subscribe(brushes => (this.brushes = brushes));
        this.data.channelMaxValues.subscribe(
            channelMaxValues => (this.channelMaxValues = channelMaxValues)
        );
        this.data.channelNames.subscribe(
            channelNames => (this.channelNames = channelNames)
        );
        this.data.fileComment.subscribe(
            fileComment => (this.fileComment = fileComment)
        );
        this.data.fileName.subscribe(fileName => (this.fileName = fileName));
    }

    showDecisionBoxIfNeeded() {
        loop: for (let brushId = 1; brushId <= this.brushes.length; brushId++) {
            const brush = this.brushes[brushId - 1];
            for (const channel in brush) {
                // Loops through channel names in current brush object
                if (brush[channel] > this.channelMaxValues[channel]) {
                    document.getElementById('userDecision').hidden = false;
                    break loop;
                }
            }
        }
    }

    adjustChannelsToMaxvalue() {
        for (let brushId = 1; brushId <= this.brushes.length; brushId++) {
            const brush = this.brushes[brushId - 1];
            for (const channel in brush) {
                // Loops through channel names in current brush object
                if (brush[channel] > this.channelMaxValues[channel]) {
                    brush[channel] = this.channelMaxValues[channel];
                }
            }
        }
        this.data.changeBrush(this.brushes);
        this.hideConfirmation();
        this.view.showInfoSuccess('You successfully updated the table!');
    }

    hideConfirmation() {
        document.getElementById('userDecision').hidden = true;
    }

    toggleFileInfo() {
        this.view.toggleFileInfoView();
    }

    toggleBrushMapping() {
        this.view.toggleBrushMappingView();
    }

    toggleSettings() {
        this.hideConfirmation();
        this.view.toggleSettingsView();
    }

    fileChanged(event: any) {
        // Triggers when file input changes
        this.file = event.target.files[0];

        // Updates file name if new file is read
        if (this.file) {
            this.data.changeFileName(this.file.name);
        }

        // File reader
        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.data.parseFile(fileReader.result.toString());
            this.data.changeCurrentBrushID(0);
            this.showDecisionBoxIfNeeded();
        };

        // Prevents error in console when canceling file upload
        try {
            fileReader.readAsText(this.file);
        } catch (error) {
            return;
        }
    }

    saveFileAs() {
        const text = this.data.getExportableString();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        if (this.fileName !== '') {
            saveAs(blob, this.fileName);
        } else {
            saveAs(blob, 'default.bt');
        }
    }

    openFileChooser() {
        this.fileChooser.getFSResource();
        this.view.toggleFileChooserView();
    }
}
