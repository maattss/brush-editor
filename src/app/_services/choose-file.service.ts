import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BrushService } from './brush.service';
import { ViewService } from './view.service';
import * as math from 'mathjs';

declare const digestAuthRequest: any;

@Injectable({
    providedIn: 'root',
})
export class ChooseFileService {
    private fileSrc = new BehaviorSubject<Array<string>>([]);
    private directorySrc = new BehaviorSubject<Array<string>>([]);
    private unknownSrc = new BehaviorSubject<Array<string>>([]);
    private optionSrc = new BehaviorSubject<Map<number, string>>(new Map());
    private programSrc = new BehaviorSubject<Map<number, string>>(new Map());
    private materialSrc = new BehaviorSubject<Map<number, string>>(new Map());
    private backEnabledSrc = new BehaviorSubject<boolean>(false);

    // Http request values
    private currentUrlSrc = new BehaviorSubject<string>(
        'http://127.0.0.1/fileservice/$HOME/'
    );
    private homeUrlSrc = new BehaviorSubject<string>(
        'http://127.0.0.1/fileservice/$HOME/'
    );
    private userName = 'Default User'; // Default username, do NOt use this in production
    private password = 'robotics'; // Default password, do NOT use this in production

    // Brush mapping values
    private formulaSrc = new BehaviorSubject<string>('');
    private brushDeviceSrc = new BehaviorSubject<string>('');

    files = this.fileSrc.asObservable();
    directories = this.directorySrc.asObservable();
    unknowns = this.unknownSrc.asObservable();
    currentUrl = this.currentUrlSrc.asObservable();
    backEnabled = this.backEnabledSrc.asObservable();
    option = this.optionSrc.asObservable();
    program = this.programSrc.asObservable();
    material = this.materialSrc.asObservable();
    formula = this.formulaSrc.asObservable();
    brushDevice = this.brushDeviceSrc.asObservable();

    constructor(private view: ViewService, private data: BrushService) {}

    changeFiles(files: string[]) {
        this.fileSrc.next(files);
    }
    changeDirectories(directories: string[]) {
        this.directorySrc.next(directories);
    }
    changeUnknowns(unknowns: string[]) {
        this.unknownSrc.next(unknowns);
    }
    changeCurrentUrl(url: string) {
        this.currentUrlSrc.next(url);
    }
    changeHomeUrl(url: string) {
        this.homeUrlSrc.next(url);
    }
    addToUrl(url: string) {
        this.changeCurrentUrl(this.currentUrlSrc.value + encodeURI(url) + '/');
        this.backEnabledSrc.next(true);
    }
    moveBack() {
        const urlSplitted = this.currentUrlSrc.value.split('/');

        if (urlSplitted[urlSplitted.length - 2] !== '$home') {
            let newUrl = '';
            let newFolder = '';
            for (let i = 0; i < urlSplitted.length - 2; i++) {
                newUrl += urlSplitted[i] + '/';
                newFolder = urlSplitted[i];
            }

            if (newFolder.toLowerCase() === '$home') {
                this.backEnabledSrc.next(false);
            }

            this.changeCurrentUrl(newUrl);
            this.getFSResource();
        }
    }

    getFSResource() {
        this.getFSResourceUrl(this.currentUrlSrc.value);
    }

    getFSResourceUrl(url: string) {
        const digest = new digestAuthRequest(
            'GET',
            this.currentUrlSrc.value + '?json=1',
            this.userName,
            this.password
        );
        digest.request(
            (response: any) => {
                this.parseFSResponse(response);
            },
            function(errorCode: any) {
                console.log('Error: ', errorCode);
            }
        );
    }

