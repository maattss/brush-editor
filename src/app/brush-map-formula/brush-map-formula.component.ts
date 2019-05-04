import { Component, OnInit } from '@angular/core';
import { ViewService, BrushService } from '../_services';
import { ChooseFileService } from '../_services/choose-file.service';
import { Brush } from '../brush';

@Component({
    selector: 'app-brush-map-formula',
    templateUrl: './brush-map-formula.component.html',
    styleUrls: ['./brush-map-formula.component.scss'],
})
export class BrushMapFormulaComponent implements OnInit {
    constructor(
        private view: ViewService,
        private data: BrushService,
        private fileChooser: ChooseFileService
    ) {}

    // Class variables
    private brushes: Brush[];
    private program: Map<number, string>;
    private material: Map<number, string>;
    private option: Map<number, string>;
    private programArray: string[];
    private materialArray: string[];
    private optionArray: string[];
    private formula: string;
    private brushDevice: string;

    ngOnInit() {
        // Fetch all program and material mapping
        this.fileChooser.fetchAll();

        // Subscribe
        this.data.currentBrush.subscribe(brushes => {
            this.brushes = brushes;
        });
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
        this.fileChooser.formula.subscribe(formula => {
            this.formula = formula;
        });
        this.fileChooser.brushDevice.subscribe(brushDevice => {
            this.brushDevice = brushDevice;
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
        // Get user selections
        let material = '0';
        let program = '0';
        let option = '0';
        if (<HTMLInputElement>document.getElementById('materialSelect')) {
            material = (<HTMLInputElement>(
                document.getElementById('materialSelect')
            )).value;
        }
        if (<HTMLInputElement>document.getElementById('programSelect')) {
            program = (<HTMLInputElement>(
                document.getElementById('programSelect')
            )).value;
        }
        if (<HTMLInputElement>document.getElementById('optionSelect')) {
            option = (<HTMLInputElement>document.getElementById('optionSelect'))
                .value;
        }

        // Update brush table with file from mapping
        this.fileChooser.getFileFromMapping(program, material, option);

        // Show success message if file is valid
        // if (this.brushes.length > 0) {
        //     this.view.showInfoSuccess('File loaded successfully!');
        // }
    }
    loadFileFromNumber() {
        // Get user selection
        const num = (<HTMLInputElement>(
            document.getElementById('tableNumberInput')
        )).value;

        // Update brush table with file corresponding to tablenumber
        this.fileChooser.getFileFromNumber(+num);
    }

    toggleBrushMapping() {
        this.view.toggleBrushMappingView();
    }
}
