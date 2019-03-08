import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';
import { BrushService, ViewService } from '../_services/index';
import { saveAs } from 'file-saver';
import { ChooseFileService } from '../_services/choose-file.service';

declare const digestAuthRequest: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private data: BrushService, private view: ViewService, private fileChooser: ChooseFileService) { }

  // Class variables
  private brushes: Brush[];
  private file: any;
  private fileComment: string;
  private fileName: string;

  ngOnInit() {
    // Subscribe
    this.data.currentBrush.subscribe(brushes => this.brushes = brushes);
    this.data.fileComment.subscribe(fileComment => this.fileComment = fileComment);
    this.data.fileName.subscribe(fileName => this.fileName = fileName);
  }

  toggleFileInfo() {
    this.view.toggleFileInfoView();
  }

  toggleSettings() {
    this.view.toggleSettingsView();
  }

  fileChanged(event: any) { // Triggers when file input changes
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
    const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    if (this.fileName !== '') {
      saveAs(blob, this.fileName);
    } else {
      saveAs(blob, 'default.bt');
    }
  }

  openFileChooser() {
    this.fileChooser.httpGetWithDigest();
    this.view.toggleFileChooserView();
  }
}