    parseFSResponse(response: any) {
        const fileInfoArray = response._embedded._state;
        const fsFiles: string[] = []; // File names
        const fsDirs: string[] = []; // Directories
        const fsUnknowns: string[] = [];
        for (let i = 0; i < fileInfoArray.length; i++) {
            const element = fileInfoArray[i];
            const name = element._title;
            const ext = name.substr(name.length - 3).toLowerCase();

            if (element._type === 'fs-file' && ext === '.bt') {
                // File only accepted if type is file and extension is .bt
                fsFiles.push(name);
            } else if (element._type === 'fs-dir') {
                fsDirs.push(name);
            } else {
                fsUnknowns.push(name);
            }
        }

        // Sort and update
        fsFiles.sort();
        this.changeFiles(fsFiles);
        fsDirs.sort();
        this.changeDirectories(fsDirs);
        fsUnknowns.sort();
        this.changeUnknowns(fsUnknowns);
    }

    // Download and parse brush file from Robot Web Service API
    getFile(fileName: string) {
        const digest = new digestAuthRequest(
            'GET',
            this.currentUrlSrc.value + encodeURI(fileName),
            this.userName,
            this.password
        );
        digest.request(
            (response: any) => {
                this.data.parseFile(response.toString());
                console.log('Response: ', response.toString());
                console.log('GET response', response);
            },
            function(errorCode: any) {
                console.log('Error: ', errorCode);
            }
        );
    }

    exportOpenFile() {
        this.postFile(); // Export file
        this.getFSResource(); // get updated view for the file explorer
    }

    postFile() {
        const fileName = this.data.getFileName();
        const postData = this.data.getExportableString();
        this.view.showInfoSuccess('File exported successfully!');

        const digest = new digestAuthRequest(
            'PUT',
            this.currentUrlSrc.value + fileName,
            this.userName,
            this.password
        );
        digest.request(
            (response: any) => {
                // Response handling not needed
            },
            (errorCode: any) => {
                console.log('Error: ', errorCode);
                this.view.showInfoError(
                    'There was a problem with the file export. Check your connection.'
                );
            },
            postData
        );
    }

    fetchAll() {
        this.fetchOptions();
        this.fetchPrograms();
        this.fetchMaterials();
        this.fetchFormula();
        this.fetchBrushDevice();
    }

    fetchOptions() {
        const digest = new digestAuthRequest(
            'GET',
            this.homeUrlSrc.value + 'alias/option.map?json=1',
            this.userName,
            this.password
        );
        digest.request(
            (response: any) => {
                const option = response.split('\n');
                for (let i = 0; i < option.length; i++) {
                    const id = option[i].split(',')[0];
                    const name = option[i].split(',')[1];
                    if (name !== '' && name !== undefined) {
                        const mapCopy = this.optionSrc.value;
                        mapCopy.set(id, name);
                        this.optionSrc.next(mapCopy);
                    }
                }
            },
            function(errorCode: any) {
                console.log('Error: ', errorCode);
            }
        );
    }

    fetchPrograms() {
        const digest = new digestAuthRequest(
            'GET',
            this.homeUrlSrc.value + 'alias/program.map?json=1',
            this.userName,
            this.password
        );
        digest.request(
            (response: any) => {
                const program = response.split('\n');
                for (let i = 0; i < program.length; i++) {
                    const id = program[i].split(',')[0];
                    const name = program[i].split(',')[1];
                    const mapCopy = this.programSrc.value;
                    mapCopy.set(id, name);
                    if (name !== '') {
                        this.programSrc.next(mapCopy);
                    }
                }
            },
            function(errorCode: any) {
                console.log('Error: ', errorCode);
            }
        );
    }

    fetchMaterials() {
        const digest = new digestAuthRequest(
            'GET',
            this.homeUrlSrc.value + 'alias/material.map?json=1',
            this.userName,
            this.password
        );
        digest.request(
            (response: any) => {
                const material = response.split('\n');
                for (let i = 0; i < material.length; i++) {
                    const id = material[i].split(',')[0];
                    const name = material[i].split(',')[1];
                    const mapCopy = this.materialSrc.value;
                    mapCopy.set(id, name);
                    if (name !== '') {
                        this.materialSrc.next(mapCopy);
                    }
                }
            },
            function(errorCode: any) {
                console.log('Error: ', errorCode);
            }
        );
    }

