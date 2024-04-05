import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { Component, OnInit } from '@angular/core';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';

@Component({
  selector: 'app-report-produce',
  templateUrl: './report-produce.component.html',
  styleUrls: ['./report-produce.component.css']
})
export class ReportProduceComponent implements OnInit {


  constructor(private pqcService: PQCService,    private tokenStorage: KeycloakService,) {}

  strNameTitle?: string;
  strUrl?: string;

  ngOnInit(): void {
    console.log(this.strUrl);
    this.refreshPage();
  }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder: PQCWorkOrder[] = [];
  show_check =false;
  formSearch: any = {
    name: null,
    code: null,
    lot: null,
    sap:null
  };

  async refreshPage() {
    const { name, code, lot, startDate, endDate, sap, woCode, status ,branchName,groupName} = this.formSearch;
    let search  = {
      name, code, lot, startDate, endDate, sap, woCode, status,branchName,groupName,
      page: this.page,
      size: this.pageSize,
      typeRequest:'SHOW'
    }

   let data = await this.pqcService.reportStoreCheck(search,"VIEW","");
   this.lstWorkOrder = data.lstData;
   this.collectionSize = Number(data?.total) * this.pageSize;
  }

  async exportFile(id:any){
    const { name, code, lot, startDate, endDate, sap, woCode, status } = this.formSearch;
    let search  = {
      name, code, lot, startDate, endDate, sap, woCode, status,
      page: this.page,
      size: this.pageSize,
      typeRequest:'REPORT'
    }

    let fileName = this.tokenStorage.getUsername() + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx"
   let data = await this.pqcService.reportStoreCheck(search,"REPORT",fileName);
  }
}
