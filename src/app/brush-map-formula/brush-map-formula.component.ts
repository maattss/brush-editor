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

}
