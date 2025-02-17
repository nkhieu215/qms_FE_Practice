

import { KeycloakService } from 'keycloak-angular';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Utils from 'src/app/share/_utils/utils';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { PQCPhotoelectricService } from 'src/app/share/_services/pqcPhotoelectric.service';
import { ExportExcelService } from 'src/app/share/_services/export-excel.service';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { AuditCriteriaParam } from 'src/app/share/_models/auditCriteriaParam.model';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import { AuditCriteriaLKDT2 } from 'src/app/share/_models/auditCriteriaLkdt2.model';
import { PqcPhotoelectric } from 'src/app/share/_models/pqc_photoelectric.model';
import { AuthService } from 'src/app/share/_services/auth.service';
@Component({
  selector: 'app-photoelectric',
  templateUrl: './photoelectric.component.html',
  styleUrls: ['./photoelectric.component.css']
})
export class PhotoelectricComponent implements OnInit {
  @Input() show_check = '';
  idWorkOrder?: string;
  show_work_order = true;

  lstview = true;
  crud = false;
  create = false;
  edit = false;
  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private modalService: NgbModal,
    private tokenStorage: KeycloakService,
    private errorService: ErrorListService,
    private exampleService: ExaminationService,
    private photoelectricService: PQCPhotoelectricService,
    private exportExelService: ExportExcelService,
    protected autoLogout: AuthService
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  formSearch: any = {};

  minLengthTerm = 3;
  minLengthElectronic = 6;
  selectExamination: any = '';
  selectedElectronic: any = '';
  strSelect: any = '';
  strSelectElec: any = '';

  form: any = {};

  searchExaminationCtrl = new FormControl();
  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  errorMsg!: string;
  isLoading = false;
  filteredExamination = new ExaminationResponse();
  lstAuditCriteriaParamResponse: Array<AuditCriteriaParam> = [];
  lstAuditCriteriaParam: Array<AuditCriteriaParam> = [];
  lstAuditCriteriaLKDTResponse: Array<AuditCriteriaLKDT2> = [];
  lstAuditCriteriaLKDT: Array<AuditCriteriaLKDT2> = [];
  lstCheck?: any[] = [];

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.form.checkPerson = this.tokenStorage.getUsername();
    this.getInfo();
    // auto search
    this.searchExaminationCtrl.valueChanges.pipe(
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
  }

  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    var type = this.actRoute.snapshot.params['type'];
    if (id == null && type == null) {
      this.lstview = true;
      this.crud = false;
    }

