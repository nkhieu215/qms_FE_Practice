
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PQCService } from 'src/app/share/_services/pqc.service';
import Utils from 'src/app/share/_utils/utils';
import { PQCPEndingOrderResponse } from 'src/app/share/response/pqcResponse/pqcPendingOrderResponse';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';

@Component({
  selector: 'app-pqc-show-list',
  templateUrl: './pqc-show-list.component.html',
  styleUrls: ['./pqc-show-list.component.css'],
})
export class PqcShowListComponent implements OnInit {
  @Input() item_type = '';

  constructor(private pqcService: PQCService) { }

  strNameTitle?: string;
  strUrl?: string;

  ngOnInit(): void {
    console.log(this.item_type);
    console.log(this.strUrl);
    switch (this.item_type) {
      case 'TIN':
        this.strNameTitle = 'Kiểm tra in kem thiếc';
        this.strUrl = 'pqc/pqc-tin-check';
        break;

      case 'NVL':
        this.strNameTitle = 'Kiểm tra nguyên vật liệu';
        this.strUrl = 'pqc/check-nvl';
        break;

      case 'CHECK_NVL':
        this.strNameTitle = 'Kiểm tra 100% nguyên vật liệu';
        this.strUrl = 'pqc/check-nvl-100';
        break;
      case 'MOUNT_COMPONENTS':
        this.strNameTitle = 'Gắn linh kiện';
        this.strUrl = 'pqc/mount-comp-check';
        break;
      case 'SOLDER':
        this.strNameTitle = 'Kiểm tra lò hàn';
        this.strUrl = 'pqc/pqc-solder-check';
        break;
      case 'INTERCHANGEABILITY':
        this.strNameTitle = 'Kiểm tra lắp lẫn';
        this.strUrl = 'pqc/pqc-interchangeability-check';
        break;

      case 'ASSEMBLES':
        this.strNameTitle = 'Kiểm tra quá trình lắp ráp SP';
        this.strUrl = 'pqc/pqc-assembles-check';
        break;
      case 'PHOTOELECTRIC':
        this.strNameTitle = 'Kiểm tra thông số quang điện cho SP';
        this.strUrl = 'pqc/photoelectric';
        break;
      case 'PHOTOELECTRIC_PRODUCT':
        this.strNameTitle = 'Kiểm tra thông số quang điện cho BTP';
        this.strUrl = 'pqc/photoelectric-product';
        break;
      case 'FIX_ERR':
        this.strNameTitle = 'Kiểm tra lỗi sửa lại';
        this.strUrl = 'pqc/fix-error';
        break;

      case 'STORE_CHECK':
        this.strNameTitle = 'Kiểm tra chi tiết nhập kho sx';
        this.strUrl = 'pqc/pqc-store-check';
        break;
      case 'QC_CHECK':
        this.strNameTitle = 'Mẫu đánh giá chất lượng sp';
        this.strUrl = 'pqc/pqc-qc-check';
        break;
      case 'APPROVE_STORE':
        this.strNameTitle = 'Duyệt nhập kho';
        this.strUrl = 'pqc/pqc-tin-check';
        break;
      case 'MAKE_ORDER':
        this.strNameTitle = 'Danh sách lệnh sản xuất';
        this.strUrl = 'pqc/make-order-production';
        break;
      case 'SAP_STORE':
        this.strNameTitle = 'Khai báo nhập kho SAP';
        this.strUrl = 'pqc/store/approve-store-sap';
        break;
      case 'PRINT_SERIAL':
        this.strNameTitle = 'Quản lý tem sản xuất';
        this.strUrl = 'pqc/tem-in/print';
        break;
    }
    this.refreshPage();
  }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder: PQCWorkOrder[] = [];
  show_check = false;
  formSearch: any = {
    name: null,
    code: null,
    lot: null,
    sap: null
  };

  refreshPage() {
    const { name, code, lot, startDate, endDate, sap, woCode, status, branchName, groupName, workOrderCode } = this.formSearch;
    if (this.item_type == 'CHECK_NVL') {
      let strStatus = '';
      if (status == 'WAIT') {
        strStatus = 'CREATE';
      }
      else if (status == 'SUCCESS') {
        strStatus = 'APPROVE';
      } else {
        strStatus = status;
      }

      this.show_check = true;
      this.pqcService
        .getListByStep(this.page, this.pageSize, name, code, lot, "CHECK_NVL", startDate, endDate, sap, woCode, strStatus, branchName, groupName, workOrderCode)
        .subscribe(
          (data) => {
            var productionLst = new PQCPEndingOrderResponse();
            productionLst = data;
            this.lstWorkOrder = data.lstOrder;
            this.lstWorkOrder?.forEach((element) => {
              element.strStatus = Utils.getStatusName(element.status);
            });
            this.collectionSize = Number(productionLst?.total) * this.pageSize;
          },
          (err) => { }
        );
    } else {
      this.pqcService
        .getListByStep(this.page, this.pageSize, name, code, lot, this.item_type, startDate, endDate, sap, woCode, status, branchName, groupName, workOrderCode)
        .subscribe(
          (data) => {
            var productionLst = new PQCPEndingOrderResponse();
            productionLst = data;
            this.lstWorkOrder = data.lstOrder;
            this.lstWorkOrder?.forEach((element) => {
              element.strStatus = Utils.getStatusName(element.status);
            });
            this.collectionSize = Number(productionLst?.total) * this.pageSize;
          },
          (err) => { }
        );
    }

  }
}
