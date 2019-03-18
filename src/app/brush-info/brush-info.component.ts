import { Component, OnInit } from '@angular/core';
import { BrushService } from '../_services/index';
import { ViewService } from '../_services/view.service';

@Component({
  selector: 'app-brush-info',
  templateUrl: './brush-info.component.html',
  styleUrls: ['./brush-info.component.scss']
})
export class BrushInfoComponent implements OnInit {

  constructor(private data: BrushService, private view: ViewService) { }

  // Class variables
  private fileComment: string;
  private fileName: string;

  // Input validation
  private inputError = false;

  ngOnInit() {
    // Subscriptions
    this.data.fileComment.subscribe(fileComment => this.fileComment = fileComment);
    this.data.fileName.subscribe(fileName => this.fileName = fileName);
  }

  saveFileInfo() {
    const fileNameNew = (<HTMLInputElement>document.getElementById('fileNameInput')).value;
    if (fileNameNew.slice(-3).toLowerCase() === '.bt') {
      this.inputError = false;
      const fileCommentNew = (<HTMLInputElement>document.getElementById('fileCommentInput')).value;
      this.data.changeFileName(fileNameNew);
      this.data.changeFileComment(fileCommentNew);
      this.view.toggleFileInfoView();
      this.view.showInfoSuccess('File info updated successfully!');
    } else {
      this.inputError = true;
    }
  }

  toggleFileInfo() {
    this.view.toggleFileInfoView();
  }
}