    if (type == 'add') {
      this.edit = false;
      this.create = true;
      this.lstview = false;
      this.errorService.getAllCategories().subscribe(
        (data) => {
          this.lstErrorRes = data;
        },
        (err) => { }
      );
    } else if (type == 'edit') {
      this.edit = true;
      this.create = false;
      this.lstview = false;
    } else if (type == 'show') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      this.show_work_order = false;
    }

    this.idWorkOrder = id;
    if (this.show_check == 'SHOW') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      type = 'show';
      this.show_work_order = false;
    }


    if (type == 'add' || type == 'show' || type == 'edit') {
      this.pqcService.getDetailPqcWorkOrder(id).subscribe((data) => {
        this.form = data.pqcWorkOrder;
        this.lstCheck = data.pqcWorkOrder.lstPhotoelectrics
        this.lstCheck?.forEach(element => {
          element.ids = Utils.randomString(5)
        })
        setTimeout(() => {
          this.lstCheck?.sort((a: any, b: any) => b.createdAt - a.createdAt);
        }, 300);
      });
    }
  }

  onSelected() {
    console.log(this.selectExamination);
    this.strSelect = this.selectExamination.name + '(' + this.selectExamination.code + ')';
    this.lstAuditCriteriaParam = this.selectExamination.iqcAuditCriteriaParameters;
    this.lstAuditCriteriaParam.forEach(element => {
      element.parameterId = element.id;
      element.minAudit = element.min;
      element.maxAudit = element.max;
      element.min = '';
      element.max = ''
      element.checkResult = 'Đạt'
    })

    this.lstAuditCriteriaLKDT = this.selectExamination.lstAuditCriteriaLkdt;
    this.lstAuditCriteriaLKDT?.forEach(element => {
      element.auditCritetiaLkdtId = element.id;
      element.id = null;
      element.checkResult = 'Đạt'
    })

    console.log(this.lstAuditCriteriaParam);
    console.log(this.lstAuditCriteriaLKDT)

  }

  displayWith(value: any) {
    return value?.Title;
  }

  // crud

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
    windowClass: 'modal-xxl',
    backdrop: 'static',
  };

  error = '';
  onSubmit(action: any) {

    let arrform = [];
    let pqc = new PqcPhotoelectric();
    pqc.conclude = this.form.conclude;
    pqc.lot = this.form.lotNumber;
    pqc.note = this.form.note;
    pqc.quantity = this.form.quantity;
    pqc.workOrderId = this.actRoute.snapshot.params['id'];
    pqc.lstLkdt = this.lstAuditCriteriaLKDT;
    pqc.createdBy = this.tokenStorage.getUsername();
    pqc.lstParam = this.lstAuditCriteriaParam;

    this.photoelectricService.createUpdate(pqc).toPromise().then(
      data => {
        this.edit = false;
        this.create = false;
        Swal.fire(
          'Thêm mới thông tin',
          'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
          'success'
        )
        pqc.id = data.id
        pqc.ids = Utils.randomString(5);
        pqc.createdAt = new Date().toLocaleString()
        this.lstCheck?.push(pqc)
      }
    )
  }


  file?: any;
  arrayBuffer?: any;
  filelist?: [];
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

      var tmp: any[] = [];
      function getValueByCol(col: number, type: string) {
        var arr = filteredData.map(item => item[col]);

        arr = arr.filter(function (element) {
          return Number.isFinite(element);
        });

        if (type == 'min') {
          const min = Math.min(...arr);
          return Number.isFinite(min) ? min : 0;
        }
        if (type == 'max') {
          const max = Math.max(...arr);
          return Number.isFinite(max) ? max : 0;
        }
        if (type == 'avg') {
          const sum = arr.reduce((a, b) => a + b, 0);
          return (sum / arr.length).toFixed(4) || 0;
        }
        if (type == 'data') {
          return arr;
        }
        return null;
      }

      this.lstAuditCriteriaParam.forEach((element, index) => {
        element.min = getValueByCol(index, 'min');
        element.max = getValueByCol(index, 'max');
        element.avgResult = getValueByCol(index, 'avg');
        element.data = getValueByCol(index, 'data');
        element.s = this.checkS(element.data, element.avgResult);

        element.maxAudit = element.maxAudit ?? '';
        element.minAudit = element.minAudit ?? '';

        element.ku = this.checkKu(element.maxAudit, element.avgResult, element.s);
        element.kl = this.checkKl(element.minAudit, element.avgResult, element.s);
        element.cpkUp = this.checkCpkUp(element.maxAudit, element.avgResult, element.s);
        element.cpkLow = this.checkCpkLow(element.minAudit, element.avgResult, element.s);

        if (element.maxAudit && element.minAudit) {
          element.kmin = Math.min(element.ku, element.kl);
          element.cpk = Math.min(element.cpkUp, element.cpkLow);
        }
        else if (element.maxAudit && !element.minAudit) {
          element.kmin = element.ku;
          element.cpk = element.cpkUp;
        }
        else if (!element.maxAudit && element.minAudit) {
          element.kmin = element.kl;
          element.cpk = element.cpkLow;
        } else {
          element.kmin = '';
          element.cpk = '';
        }

      })

      console.log(this.lstAuditCriteriaParam);

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
    return Math.sqrt(total / (count - 1)).toFixed(4);
  }

  checkKu(maxAudit: any, avg: any, s: any) {
    if (maxAudit && Number(maxAudit) != 0) {
      return ((maxAudit - avg) / s).toFixed(4);
    } else {
      return '';
    }
  }

  checkKl(minAudit: any, avg: any, s: any) {
    if (minAudit && Number(minAudit) != 0) {
      return ((avg - minAudit) / s).toFixed(4);
    } else {
      return '';
    }
  }

  checkCpkUp(maxAudit: any, avg: any, s: any) {
    if (maxAudit && Number(maxAudit) != 0) {
      return ((maxAudit - avg) / (3 * s)).toFixed(4);
    } else {
      return '';
    }
  }


  checkCpkLow(minAudit: any, avg: any, s: any) {
    if (minAudit && Number(minAudit) != 0) {
      return ((avg - minAudit) / (3 * s)).toFixed(4);
    } else {
      return '';
    }
  }


  delete(ids: any) {
    this.lstCheck?.forEach((element, index) => {
      if (element.id == ids) {
        this.photoelectricService.delete(ids).subscribe(
          data => {
            Swal.fire(
              'Xóa',
              'Bạn đã thực hiện xóa thông tin kiểm tra thành công.',
              'success'
            )
            this.lstCheck?.splice(index, 1);
          },
          error => { }
        )
      }
    });
  }

  open(content: any, ids: any) {

    if (ids) {
      this.photoelectricService.detail(ids).subscribe(
        data => {
          this.lstAuditCriteriaParam = data.photoelectricDTO.lstParam;
          this.lstAuditCriteriaLKDT = data.photoelectricDTO.lstLkdt;
          this.lstAuditCriteriaLKDT.forEach(element => {
            element.auditQuantity = element.quantity
          })
        },
        error => { }
      )
    } else {
      this.lstAuditCriteriaParam = [];
      this.lstAuditCriteriaLKDT = [];
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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

}
