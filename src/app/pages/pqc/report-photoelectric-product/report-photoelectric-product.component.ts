import { formatDate } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-photoelectric-product',
  templateUrl: './report-photoelectric-product.component.html',
  styleUrls: ['./report-photoelectric-product.component.css']
})
export class ReportPhotoelectricProductComponent implements OnInit {


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
  lstWorkOrder:any [] = [];
  show_check =false;
  formSearch: any = {
    name: null,
    code: null,
    lot: null,
    sap:null
  };

  async refreshPage() {
    const { name, code, grErr, startDate, endDate, err, woCode } = this.formSearch;
    let search  = {
      name, code, grErr, startDate, endDate, err, woCode,
      page: this.page,
      size: this.pageSize,
      typeRequest:'SHOW'
    }

   let data = await this.pqcService.reportErrCheck(search,"VIEW","");
   this.lstWorkOrder = data.reportError;
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
    let data = await this.pqcService.reportErrCheck(search,"REPORT",fileName);
  }

}
