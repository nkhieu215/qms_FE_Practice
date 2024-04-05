import { Component, OnInit } from '@angular/core';
import { LineService } from 'src/app/share/_services/line.service';
import { ProductionLine } from 'src/app/share/response/line/production-line';
import { ProductionLineResponse } from 'src/app/share/response/line/production-line-response';

@Component({
  selector: 'app-production-line-list',
  templateUrl: './production-line-list.component.html',
  styleUrls: ['./production-line-list.component.css'],
})
export class ProductionLineListComponent implements OnInit {
  formSearch: any = {};
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  productionLineList: ProductionLine[] = [];
  productionLineRes?: ProductionLineResponse;

  constructor(private lineService: LineService) {
    this.refreshLine();
  }
  refreshLine() {
    const { lineName, lineCode } = this.formSearch;
    this.lineService
      .getAll(this.page, this.pageSize, lineName, lineCode)
      .subscribe((data) => {
        this.productionLineRes = data;
        this.productionLineList = data.lstLine;
        this.lineService.webData = this.productionLineList;
        this.collectionSize =
          Number(this.productionLineRes?.total) * this.pageSize;
      });
  }

  ngOnInit(): void {

  }
  }
