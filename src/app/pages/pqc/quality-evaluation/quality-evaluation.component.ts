import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Utils from 'src/app/share/_utils/utils';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import Swal from 'sweetalert2';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { PQCQcCheckService } from 'src/app/share/_services/pqcQcCheck.service';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import { AuditCriteriaQuality } from 'src/app/share/_models/auditCriteriaQuality.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { PqcQuality } from 'src/app/share/_models/pqc_quality.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/share/_services/auth.service';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quality-evaluation',
  templateUrl: './quality-evaluation.component.html',
  styleUrls: ['./quality-evaluation.component.css']
})
export class QualityEvaluationComponent implements OnInit {
  // bản test
  address = environment.api_end_point;
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  path = 'api/testing-critical';
  listOfCriticalName: any;
  @Input() show_check = '';
  idWorkOrder?: string;
  show_work_order = true;
  // new var
  checked = false;
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
    private qcCheckService: PQCQcCheckService,
    protected http: HttpClient,
    protected autoLogout: AuthService
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  lstErrCheck: any = [];
  formSearch: any = {
    name: null,
    code: null,
    lot: null,
    sap: null
  };

  formEx: any = {
  };

  form: any = {};
  formErrorChild: any = {};
  id?: any;

  minLengthTerm = 3;
  minLengthElectronic = 6;
  selectExamination: any = '';
  selectedElectronic: any = '';
  strSelect: any = '';
  strSelectElec: any = '';
  searchExaminationCtrl = new FormControl();
  errorMsg!: string;
  isLoading = false;
  filteredExamination = new ExaminationResponse();
  lstAuditCriteriaParam: Array<AuditCriteriaQuality> = [];
  displayWith(value: any) {
    return value?.Title;
  }
  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    var data = { testingCriticalGroup: '', type: 'Đánh giá CL SP' }
    this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data).subscribe(res => {
      this.listOfCriticalName = res;
      //console.log('heello', this.listOfCriticalName)

    })
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
          this.exampleService.searchBycode(value, 3).pipe(
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

    this.getInfo();
  }

  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.id = id;
    var type = this.actRoute.snapshot.params['type'];

    if (!id && !type) {
      this.lstview = true;
      this.crud = false;
      return;
    }

    if (type === 'add') {
      this.edit = false;
      this.create = true;
      this.lstview = false;
    } else if (type === 'edit') {
      this.edit = true;
      this.create = false;
      this.lstview = false;
    } else if (type === 'show') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      this.show_work_order = false;
    }

    this.idWorkOrder = id;
    if (this.show_check === 'SHOW') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      type = 'show';
      this.show_work_order = false;
    }

    if (type === 'add' || type === 'show' || type === 'edit') {
      // Sử dụng forkJoin để thực hiện các yêu cầu song song
      forkJoin({
        lstPqcQcCheck: this.http.get<any>(`${this.address}/qc-check/${id}`),
      }).subscribe(
        ({ lstPqcQcCheck }) => {
          console.log('check data qc check ::: ', lstPqcQcCheck);

          // Xử lý dữ liệu từ API
          this.lstCheck = lstPqcQcCheck.sort((a: any, b: any) => a.checkTime - b.checkTime);
          this.lstCheck.forEach((element) => {
            element.ids = Utils.randomString(5);
            element.createdAtClient = element.createdAt;
            element.checked = element.checked === 'false' ? false : true;
          });
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }
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
    console.log(this.formEx);
    var data = this.lstCheck;
    this.pqcService
      .addStep(
        data,
        'QC_CHECK',
        this.actRoute.snapshot.params['id'],
        action
      )
      .toPromise()
      .then(
        (data) => {
          this.edit = false;
          this.create = false;
          alert('Thêm mới thông tin kiểm tra thành công');
          this.modalService.dismissAll();
        },
        (err) => { }
      );
  }

  onSelected() {
    console.log(this.selectExamination);
    this.strSelect = this.selectExamination.name + '(' + this.selectExamination.code + ')';
    this.lstAuditCriteriaParam = this.selectExamination.lstPqcCriteriaQualities;
    this.lstAuditCriteriaParam.forEach(element => {
      element.qualityId = element.id;
      element.id = '';
      element.conclude = "Đạt";
    })
  }

  lstCheck: PqcQuality[] = [];
  onAddCheck() {
    var pqc = new PqcQuality();
    pqc.checkPersion = this.tokenStorage.getUsername();
    pqc.conclude = this.formEx.conclude;
    pqc.createdAtClient = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en_US')
    pqc.note = this.formEx.note;
    pqc.quantity = this.formEx.quantity;
    pqc.workOrderId = this.id;
    pqc.lstCheck = this.lstAuditCriteriaParam;
    pqc.ids = Utils.randomString(5);
    pqc.id = this.formEx.id;
    pqc.createdAt = this.formEx.createdAt
    pqc.checked = `${this, this.checked}`
    console.log

    this.qcCheckService.createUpdate(pqc).subscribe(
      data => {
        Swal.fire(
          'Thành công',
          'Bạn đã thực hiện thêm mới/sửa thông tin kiểm tra thành công.',
          'success'
        )

        pqc.id = data.id;
        pqc.createdAtClient = new Date();
        if (this.formEx.id == null) {
          this.lstCheck.push(pqc);
        }
        this.modalService.dismissAll();
        this.getInfo();
      },
      error => { }
    )
    this.check = false;
  }

  onChangeErrorGroup(idx: any) {
    this.lstErrorGr?.forEach((element) => {
      if (element.id == idx) {
        this.lstError = element.errChild;
        // this.formErrorChild.errGroup = element.name;
      }
    });
  }

  titlemodal = '';
  action = '';

  check = false;
  openCheck() {
    this.check = true;
  }

  paramCheck: Array<AuditCriteriaQuality> = [];
  open(content: any, ids: any) {
    console.log(this.formEx)
    this.formEx = {};
    this.lstAuditCriteriaParam = [];
    if (ids) {
      this.lstCheck.forEach(element => {
        if (ids == element.ids) {
          this.qcCheckService.detail(element.id).subscribe(data => {
            this.paramCheck = data.pqcQualityDTO.lstCheck;

            this.lstAuditCriteriaParam = data.pqcQualityDTO.lstCheck;
            this.formEx = data.pqcQualityDTO
            if (this.formEx.checked === "true") {
              this.checked = true;
            } else {
              this.checked = false;
            }
          })
        }
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  totalQuantity() {
    var total = 0;
    this.lstAuditCriteriaParam.forEach(element => {
      total = total + Number(element.quantity);
    });
    this.formEx.quantity = total;
  }

  delete(ids: any) {
    this.lstCheck?.forEach((element, index) => {
      if (element.id == ids) {
        this.qcCheckService.delete(ids).subscribe(
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

  deleteCheckItem(data: any) {
    Swal.fire(
      'Xóa',
      'Bạn đã thực hiện xóa thông tin tiêu chí thành công.',
      'success'
    )
    if (data.id) {
      this.http.delete(`${this.address}/qc-check/delete-check/${data.id}`).subscribe()
      const index = this.lstAuditCriteriaParam.indexOf(data);
      console.log('check du lieu xoa', data);
      if (index > -1) {
        this.lstAuditCriteriaParam.splice(index, 1);
      }
    } else {

      const index = this.lstAuditCriteriaParam.indexOf(data);
      if (index > -1) {
        this.lstAuditCriteriaParam.splice(index, 1);
      }
    }
  }

  addItem() {
    let item = new AuditCriteriaQuality();
    this.lstAuditCriteriaParam.push(item);
  }
}
