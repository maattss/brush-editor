import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { Brush } from './brush';

@Injectable({
  providedIn: 'root'
})
export class BrushService {
  private brushSource  = new BehaviorSubject<Array<Brush>>([]);
  currentBrush = this.brushSource.asObservable();

  constructor() { }

  changeBrush(brushes: Brush[]) {
    this.brushSource.next(brushes);
  }
}
