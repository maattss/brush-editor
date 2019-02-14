import { Component, OnInit } from '@angular/core';
import { BrushService } from '../_services/index';

@Component({
  selector: 'app-brush-info',
  templateUrl: './brush-info.component.html',
  styleUrls: ['./brush-info.component.scss']
})
export class BrushInfoComponent implements OnInit {

  constructor(private data: BrushService) { }

  // Class variables
  private fileComment =  'fileComment';
  private fileName =  'filename';

  ngOnInit() {
    // Subscriptions
    this.data.fileComment.subscribe(fileComment => this.fileComment = fileComment);
    this.data.fileName.subscribe(fileName => this.fileName = fileName);
  }
}
