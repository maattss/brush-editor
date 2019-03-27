import { Component, OnInit } from '@angular/core';
import { ViewService } from '../_services';

@Component({
  selector: 'app-brush-map-formula',
  templateUrl: './brush-map-formula.component.html',
  styleUrls: ['./brush-map-formula.component.scss']
})
export class BrushMapFormulaComponent implements OnInit {

  constructor(private view: ViewService) { }

  ngOnInit() {
  }

  // TODO:
  // Scan program.map and output to select list
  // Scan material.map and output to select list
  // Button on click calculate tablename and show file
  // Need to extend choose-file.service to be able to read and store program and material

}
