import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { Component, OnInit } from '@angular/core';
import Utils from 'src/app/share/_utils/utils';

@Component({
  selector: 'app-nvl100-production-lst',
  templateUrl: './nvl100-production-lst.component.html',
  styleUrls: ['./nvl100-production-lst.component.css']
})
export class Nvl100ProductionLstComponent implements OnInit {

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