    private fetchBrushDevice() {
        let brushDevice = '';
        // Fetch Brush Device from Robot Web Service
        // Todo: Fix implementation below
        // const digest = new digestAuthRequest('GET', this.homeUrlSrc.value + this.brushDeviceSrc.value + '/' + fileName + '?json=1',
        //   this.userName, this.password);
        // digest.request((response: any) => {
        //   this.data.parseFile(response.toString());
        //   this.data.changeFileName(fileName);
        //   // Close brush mapping window
        //   this.view.toggleBrushMappingView();
        // }, (errorCode: any) => {
        //   console.log('Error:', errorCode);
        //   if (errorCode === '404') {
        //     this.data.parseFile('');
        //   }
        // });

        if (brushDevice === '') {
            this.brushDeviceSrc.next('A1Brush'); // Default value
        } else {
            this.brushDeviceSrc.next(brushDevice);
        }
    }

    private fetchFormula() {
        let formula = '';
        // Fetch formula from Robot Web Service
        // Todo: Fix implementation below
        // const digest = new digestAuthRequest('GET', this.homeUrlSrc.value + this.brushDeviceSrc.value + '/' + fileName + '?json=1',
        //   this.userName, this.password);
        // digest.request((response: any) => {
        //   this.data.parseFile(response.toString());
        //   this.data.changeFileName(fileName);
        //   // Close brush mapping window
        //   this.view.toggleBrushMappingView();
        // }, (errorCode: any) => {
        //   console.log('Error:', errorCode);
        //   if (errorCode === '404') {
        //     this.data.parseFile('');
        //   }
        // });

        if (formula === '') {
            this.formulaSrc.next('P*100+M'); // Default value
        } else {
            this.formulaSrc.next(formula);
        }
    }

    private getFileName(program: string, material: string) {
        this.fetchFormula();

        // Provide scope
        const scope = {
            P: 0,
            M: 0,
            O: 0,
        };

        // Loop through program map and find correct program number
        this.programSrc.value.forEach((name: string, num: number) => {
            if (name === program) {
                scope.P = num;
            }
        });

        // Loop through material map and find correct material number
        this.materialSrc.value.forEach((name: string, num: number) => {
            if (name === material) {
                scope.M = num;
            }
        });

        // Loop through option map and find correct option number
        this.optionSrc.value.forEach((name: string, num: number) => {
            if (name === material) {
                scope.O = num;
            }
        });

        // Evaluate expression wiht chosen variables to find correct file
        const calc = math.eval(this.formulaSrc.value, scope);
        console.log('Loading file: Table' + calc + '.bt');
        return 'Table' + calc + '.bt';
    }

    getFileFromMapping(program: string, material: string, option: string) {
        this.fetchBrushDevice();

        const fileName = this.getFileName(program, material);
        const digest = new digestAuthRequest(
            'GET',
            this.homeUrlSrc.value +
                this.brushDeviceSrc.value +
                '/' +
                fileName +
                '?json=1',
            this.userName,
            this.password
        );
        digest.request(
            (response: any) => {
                this.data.parseFile(response.toString());
                this.data.changeFileName(fileName);
                // Close brush mapping window
                // this.view.toggleBrushMappingView();
            },
            (errorCode: any) => {
                console.log('Error:', errorCode);
                if (errorCode === '404') {
                    this.data.parseFile('');
                }
            }
        );
    }

    getFileFromNumber(numb: number) {
        this.fetchBrushDevice();

        const digest = new digestAuthRequest(
            'GET',
            this.homeUrlSrc.value +
                this.brushDeviceSrc.value +
                '/Table' +
                numb +
                '.bt?json=1',
            this.userName,
            this.password
        );
        digest.request(
            (response: any) => {
                this.data.parseFile(response.toString());
                this.data.changeFileName('Table' + numb + '.bt');
                // Show success message and close brush mapping window
                this.view.showInfoSuccess('File loaded successfully!');
            },
            (errorCode: any) => {
                console.log('Error:', errorCode);
                if (errorCode === '404') {
                    this.data.parseFile('');
                }
            }
        );
    }
}
