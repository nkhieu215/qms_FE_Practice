import { StoreCheckService } from './../../../share/_services/store_check.service';

import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { DatePipe, formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
import { IqcComponentNVL } from 'src/app/share/response/iqcComponent/iqcComponentNVL';
import { IqcComponentNVLResponse } from 'src/app/share/response/iqcComponent/iqcComponentNVLResponse';
import { AuditCriteriaParam } from 'src/app/share/_models/auditCriteriaParam.model';
import { AuditCriteriaLKDT2 } from 'src/app/share/_models/auditCriteriaLkdt2.model';
import { OitmObjResponse } from 'src/app/share/response/oitm/OitmObjResponse';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import { OitmResponse } from 'src/app/share/response/oitm/OitmResponse';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { OitmService } from 'src/app/share/_services/oitmservice';
import { ExportExcelService } from 'src/app/share/_services/export-excel.service';
import { IqcCheckService } from 'src/app/share/_services/iqcNvl.service';
import { Constant } from 'src/app/share/_services/constant';
import Utils from 'src/app/share/_utils/utils';

@Component({
  selector: 'app-check-lkdt',
  templateUrl: './check-lkdt.component.html',
  styleUrls: ['./check-lkdt.component.css']
})
export class CheckLkdtComponent implements OnInit {

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  form: any = {};
  formErrorChild: any = {};
  lstError?: ErrorList[];
  lstErrorGr?: any[];
  errorAdd?: string;
  arrErrChild: Array<ErrorElectronicComponent> = [];
  auditnvl: IqcComponentNVL[] = [];
  examiantionRes?: IqcComponentNVLResponse;
  formSearch: any = {};
  formAuditCriteriaLKDT: any = {};
  formAuditParam: any = {};
  minLengthTerm = 3;
  minLengthElectronic = 6;
  minLengthOrigin = 2;
  selectExamination: any = '';
  selectedElectronic: any = '';
  selectedOrigin: any = '';
  strSelect: any = '';
  strSelectElec: any = '';
  strSelectOrigin: any = '';
  lstview = true;
  lstAuditCriteriaParamResponse: Array<AuditCriteriaParam> = [];
  lstAuditCriteriaParam: Array<AuditCriteriaParam> = [];

  lstAuditCriteriaLKDTResponse: Array<AuditCriteriaLKDT2> = [];
  lstAuditCriteriaLKDT: Array<AuditCriteriaLKDT2> = [];

  lstElectronic?: Array<OitmObjResponse> = [];
  lstErrorRes?: ErrorListResponse;
  searchExaminationCtrl = new FormControl();
  searchELectronicCtrl = new FormControl();
  searchOriginCtrl = new FormControl();
  filteredExamination = new ExaminationResponse();
  filteredOitm = new OitmResponse();
  filteredOrigin = new OitmResponse();
  isLoading = false;
  isLoadingElec = false;
  isLoadingOrigin = false;
  isEdit = false;
  isShow = false;
  show_approve = false;
  show_edit = false;
  show_edit_button = false;
  id?: any;
  file?: any;
  arrayBuffer?: any;
  filelist?: [];
  typeAction?: any;
  errorMsg!: string;
  closeResult: string = '';
  statusStr?:string='';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };

  constructor(
    private actRoute: ActivatedRoute,
    private exampleService: ExaminationService,
    private modalService: NgbModal,
    private errorService: ErrorListService,
    private oitmService: OitmService,
    private router: Router,
    private tokenStorage: KeycloakService,
    private exportExelService: ExportExcelService,
    private iqcCheckService: IqcCheckService,
    private storeCheckService: StoreCheckService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.typeAction = this.actRoute.snapshot.params['type'];
    this.id = this.actRoute.snapshot.params['id'];
    if (this.typeAction) {
      this.lstview = false;
      this.initCreate();
    } else {
      this.refreshExamination();
    }
  }

  async initCreate() {

    this.errorService.getAllCategories().subscribe(
      (data) => {
        this.lstErrorRes = data;
        this.lstErrorGr = this.lstErrorRes?.lstError;
        this.lstErrorGr = this.lstErrorRes?.lstError;
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
          this.exampleService.searchBycode(value, 2).pipe(
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
      });


    this.searchOriginCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthOrigin;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';

          this.isLoadingOrigin = true;
        }),
        switchMap((value) =>
          this.storeCheckService.searchBycode(value).pipe(
            finalize(() => {
              this.isLoadingOrigin = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.filteredOrigin = data;
      });


    if (this.typeAction == 'add') {
      this.form.checkDate =  new Date();
      this.form.importDate = new Date();
      this.form.reportCode = formatDate(new Date(), 'yyyyMMddhhmmss', 'en_US') + '-RANGDONG-QC'
    } else if (this.typeAction == 'edit' || this.typeAction == 'show') {

      let data = await this.iqcCheckService.detail(this.id);
      this.form = data.component;
      this.statusStr = Utils.getStatusApproveName(this.form.status)
      // this.selectedEx = this.form.templateCode = data.component.templateCode;
      // this.form.checkDate =  this.form.checkDate ? this.datePipe.transform(Number(this.form.checkDate), 'yyyy-MM-dd') : '';
      // console.log("checkdate ::" +  this.form.checkDate);


      this.form.importDate = new Date(this.form.importDate);
      this.strSelectElec = data.component.elecCompCode;
      this.strSelectOrigin = data.component.origin;

      // check status
      if (this.typeAction == 'edit') {
        if (data.component.status == 'WAIT_APPROVE' || data.component.status == 'APPROVE') {
          Swal.fire(
            'Lỗi',
            'Bạn không thể thực hiện chỉnh sửa yêu cầu.',
            'warning'
          )
          this.router.navigate([
            `/iqc/iqc-lkdt-check`,
            {},
          ]);
        }
      }
    }

    const id = this.actRoute.snapshot.params['id'];
    const type = this.actRoute.snapshot.params['type'];
    this.id = id;
    if (id != null && id != 0) {

      if (type == 'show') {
        this.isShow = true;
      } else if (type == 'edit') {
        this.isEdit = true;
      }

      this.id = id;
      let data = await this.iqcCheckService.detail(id);
      this.form = data.component;
      this.isEdit = true;
      this.arrErrChild = data.component.resultError;

      this.lstAuditCriteriaLKDT = data.component.resultLkdt;
      this.lstAuditCriteriaLKDT.forEach(element => {
        element.auditQuantity = element.quantity;
      })

      this.lstAuditCriteriaParam = data.component.resultParam;
    } else {

    }


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
    let data = await this.iqcCheckService.getAll(this.page, this.pageSize, dataSearch, Constant.TYPE_ELECTRIC_COMPONENT_LKDT_BTP, Constant.IQC_TYPE_CREATE)
    console.log(data);
    this.auditnvl = data.lst;
    this.collectionSize = Number(data.total) * this.pageSize;
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
    this.iqcCheckService.downloadfileBtp(id, fileName);
  }
  async onSubmit(buttonType: any) {
    this.form.importDateStr =
      this.form.importDate != null
        ? moment(this.form.importDate).format('DD-MM-YYYY')
        : '';
    this.form.checkDateStr =
      this.form.checkDate != null
        ? moment(this.form.checkDate).format('DD-MM-YYYY')
        : '';
    this.form.elecCompCode = this.strSelectElec;
    this.form.type = 2;
    let message = '';
    if (buttonType == 'save') {
      this.form.status = 'DRAFF';
      message = 'Bạn đã thực hiện thêm mới thành công'
    } else if (buttonType == 'send_approve') {
      this.form.status = 'WAIT_APPROVE';
      message = 'Bạn đã gửi duyệt thành công.';
    }

    var action = "";
    if (this.id == 0 || this.id == null) {
      action = "ADD"
    } else {
      action = "EDIT"
    }

    this.lstAuditCriteriaLKDT.forEach(element => {
      element.quantity = element.auditQuantity;
    })
    let data = await this.iqcCheckService.create(this.form, null, this.lstAuditCriteriaParam, this.lstAuditCriteriaLKDT, this.arrErrChild, action)
    if (data.result.responseCode == '00') {

      Swal.fire("Thành công", message, "success");

      Swal.fire({
        title: 'Thành công',
        text: message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Đồng ý'
      }).then((result) => {
        if (buttonType == 'send_approve') {
          window.location.href = `/iqc/iqc-lkdt-check/${data.id}/show`
        } else {
          window.location.href = `/iqc/iqc-lkdt-check/${data.id}/edit`
        }
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

  onSelected() {
    console.log(this.selectExamination);
    this.strSelect = this.selectExamination.name + '(' + this.selectExamination.code + ')';
    this.lstAuditCriteriaParam = this.selectExamination.iqcAuditCriteriaParameters;
    this.lstAuditCriteriaParam.forEach(element => {
      element.parameterId = element.id;
      element.checkResult = 'Đạt';
      element.ids = Utils.randomString(5);
    })

    this.lstAuditCriteriaLKDT = this.selectExamination.lstAuditCriteriaLkdt;
    this.lstAuditCriteriaLKDT?.forEach(element => {
      element.auditCritetiaLkdtId = element.id;
      element.checkResult = 'Đạt';
      element.ids = Utils.randomString(5);
    })

    console.log(this.lstAuditCriteriaParam);
    console.log(this.lstAuditCriteriaLKDT)

  }

  onSelectedElectronic() {
    console.log(this.selectedElectronic);
    this.strSelectElec = this.selectedElectronic.itemCode;
    this.form.electCompName = this.selectedElectronic.itemName;
  }

  onSelectedOrigin() {
    console.log(this.selectedOrigin);
    this.strSelectOrigin = this.selectedOrigin.name;
    this.form.origin = this.selectedOrigin.name;
    console.log(this.strSelectOrigin);

  }

  onChangeQuantity() {
    var checkQuantity = this.form.checkingQuantity;
    if (this.form.checkingQuantity != null && this.arrErrChild.length !== 0) {
      this.arrErrChild.forEach((element) => {
        var ratio =
          (
            (element.quantity / (checkQuantity == 0 ? 1 : checkQuantity)) *
            100
          ).toFixed(4) + '%';
        console.log(ratio);
        element.ratio = ratio;
      });
    }
  }

  /**
   * thêm mới thông tin kiểm tra
   */
  onAddErrorChild() {
    const { errGroup, errName, quantity, ratio } = this.formErrorChild;
    var errGrname = null;
    this.lstErrorGr?.forEach((element) => {
      if (element.id == errGroup) {
        errGrname = element.name;
      } else {
        errGrname = '';
      }
    });

    const errorChild = new ErrorElectronicComponent(
      errName,
      errGrname,
      quantity,
      ratio,
      Utils.randomString(5)
    );
    this.arrErrChild.push(errorChild);
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
      this.formErrorChild.ratio = number.toFixed(4) + '%';
    }
  }

  deleteErrorRow(ids: any) {
    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.arrErrChild.splice(index, 1);
      }
    });
  }

  addfile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      worksheet['!cols'];
      var arraylist: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.filelist = [];
      var filteredData: any[] = [];
      for (let index = 4; index < arraylist.length; index++) {
        if (arraylist[index].length != 0) {
          filteredData.push(arraylist[index]);
        } else break;
      }

      console.log(filteredData);

      function getValueByCol(col: number, type: string) {
        var arr = filteredData.map(item => item[col]).filter(Number);

        if (type == 'min') {
          return arr.length == 0 ? 0 : Math.min(...arr);
        }
        if (type == 'max') {
          return arr.length == 0 ? 0 : Math.max(...arr);
        }
        if (type == 'avg') {
          const sum = arr.reduce((a, b) => a + b, 0);
          return (sum / arr.length) || 0;
        }
        if (type == 'data') {
          return arr;
        }
        if (type == 'length') {
          return arr.length;
        }
        return null;
      }

      this.lstAuditCriteriaParam.forEach((element, index) => {
        element.minAudit = getValueByCol(index, 'min');
        element.maxAudit = getValueByCol(index, 'max');
        element.avgResult = getValueByCol(index, 'avg');
        element.data = getValueByCol(index, 'data');
        element.s = this.checkS(element.data, element.avgResult);
        element.quantity = getValueByCol(index, 'length');

        element.ku = this.checkKu(element.max, element.avgResult, element.s);
        element.kl = this.checkKl(element.min, element.avgResult, element.s);
        element.cpkUp = this.checkCpkUp(element.max, element.avgResult, element.s);
        element.cpkLow = this.checkCpkLow(element.min, element.avgResult, element.s);
        element.checkResult = 'Đạt'

        if (element.max && element.min) {
          element.kmin = Math.min(element.ku, element.kl);
          element.cpk = Math.min(element.cpkUp, element.cpkLow);
        }
        else if (element.max && !element.min) {
          element.kmin = element.ku;
          element.cpk = element.cpkUp;
        }
        else if (!element.max && element.min) {
          element.kmin = element.kl;
          element.cpk = element.cpkLow;
        } else {
          element.kmin = '';
          element.cpk = '';
        }
      })
    };
  }

  // tính S
  checkS(array: [], avg: number) {
    var total = 0;
    var count = 0;
    array.forEach(value => {
      var a = avg - value;
      total += Math.pow(a, 2);
      count++;
    })
    if (total == 0) {
      return 0;
    } else {
      return Math.sqrt(total / (count - 1)).toFixed(4);
    }
  }

  checkKu(maxAudit: any, avg: any, s: any) {
    if (maxAudit && Number(maxAudit) != 0 && Number(s) != 0) {
      return ((maxAudit - avg) / s).toFixed(4);
    } else {
      return '';
    }
  }

  checkKl(minAudit: any, avg: any, s: any) {
    if (minAudit && Number(minAudit) != 0 && Number(s) != 0) {
      return ((avg - minAudit) / s).toFixed(4);
    } else {
      return '';
    }
  }

  checkCpkUp(maxAudit: any, avg: any, s: any) {
    if (maxAudit && Number(maxAudit) != 0 && Number(s) != 0) {
      return ((maxAudit - avg) / (3 * s)).toFixed(4);
    } else {
      return '';
    }
  }


  checkCpkLow(minAudit: any, avg: any, s: any) {
    if (minAudit && Number(minAudit) != 0 && Number(s) != 0) {
      return ((avg - minAudit) / (3 * s)).toFixed(4);
    } else {
      return '';
    }
  }

  displayWith(value: any) {
    return value?.Title;
  }


  downloadTemplate() {
    let dataHeader: string[] = [];
    this.lstAuditCriteriaParam.forEach(element => {
      dataHeader.push(element.parameterName);
    })
    let reportData = {
      title: 'Thông tin kiểm tra thông số',
      fileName: 'mau_kiem_tra_thong_so',
      data: [],
      headers: dataHeader,
    };
    this.exportExelService.exportTemplatePhotoelectric(reportData);
  }


  addAuditCriterialLKDT() {
    this.formAuditCriteriaLKDT.ids = Utils.randomString(5);
    if (this.typeAction == 'add') {
      this.lstAuditCriteriaLKDT.push(this.formAuditCriteriaLKDT)
    }
    else if (this.typeAction == 'edit') {

    }

    this.formAuditCriteriaLKDT = {};
    this.modalService.dismissAll()
  }


  addAuditCriterialParam() {
    this.formAuditParam.ids = Utils.randomString(5);
    if (this.typeAction == 'add') {
      this.lstAuditCriteriaParam.push(this.formAuditParam)
    }
    else if (this.typeAction == 'edit') {

    }

    this.formAuditCriteriaLKDT = {};
    this.modalService.dismissAll()
  }


  removeAuditLKDT(ids: any) {
    if (this.typeAction == 'edit') {

    }

    this.lstAuditCriteriaLKDT.forEach((element, index) => {
      if (element.ids == ids) {
        this.lstAuditCriteriaLKDT.splice(index, 1);
      }
    });
  }

  removeAuditParam(ids: any) {
    if (this.typeAction == 'edit') {

    }

    this.lstAuditCriteriaParam.forEach((element, index) => {
      if (element.ids == ids) {
        this.lstAuditCriteriaParam.splice(index, 1);
      }
    });
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
      this.router.navigate([`/iqc/iqc-lkdt-check/${data.id}/edit`, {},]);
    })
  }
  async exportExcelDetail(){
    let data = await this.iqcCheckService.detail(this.id);
    this.report(data.component.id,data.component.reportCode);
  }
}
