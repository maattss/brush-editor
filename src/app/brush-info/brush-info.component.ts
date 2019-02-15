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
  private showFileInfo: boolean;

  ngOnInit() {
    // Subscriptions
    this.data.fileComment.subscribe(fileComment => this.fileComment = fileComment);
    this.data.fileName.subscribe(fileName => this.fileName = fileName);
    this.view.showFileInfo.subscribe(showFileInfo => this.showFileInfo = showFileInfo);
  }
  saveFileInfo() {
    // TODO: Add ability to change filecomment and filename
    this.toggleFileInfo();
  }

  toggleFileInfo() {
    this.view.toggleFileInfoView();
  }
}
