
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { IqcComponentNVL } from 'src/app/share/response/iqcComponent/iqcComponentNVL';
import { IqcComponentNVLResponse } from 'src/app/share/response/iqcComponent/iqcComponentNVLResponse';
import { AuditCriteriaNvl } from 'src/app/share/_models/auditCriteriaNvl.model';
import { OitmObjResponse } from 'src/app/share/response/oitm/OitmObjResponse';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
import { IqcCheckService } from 'src/app/share/_services/iqcNvl.service';
import { CommonService } from 'src/app/share/_services/common.service';
import { Constant } from 'src/app/share/_services/constant';
import Utils from 'src/app/share/_utils/utils';
@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.css']
})
export class ApproveRequestComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  auditnvl: IqcComponentNVL[] =[];
  lstAuditCriteriaParam: any[] =[];
  lstAuditCriteriaLKDT:any []=[];
  examiantionRes?: IqcComponentNVLResponse;
  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  form: any = {}
  formSearch: any = {
  };
  formApprove: any = {}
  lstAuditCriteriaNvl: AuditCriteriaNvl[] = [];
  lstElectronic?: Array<OitmObjResponse> = [];
  error?: string;
  classError?: string;
  lstErrorRes?: ErrorListResponse;
  lstview = true;
  id?: any;
  typeAction?: any;
  statusStr?:string;
  arrErrChild: Array<ErrorElectronicComponent> = [];

  constructor(
    private iqcService: IqcCheckService,
    private tokenStorage: KeycloakService,
    private actRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router,
  ) {
    this.refreshExamination();
  }
  async refreshExamination() {

    const { name, code, iqcCode, reportCode, invoiceNumber, startDate, endDate, status, itemType, type } = this.formSearch;
    const dataSearch = {
      name: name,
      code: code,
      iqcCode: iqcCode,
      reportCode: reportCode,
      startDate: startDate ? startDate + " 00:00:00" : null,
      endDate: endDate ? endDate + " 23:59:59" : null,
      status: status,
      itemType: itemType,
      invoiceNumber: invoiceNumber,
      type: type
    }

    let data = await this.iqcService.getAll(this.page, this.pageSize, dataSearch, '', Constant.IQC_TYPE_APPROVE)
    this.examiantionRes = data;
    this.auditnvl = data.lst;
    this.collectionSize = Number(this.examiantionRes?.total) * this.pageSize;
  }

  ngOnInit(): void {
    this.typeAction = this.actRoute.snapshot.params['type'];
    this.id = this.actRoute.snapshot.params['id'];
    if (this.typeAction && (this.typeAction == 'approve' || this.typeAction == 'show')) {
      this.lstview = false;
      this.loadInfo();

    }
  }

  async loadInfo() {
    var id = this.actRoute.snapshot.params['id'];
    let data = await this.iqcService.detail(id);
    if(data.component.status != 'WAIT_APPROVE' && this.typeAction == 'approve' ){
      Swal.fire(
        'Lỗi',
        'Trạng thái của yêu cầu không phù hợp.',
        'warning'
      )

      this.router.navigate([
        `/iqc/check-approve`,
        {},
      ]);
    }
    this.form = data.component;
    this.statusStr = Utils.getStatusApproveName(this.form.status);
    this.form.checkDate = new Date(this.form.checkDate);
    this.form.importDate = new Date(this.form.importDate);
    this.lstAuditCriteriaNvl = data.component.resultNvls;
    this.lstAuditCriteriaParam = data.component.resultParam;
    this.lstAuditCriteriaLKDT = data.component.resultLkdt;
    this.form.id = id;
    this.form.templateCode = data.component.templateCode;
    this.form.elecCompCode = data.component.elecCompCode;
    this.arrErrChild = data.component.resultError
  }

  delete(id?: any) {
    console.info(id);
  }

  report(id?: any, type?: any, auditCode?: any) {

    if (type == 1) {
      let fileName = this.tokenStorage.getUsername() + "_" + auditCode + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx"
      this.iqcService.downloadfileNVL(id, fileName);
    } else if (type == 2) {

      let fileName = this.tokenStorage.getUsername() + "_" + auditCode + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx"
      this.iqcService.downloadfileBtp(id, fileName);
      // this.iqcService.downloadfileNVL(id).subscribe(
      //   blob => saveAs(blob, "IQC_report_NVL"+   formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx")
      // )
    }


  }

  open(content: any) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

   onSubmitApprove(status: string) {


      Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn tiếp tục thực hiện hoàn thành quá trình kiểm tra ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.value) {
        let dataPost = {
          note: this.formApprove.note,
          approveStatus: status,
          type: 'IQC',
          checkId: this.actRoute.snapshot.params['id']
        }

        let data = await this.commonService.approveCheck(dataPost);
        if(data.result.responseCode =='00'){
          Swal.fire(
            'Thành công',
            'Bạn đã thực hiện thành công.',
            'success'
          )
          this.formApprove = {}
          this.modalService.dismissAll();
          this.router.navigate([
            `/iqc/check-approve`,
            {},
          ]);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

}
