
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { Component, Input, OnInit } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.css']
})
export class ApproveRequestComponent implements OnInit {
  // ------------------------------------------------ list item ----------------------------------------------
  // bản test
  address = 'http://localhost:8449';
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  path = 'api/testing-critical';
  //list item
  listOfItem: any[] = [];
  listOfItems: any;
  @Input() itemResult: any;
  itemcode: any;
  iqcElecCompId: any;
  //------------------------------------------------- list errors ---------------------------------------------
  listOfError: any;
  errorsResult: any;
  auditResultItemId = 0;
  @Input() itemCode = '';
  @Input() errCode = '';
  @Input() errGroup = '';
  @Input() errName = '';
  lstItemCode: any[] = [];
  lstErrCode: any[] = [];
  lstErrName: any[] = [];
  lstErrGroup: any[] = [];
  listErrorGroup: any;
  listErrors: any;
  //-------------------------------------------------------------------------------------------------------------
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  auditnvl: IqcComponentNVL[] = [];
  lstAuditCriteriaParam: any[] = [];
  lstAuditCriteriaLKDT: any[] = [];
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
  statusStr?: string;
  arrErrChild: Array<ErrorElectronicComponent> = [];

  constructor(
    private iqcService: IqcCheckService,
    private tokenStorage: KeycloakService,
    private actRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router,
    protected http: HttpClient

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
    console.log(data)
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
    this.http.get<any>(`${this.address}/${this.path}/iqc/get-all/${this.id}`).subscribe(res => {
      this.listOfItem = res;
      setTimeout(() => {
        if (this.listOfItem.length > 5) {
          document.getElementById('table-body')!.style.width = '99.9%';
        } else {
          document.getElementById('table-body')!.style.width = '99%';
        }
      }, 100);
    })
    this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${this.id}`).subscribe(res => {
      this.listOfError = res;

    })
    let data = await this.iqcService.detail(id);
    if (data.component.status != 'WAIT_APPROVE' && this.typeAction == 'approve') {
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
    console.log('check result : ', this.form)
  }

  delete(id?: any) {
    console.info(id);
  }

  report(id?: any, type?: any, auditCode?: any) {

    if (type == 1) {
      this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${id}`).subscribe(res => {
        this.listOfError = res;
        setTimeout(() => {
          let fileName = this.tokenStorage.getUsername() + "_" + auditCode + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx"
          this.iqcService.downloadfileNVL(id, fileName, this.listOfError);
        }, 100)
      })
    } else if (type == 2) {
      this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${id}`).subscribe(res => {
        this.listOfError = res;
        setTimeout(() => {
          let fileName = this.tokenStorage.getUsername() + "_" + auditCode + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx"
          this.iqcService.downloadfileBtp(id, fileName, this.listOfError);
          // this.iqcService.downloadfileNVL(id).subscribe(
          //   blob => saveAs(blob, "IQC_report_NVL"+   formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx")
          // )
        }, 100)
      })
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
        if (data.result.responseCode == '00') {
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
  // -------------------------------------------- Danh sách sản phẩm --------------------------------------------------------

  openPopupError(content: any, item: any) {
    this.errCode = '';
    this.errGroup = '';
    this.errName = '';
    if (item === null) {
      this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${this.id}`).subscribe(res => {
        this.listOfError = res;
      })
    } else {
      this.itemCode = item.itemCode;
      this.http.get<any>(`${this.address}/${this.path}/errors/audit-result-item-id/${item.id}`).subscribe(res => {
        this.listOfError = res;
        this.getLstItemCode();
      })
    }

    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  findInListErrors() {
    const data = { errCode: this.errCode, errName: this.errName, errGroup: this.errGroup, itemCode: this.itemCode };
    this.http.post<any>(`${this.address}/${this.path}/errors/search`, data).subscribe(res => {
      this.listOfError = res;
      console.log('list errors: ', res, this.id);
    })
  }
  getLstItemCode() {
    this.lstItemCode = [];
    var list = this.listOfError.filter((item: any) => item.itemCode.includes(this.itemCode));
    list.forEach((item: any) => {
      const data = this.lstItemCode.find((x: any) => x.itemCode === item.itemCode);
      if (!data) {
        this.lstItemCode.push(item);
      }
    })
    this.getLstErrGroup();
    this.getLstErrCode();
    this.getLstErrName();
  }
  getLstErrCode() {
    this.lstErrCode = [];
    var list = this.listOfError.filter((item: any) => item.errCode.includes(this.errCode) && item.itemCode.includes(this.itemCode) && item.errGroup.includes(this.errGroup));
    list.forEach((item: any) => {
      const data = this.lstErrCode.find((x: any) => x.errCode === item.errCode);
      if (!data) {
        this.lstErrCode.push(item);
      }
    })
    this.getLstErrName();
  }
  getLstErrName() {
    this.lstErrName = [];
    var list = this.listOfError.filter((item: any) => item.errName.includes(this.errName) && item.errCode.includes(this.errCode) && item.itemCode.includes(this.itemCode) && item.errGroup.includes(this.errGroup));
    list.forEach((item: any) => {
      const data = this.lstErrName.find((x: any) => x.errName === item.errName);
      if (!data) {
        this.lstErrName.push(item);
      }
    })
  }
  getLstErrGroup() {
    this.lstErrGroup = [];
    var list = this.listOfError.filter((item: any) => item.itemCode.includes(this.itemCode) && item.errGroup.includes(this.errGroup));
    list.forEach((item: any) => {
      const data = this.lstErrGroup.find((x: any) => x.errGroup === item.errGroup);
      if (!data) {
        this.lstErrGroup.push(item);
      }
    })
    this.getLstErrCode();
    this.getLstErrName();
  }
  getListErrorGroup() {
    this.http.get<any>(`${this.address}/${this.path}/errors/group/get-all`).subscribe(res => {
      this.listErrorGroup = res;
    })
  }
  getListError() {
    if (this.id !== undefined) {
      this.http.get<any>(`${this.address}/${this.path}/errors/get-all`).subscribe(res => {
        this.listErrors = res;
        this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${this.id}`).subscribe(res => {
          this.listOfError = res;

        })
      })
    }
  }
  getListErrorById(errGroup: any, index: any) {
    var data = this.listErrorGroup.find((item: any) => item.errGroup === errGroup);
    this.http.get<any>(`${this.address}/${this.path}/errors/group/get-all/${data.id}`).subscribe(res => {
      console.log("check result", res)
      this.listErrors = res;
      setTimeout(() => {
        if (this.listErrors.length === 0) {
          this.http.get<any>(`${this.address}/${this.path}/errors/group/get-all/null`).subscribe(res => {
            this.listOfError[index].errGroup = '';
            this.listErrors = res;
          })
        }
      }, 100);
    })
  }
  mappingErrCode(errName: any, index: any) {
    var data = this.listErrors.find((item: any) => item.errName === errName);
    this.listOfError[index].errCode = data.errCode;
  }
  // findByCritiCalGroup(){
  //   this.listOfCriticalName =[];
  //     var data = {testingCriticalGroup:this.testingCriticalGroup,type:'NVL'}
  //     this.http.post<any>(`${this.address}/${this.path}/get-list-guide`,data).subscribe(res=>{
  //       this.listOfCriticalName = res;
  //       console.log(this.listOfCriticalName)
  //    })
  // }
}
