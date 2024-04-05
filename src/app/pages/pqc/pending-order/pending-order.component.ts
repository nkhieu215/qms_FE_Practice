
import { Component, OnInit } from '@angular/core';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { PQCPendingOrder } from 'src/app/share/response/pqcResponse/pqcPendingOrder';

@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.component.html',
  styleUrls: ['./pending-order.component.css']
})
export class PendingProductOrderComponent implements OnInit {

  constructor(private pqcService: PQCService) { }

  ngOnInit(): void {
    this.refreshPage();
  }

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  lstOrderPending : PQCPendingOrder[] = [];

  formSearch: any = {
    name: null,
    code: null,
    lotNumber: null,
    status: null,
  };

  refreshPage(){
    const { name, productCode,lot,woCode } = this.formSearch;
    let dataSearch = {
      typeRequest: "BROWS",
      page: this.page,
      size: this.pageSize,
      name: name,
      productCode: productCode,
      lot: lot,
      woCode: woCode
    }

    this.pqcService.getOrderList(this.page, this.pageSize, name, productCode,  lot, woCode).subscribe(
      data => {
        console.log(data);
        this.lstOrderPending = data.lstProduct;
        this.collectionSize = Number(data?.total);
      },
      err => {

      }
    );
  }

}
