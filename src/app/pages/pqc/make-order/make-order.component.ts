import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { CommonService } from 'src/app/share/_services/common.service';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { PQCPEndingOrderResponse } from 'src/app/share/response/pqcResponse/pqcPendingOrderResponse';
import Utils from 'src/app/share/_utils/utils';
import { AuthService } from 'src/app/share/_services/auth.service';

@Component({
  selector: 'app-make-order',
  templateUrl: './make-order.component.html',
  styleUrls: ['./make-order.component.css']
})
export class MakeProductOrderComponent implements OnInit {

  constructor(
    private pqcService: PQCService,
    private modalService: NgbModal,
    private actRoute: ActivatedRoute,
    private commonService: CommonService,
    protected autoLogout: AuthService
  ) { }

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.refreshPage();
  }
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstCheck: any[] = [];
  lstWorkOrder: PQCWorkOrder[] = [];
  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };

  formSearch: any = {
    name: null,
    code: null,
    lot: null,
    startDate: null,
    endDate: null
  };

  refreshPage() {
    const { name, code, lot, startDate, endDate, sap, woCode, status, groupName, branchName, workOrderCode, version } = this.formSearch;
    // thay đổi mới 15/7/2024: đảo ngược vị trí biến branchName và groupName
    console.log('search body', this.formSearch)
    this.pqcService.getListByStep(this.page, this.pageSize, name, code, lot, "", startDate, endDate, sap, woCode, status, branchName, groupName, workOrderCode, version).subscribe(
      data => {
        var productionLst = new PQCPEndingOrderResponse();
        productionLst = data;

        this.lstWorkOrder = data.lstOrder;
        console.log('list', this.lstWorkOrder)
        this.lstWorkOrder?.forEach(element => {
          element.strStatus = Utils.getStatusName(element.status);
          element.checkDaq = element.checkDaq === 'true' && element.checkDaqStatus === 'true' ? true : false;
        })

        this.collectionSize = Number(productionLst?.total) * this.pageSize;
      },
      err => {

      }
    );
  }

  open(content: any, id: any) {

    this.commonService.statusStep(id).toPromise().then(
      data => {
        this.lstCheck = data.lstStep.filter((x: any) => x.nameStep != 'Print Serial');
        this.lstCheck?.forEach(el => {
          el.status = Utils.getStatusName(el.status);
        })
      },
      error => { }
    )

    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  cancelWo(name: any, id: any) {
    Swal.fire({
      title: 'Xác nhận Hủy lệnh kiểm tra',
      text: 'Bạn có muốn tiếp tục thực hiện Hủy quá trình kiểm tra của mã lệnh ' + name + ' không? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {
        this.pqcService.cancelProcessCheckWo(id).subscribe(
          data => {
            Swal.fire("Thành công", "Bạn đã thực hiện hủy bỏ lệnh thành công", 'warning');
            this.refreshPage();
          }
        )

      }
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
