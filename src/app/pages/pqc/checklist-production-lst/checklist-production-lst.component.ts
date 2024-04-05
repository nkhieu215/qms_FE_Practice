import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { Component, OnInit } from '@angular/core';
import { PQCService } from 'src/app/share/_services/pqc.service';
import Utils from 'src/app/share/_utils/utils';
import { PQCPEndingOrderResponse } from 'src/app/share/response/pqcResponse/pqcPendingOrderResponse';

@Component({
  selector: 'app-checklist-production-lst',
  templateUrl: './checklist-production-lst.component.html',
  styleUrls: ['./checklist-production-lst.component.css']
})
export class ChecklistProductionLstComponent implements OnInit {

  constructor(private pqcService: PQCService) { }

  ngOnInit(): void {
    this.refreshPage();
  }
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  lstWorkOrder?: PQCWorkOrder[] = [];


  formSearch: any = {
    name: null,
    code: null
  };

  refreshPage() {
    const { name, code, lot,startDate, endDate,sap, woCode, status } = this.formSearch;
    this.pqcService.getListByStep(this.page, this.pageSize, name, code,lot,"CREATE",startDate, endDate,sap,woCode,status,'','').subscribe(
      data => {
        var productionLst = new PQCPEndingOrderResponse();
        productionLst = data;
        this.lstWorkOrder = productionLst.lstOrder;

        this.lstWorkOrder?.forEach((element) => {

          element.strStatus = Utils.getStatusName(element.status);
        });

        this.collectionSize = Number(productionLst?.total) * this.pageSize;
      },
      err => {

      }
    );
  }

}
