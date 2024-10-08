import { Component, OnInit } from '@angular/core';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';

@Component({
  selector: 'app-tem-in-lst',
  templateUrl: './tem-in-lst.component.html',
  styleUrls: ['./tem-in-lst.component.css']
})
export class TemInLstComponent implements OnInit {
  constructor(private pqcService: PQCService) { }
  ngOnInit(): void {
  }
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  lstWorkOrder?: PQCWorkOrder[] = [];


  formSearch: any = {
    name: null,
    code: null,
    lot: null
  };
}
