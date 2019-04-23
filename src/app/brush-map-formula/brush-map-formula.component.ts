import { Component, OnInit } from '@angular/core';
import { ViewService } from '../_services';
import { ChooseFileService } from '../_services/choose-file.service';

@Component({
  selector: 'app-brush-map-formula',
  templateUrl: './brush-map-formula.component.html',
  styleUrls: ['./brush-map-formula.component.scss']
})
export class BrushMapFormulaComponent implements OnInit {

  constructor(
    private view: ViewService,
    private fileChooser: ChooseFileService) { }

  // Class variables
  private program: Map<number, string>;
  private material: Map<number, string>;
  private option: Map<number, string>;
  private programArray: string[];
  private materialArray: string[];
  private optionArray: string[];

  ngOnInit() {
    // Fetch all program and material mapping
    this.fileChooser.fetchAll();

    // Subscribe
    this.fileChooser.option.subscribe(option => {
      this.option = option;
      this.updateOptionArray();
    });
    this.fileChooser.program.subscribe(program => {
      this.program = program;
      this.updateProgramArray();
    });
    this.fileChooser.material.subscribe(material => {
      this.material = material;
      this.updateMaterialArray();
    });
  }

  updateOptionArray() {
    this.optionArray = [];
    this.option.forEach((name: string, num: number) => {
      this.optionArray.push(name);
    });
  }

  updateProgramArray() {
    this.programArray = [];
    this.program.forEach((name: string, num: number) => {
      this.programArray.push(name);
    });
  }

  updateMaterialArray() {
    this.materialArray = [];
    this.material.forEach((name: string, num: number) => {
      this.materialArray.push(name);
    });
  }

  loadFile() {
    // Fetch brush device and formula from API. Preferrably do this in choose-file-service
    const brushDevice = 'A1Brush';
    const formula = 'P*100+M';

    // Get user selections
    const material = (<HTMLInputElement>document.getElementById('materialSelect')).value;
    const program = (<HTMLInputElement>document.getElementById('programSelect')).value;
    const option = (<HTMLInputElement>document.getElementById('optionSelect')).value;

    // Update brush table with file from mapping
    this.fileChooser.getFileFromMapping(program, material, option);
  }
  loadFileFromNumber() {
    // Get user selection
    const num = (<HTMLInputElement>document.getElementById('tableNumberInput')).value;

    // Update brush table with file corresponding to tablenumber
    this.fileChooser.getFileFromNumber(+num);
  }

  toggleBrushMapping() {
    this.view.toggleBrushMappingView();
  }
}
