import { FormControl, FormBuilder } from '@angular/forms';
import { saveAs } from 'file-saver';
import { formatDate } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';

import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { Component, OnInit, ViewChild } from '@angular/core';
import Utils from 'src/app/share/_utils/utils';
import Swal from 'sweetalert2';
import { error } from 'console';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { CommonService } from 'src/app/share/_services/common.service';
import { PQCPEndingOrderResponse } from 'src/app/share/response/pqcResponse/pqcPendingOrderResponse';

@Component({
  selector: 'app-aprove-quality-evaluation',
  templateUrl: './aprove-quality-evaluation.component.html',
  styleUrls: ['./aprove-quality-evaluation.component.css']
})
export class AproveQualityEvaluationComponent implements OnInit {

  lstview = true;
  crud = false;
  approve = false;
  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private tokenStorage: KeycloakService,
    private _formBuilder: FormBuilder,
    private router: Router
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstCheckStep?: string[] = []
  id?: any;
  formSearch: any = {
  };

  form: any = {
  };
  lstCheck: StepCheck[] = [];


  toppings?: any;

  idWorkOrder = '';
  ngOnInit(): void {
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
    this.getInfo()
  }

  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.id = id;
    const type = this.actRoute.snapshot.params['type'];
    if (id == null && type == null) {
      this.lstview = true;
      this.crud = false;
      this.refreshPage();
    }

    if (type == 'approve') {
      this.approve = true;
      this.lstview = false;
      this.commonService.statusStep(id).toPromise().then(
        data => {

          this.lstCheck = data.lstStep;


          this.lstCheck.forEach(element => {
            this.lstCheckStep?.push(element.step);
            element.checked = element.checked;
          });
        },
        error => { }
      )
    }
  }


  changeWo(data: any) {
    // console.log(data);
    if (data.status == 'CREATE' || data.status == 'REJECT' || data.status == 'WAIT_APPROVE') {

    } else {
      Swal.fire({
        title: 'Lỗi',
        text: 'Bạn đã thực hiện gửi yêu cầu phê duyệt/yêu cầu đã được phê duyệt',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
      }).then((result) => {
        this.router.navigate(['/'])
      })
    }
  }

  refreshPage() {
    const { name, code, lot, startDate, endDate, sap, woCode, status, branchName, groupName, workOrderCode } = this.formSearch;
    this.pqcService.getListByStep(this.page, this.pageSize, name, code, lot, "", startDate, endDate, sap, woCode, status, branchName, groupName, workOrderCode).subscribe(
      data => {
        var productionLst = new PQCPEndingOrderResponse();
        productionLst = data;

        this.lstWorkOrder = productionLst.lstOrder;
        this.lstWorkOrder?.forEach(element => {
          element.strStatus = Utils.getStatusName(element.status);
        })

        this.collectionSize = Number(productionLst?.total) * this.pageSize;
      },
      err => {

      }
    );
  }


  note?: any;
  onSubmit(action: any) {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn tiếp tục thực hiện hoàn thành quá trình kiểm tra ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {
        let data = {
          checkPerson: this.tokenStorage.getUsername(),
          workOrderId: this.actRoute.snapshot.params['id'],
          note: this.note,
          conclude: action,
          type: action,
          lstStep: this.lstCheck
        };
        this.pqcService.approve(data).subscribe(
          (data) => {
            Swal.fire(
              'Thành công',
              'Bạn đã thực hiện thành công.',
              'success'
            )
            if (action == 'approve') {
              this.approve = false;
            }
          },
          (err) => { }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })


  }

  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  open(content: any, id: any) {

    this.commonService.statusStep(id).toPromise().then(
      data => {
        this.lstCheck = data.lstStep;
        this.lstCheck.forEach(element => {
          element.status = Utils.getStatusName(element.status);
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
  closeResult: string = '';
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  report(id?: any) {
    this.pqcService.getDetailPqcWorkOrder(id).subscribe(
      data => {
        let wo = data.pqcWorkOrder;
        let user = this.tokenStorage.getUsername();
        this.pqcService.report(id).subscribe(
          blob => saveAs(blob, user + "_" + wo.workOrderId + "_" + wo.sapWo + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx")
        )
      },
      error => { }
    )

  }

}


export interface StepCheck {
  id: number
  nameStep: string
  pqcWorkOrder: string
  setting: string
  status: string
  step: string
  userId: string
  checked: boolean
}
