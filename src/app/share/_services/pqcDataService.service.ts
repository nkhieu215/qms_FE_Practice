import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PqcDataService {
  private wo  = new BehaviorSubject({});
  woData = this.wo.asObservable();
  constructor() { }
  changeWo(wo: any) {
    console.log("change")
    this.wo.next(wo);
  }

  getData(){
    return this.wo;
  }

}
