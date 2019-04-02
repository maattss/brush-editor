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
  private programArray: string[];
  private materialArray: string[];
  private brushDeviceArray: string[];

  ngOnInit() {
    // Fetch all program and material mapping
    this.fileChooser.fetchAll();

    // Subscribe
    this.fileChooser.brushDevice.subscribe(brushDevice => this.brushDeviceArray = brushDevice);
    this.fileChooser.program.subscribe(program => {
      this.program = program;
      this.updateProgramArray();
    });
    this.fileChooser.material.subscribe(material => {
      this.material = material;
      this.updateMaterialArray();
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
    // Get user selections
    // const brushDevice = (<HTMLInputElement>document.getElementById('brushDeviceSelect')).value;
    const brushDevice = 'A1Brush';
    const material = (<HTMLInputElement>document.getElementById('materialSelect')).value;
    const program = (<HTMLInputElement>document.getElementById('programSelect')).value;

    // Update brush table with file from mapping
    this.fileChooser.getFileFromMapping(program, material, brushDevice);
  }
  loadFileFromNumber() {
    // Get user selections
    // const brushDevice = (<HTMLInputElement>document.getElementById('brushDeviceSelect')).value;
    const brushDevice = 'A1Brush';
    const numb = (<HTMLInputElement>document.getElementById('tableNumberInput')).value;
    // Update brush table with file corresponding to tablenumber
    this.fileChooser.getFileFromNumber(+numb, brushDevice);
  }

  toggleBrushMapping() {
    this.view.toggleBrushMappingView();
  }
}