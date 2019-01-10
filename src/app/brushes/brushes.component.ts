import { Component, OnInit } from '@angular/core';
import { Brush } from '../brush';

@Component({
  selector: 'app-brushes',
  templateUrl: './brushes.component.html',
  styleUrls: ['./brushes.component.css']
})
export class BrushesComponent implements OnInit { 

  text: string | ArrayBuffer;

  
  readFile(): void {
    let reader=new FileReader();
    reader.onload = (e) => {
       this.text=reader.result;
    }
    reader.readAsText(new File([""],'../../static/brush-files/bdtest.bt'));   
  }

  // TODO: Read and parse file. Create brush object
  brushes: Brush[] = [
    { 
      brushId: 1,
      ch1: 10,
      ch2: 20,
      ch3: 30,
      ch4: 40,
      ch5: 50,
      desc: "Tak"
    },
    {
      brushId: 2,
      ch1: 100,
      ch2: 200,
      ch3: 300,
      ch4: 400,
      ch5: 500,
      desc: "Bak"
    }
  ];

  constructor() { }

  ngOnInit() {
    let text: string; 
    let reader=new FileReader();
    reader.onload = (e) => {
      this.text=reader.result;
      console.log(reader.result);
    }
    reader.readAsText(new File([""],'test.txt')); //'../../static/brush-files/bdtest.bt'
    console.log(reader.result);

  }

}

/*
function read() {
  //let brushes: Brush[]
  let result: string;

  let reader = new FileReader();
  reader.onload = (e) => {
    this.result = reader.result;
  }

  this.result = reader.readAsText(new File([""],'../../static/brush-files/bdtest.bt'));
  console.log(this.result);
  
  //return result
}*/
