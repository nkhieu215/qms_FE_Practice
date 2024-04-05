
import { KeycloakService } from 'keycloak-angular';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { IqcComponentNVLResponse } from 'src/app/share/response/iqcComponent/iqcComponentNVLResponse';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import { OitmResponse } from 'src/app/share/response/oitm/OitmResponse';
import { AuditCriteriaNvl } from 'src/app/share/_models/auditCriteriaNvl.model';
import { OitmObjResponse } from 'src/app/share/response/oitm/OitmObjResponse';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { OitmService } from 'src/app/share/_services/oitmservice';
import { IqcCheckService } from 'src/app/share/_services/iqcNvl.service';
import Utils from 'src/app/share/_utils/utils';
import { Constant } from 'src/app/share/_services/constant';
import * as moment from 'moment';

@Component({
  selector: 'app-check-nvl',
  templateUrl: './check-nvl.component.html',
  styleUrls: ['./check-nvl.component.css']
})
export class CheckNvlComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  auditnvl: any[] = [];
  examiantionRes?: IqcComponentNVLResponse;
  formSearch: any = {
  };
  lstview = true;
  id: any;
  searchExaminationCtrl = new FormControl();
  searchELectronicCtrl = new FormControl();
  filteredExamination = new ExaminationResponse();
  filteredOitm = new OitmResponse();
  isLoading = false;
  isLoadingElec = false;
  errorMsg!: string;
  minLengthTerm = 3;
  minLengthElectronic = 6;
  selectedEx: any = '';
  selectedElectronic: any = '';
  strSelect: any = '';
  strSelectElec: any = '';
  lstAuditCriteriaNvl: AuditCriteriaNvl[] = [];
  lstElectronic?: Array<OitmObjResponse> = [];
  error?: string;
  classError?: string;
  form: any = {};
  formAddCheck: any = {};
  formErrorChild: any = {};
  errorAdd?: string;
  arrErrChild: Array<ErrorElectronicComponent> = [];
  lstErrorRes?: ErrorListResponse;

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  typeAction?: any;
  constructor(
    private actRoute: ActivatedRoute,
    private exampleService: ExaminationService,
    private modalService: NgbModal,
    private errorService: ErrorListService,
    private oitmService: OitmService,
    private router: Router,
    private tokenStorage: KeycloakService,
    private iqcCheckService: IqcCheckService

  ) {
  }

  onSelected() {
    console.log(this.selectedEx);
    this.strSelect = this.selectedEx.name + '(' + this.selectedEx.code + ')';
    this.lstAuditCriteriaNvl = this.selectedEx.lstAuditCriteriaNvl;
    this.lstAuditCriteriaNvl.forEach((element) => {
      element.auditCriteriaId = element.id + '';
      element.minAudit = element.min;
      element.maxAudit = element.max;
      element.noteAudit = element.note;
      element.unitAudit = element.unit;
      element.min = '';
      element.max = '';
      element.note = '';
      element.checkResult = 'Đạt'
      element.regulationLevel = element.regulationLevel;
      element.ids = Utils.randomString(5);
    })
  }

  onSelectedElectronic() {
    console.log(this.selectedElectronic);
    this.strSelectElec = this.selectedElectronic.itemCode;
    this.lstElectronic = this.selectedElectronic.lstAuditCriteriaNvl;
    this.form.electCompName = this.selectedElectronic.itemName;
  }

  displayWith(value: any) {
    return value?.Title;
  }

  clearSelection() {
    this.selectedEx = '';
    this.filteredExamination = new ExaminationResponse();
  }

  async refreshExamination() {
    const { name, code, iqcCode, reportCode, invoiceNumber, startDate, endDate, status, itemType } = this.formSearch;
    const dataSearch = {
      name: name,
      code: code,
      iqcCode: iqcCode,
      reportCode: reportCode,
      startDate: startDate ? startDate + " 00:00:00" : null,
      endDate: endDate ? endDate + " 23:59:59" : null,
      status: status,
      itemType: itemType,
      invoiceNumber: invoiceNumber
    }
    let data = await this.iqcCheckService.getAll(this.page, this.pageSize, dataSearch, Constant.TYPE_ELECTRIC_COMPONENT_NVL, Constant.IQC_TYPE_CREATE)
    console.log(data);
    this.auditnvl = data.lst;
    this.collectionSize = Number(data.total) * this.pageSize;
  }

  ngOnInit(): void {
    this.typeAction = this.actRoute.snapshot.params['type']
    this.id = this.actRoute.snapshot.params['id'];
    console.log(this.typeAction);
    if (this.typeAction) {
      this.lstview = false;
      this.initCreate();
    } else {
      this.lstview = true;
      this.refreshExamination();
    }
  }

  async delete(id?: any) {
    let data = await this.iqcCheckService.delete(id);
    if (data.result.responseCode == '00') {
      this.refreshExamination();
      Swal.fire("Thành công", "Bạn đã xóa thông tin kiểm tra thành công", "warning")
    }

  }

  report(id?: any, code?: any) {
    let fileName = this.tokenStorage.getUsername() + "_" + code + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx"
    this.iqcCheckService.downloadfileNVL(id, fileName);
  }

  /**
  * thêm mới thông tin kiểm tra
  */
  async onAddErrorChild() {
    const { errGroup, errName, quantity, ratio, note } = this.formErrorChild;
    const errorChild = new ErrorElectronicComponent(
      errName, errGroup, quantity, ratio, note, Utils.randomString(5)
    );

    if (this.typeAction == 'edit') {
      errorChild.electCompId = this.id;
      let data = await this.iqcCheckService.addCheckParam({ errParam: errorChild, type: 'ERROR' });
      if (data.result.responseCode == '00') {
        errorChild.id = data.id;
        this.arrErrChild.push(errorChild);
        Swal.fire("Thành công", "Bạn đã thêm thông tin kiểm tra thành công", "success")
      }
    } else {
      this.arrErrChild.push(errorChild);
    }
  }

  async onAddCheck() {
    const { criteriaName, regulationLevel, minAudit, maxAudit, unitAudit, noteAudit, ortherRequerement, quantityAudit, min, max, checkResult, note } = this.formAddCheck;
    this.formAddCheck.ids = Utils.randomString(5);
    let audit = new AuditCriteriaNvl();
    audit.criteriaName = criteriaName;
    audit.regulationLevel = regulationLevel;
    audit.minAudit = minAudit;
    audit.maxAudit = maxAudit;
    audit.unitAudit = unitAudit;
    audit.noteAudit = noteAudit;
    audit.ortherRequerement = ortherRequerement;
    audit.min = min;
    audit.quantityAudit = quantityAudit;
    audit.max = max;
    audit.note = note;
    audit.checkResult = checkResult;


    if (this.typeAction == 'edit') {
      audit.electCompId = this.id;
      let data = await this.iqcCheckService.addCheckParam({ nvlParam: audit, type: 'NVL' });
      if (data.result.responseCode == '00') {
        audit.id = data.id;
        this.lstAuditCriteriaNvl.push(audit);
        Swal.fire("Thành công", "Bạn đã thêm thông tin kiểm tra thành công", "success")
      }
    } else {
      this.lstAuditCriteriaNvl.push(audit);
    }
    this.modalService.dismissAll();


    this.formAddCheck = {}
  }

  async deleteAuditRow(ids: any, id: any) {

    if (this.typeAction == 'edit') {
      let data = await this.iqcCheckService.deleteItemCheck(id, this.id, 'NVL');
      if (data.result.responseCode == '00') {
        Swal.fire("Thành công", "Bạn đã xóa thông tin kiểm tra thành công", "warning")
      }
    }

    this.lstAuditCriteriaNvl.forEach((element, index) => {
      if (element.ids == ids) {
        this.lstAuditCriteriaNvl.splice(index, 1);
      }
    });
  }

  async deleteErrorRow(ids: any, id: any) {

    if (this.typeAction == 'edit') {
      let data = await this.iqcCheckService.deleteItemCheck(id, this.id, 'ERROR');
      if (data.result.responseCode == '00') {
        Swal.fire("Thành công", "Bạn đã xóa thông tin kiểm tra thành công", "warning")
      }
    }

    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.arrErrChild.splice(index, 1);
      }
    });
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

  onChangeErrorGroup(name: any) {
    this.lstErrorGr?.forEach((element) => {
      if (element.name == name) {
        this.lstError = element.errChild;
        // this.formErrorChild.errGroup = element.name;
      }
    });
  }

  onChangeQuantityError(errorNumber: any) {
    if (this.form.checkingQuantity == null || this.form.checkingQuantity == 0) {
      this.errorAdd = 'Bạn chưa thực hiện nhập số lượng kiểm tra';
      this.formErrorChild.ratio = 0;
    } else {
      this.errorAdd = '';
      var number = (errorNumber / this.form.checkingQuantity) * 100;
      this.formErrorChild.ratio = number.toFixed(2) + '%';
    }
  }

  onChangeQuantity() {
    var checkQuantity = this.form.checkingQuantity;
    if (this.form.checkingQuantity != null && this.arrErrChild.length !== 0) {
      this.arrErrChild.forEach((element) => {
        var ratio =
          (
            (element.quantity / (checkQuantity == 0 ? 1 : checkQuantity)) *
            100
          ).toFixed(2) + '%';
        console.log(ratio);
        element.ratio = ratio;
      });
    }
  }


  // init create and edit
  async initCreate() {
    this.form = {};
    if (this.typeAction == 'add') {
      this.form.reportCode = formatDate(new Date(), 'yyyyMMddhhmmss', 'en_US') + '-RANGDONG-QC';
      this.form.conclusion = "Đạt nhập kho";
      this.form.checkDate = new Date();
      this.form.importDate = new Date();
    } else if (this.typeAction == 'edit' || this.typeAction == 'show') {
      var id = this.id;
      let data = await this.iqcCheckService.detail(id);
      this.form = data.component;
      this.selectedEx = this.form.templateCode = data.component.templateCode;
      this.form.checkDate = new Date(this.form.checkDate);
      this.form.importDate = new Date(this.form.importDate);
      this.lstAuditCriteriaNvl = data.component.resultNvls;
      this.lstAuditCriteriaNvl.forEach(element => {
        element.ids = Utils.randomString(5);
      })
      this.form.id = id;
      this.form.templateCode = data.component.templateCode;
      this.form.elecCompCode = data.component.elecCompCode;
      this.arrErrChild = data.component.resultError
    }



    this.errorService.getAllCategories().subscribe(
      (data) => {
        this.lstErrorRes = data;
        this.lstErrorGr = data.lstError;
        console.log(this.lstErrorRes);
      },
      (err) => { }
    );

    this.searchExaminationCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';

          this.isLoading = true;
        }),
        switchMap((value) =>
          this.exampleService.searchBycode(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.filteredExamination = data;
        console.log(this.filteredExamination);
      });

    this.searchELectronicCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthElectronic;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';
          this.isLoadingElec = true;
        }),
        switchMap((value) =>
          this.oitmService.searchBycode(value).pipe(
            finalize(() => {
              this.isLoadingElec = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.filteredOitm = data;
        console.log(this.filteredOitm);
      });
  }

  /**
   * thêm mới thông tin audit
   */
  async onSubmit(buttonType: any) {
    this.form.importDateStr =
      this.form.importDate != null ? moment(this.form.importDate).format('DD-MM-YYYY') : '';
    this.form.checkDateStr = this.form.checkDate != null ? moment(this.form.checkDate).format('DD-MM-YYYY') : '';
    this.form.elecCompCode = this.strSelectElec;
    this.form.type = Constant.TYPE_ELECTRIC_COMPONENT_NVL;

    if (this.typeAction == 'add') {
      this.form.templateCode = this.selectedEx.code;
    }

    let message = "Thêm mới biên bản thành công.";
    let showPage = false;
    if (buttonType == 'save') {
      this.form.status = 'DRAFF';
    } else if (buttonType == 'send_approve') {
      this.form.status = 'WAIT_APPROVE';
      showPage = true;
      message = "Bạn đã thực hiện gửi yêu cầu phê duyệt thành công";
    }

    let data = await this.iqcCheckService.create(this.form, this.lstAuditCriteriaNvl, null, null, this.arrErrChild, 'ADD');
    if (data && data.result.responseCode == '00') {
      Swal.fire('Thành công', message, 'success')
      Swal.fire({
        title: 'Thành công',
        text: message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Đồng ý',
      }).then(async (result) => {
        if (showPage) {
          this.router.navigate([`/iqc/iqc-nvl-check/${data.id}/show`, {}, ]).then(() => { window.location.reload(); });
        } else {
          this.router.navigate([
            `/iqc/iqc-nvl-check/${data.id}/edit`,
            {},
          ]).then(() => { window.location.reload(); });

        }
      })
    }
  }


  copyCheckNvl(id: any, type: any) {
    Swal.fire({
      title: 'Cảnh báo',
      text: 'Bạn có muốn tiếp tục thực hiện copy biên bản không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      const data = await this.iqcCheckService.copy(id);
      this.router.navigate([`/iqc/iqc-nvl-check/${data.id}/edit`, {},]);
    })
  }

  async exportExcelDetail(){
    let data = await this.iqcCheckService.detail(this.id);
    this.report(data.component.id,data.component.reportCode);
  }
}
