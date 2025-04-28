
import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ActivatedRoute } from '@angular/router';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import Utils from 'src/app/share/_utils/utils';
import Swal from 'sweetalert2';
import { PQCFixErrService } from 'src/app/share/_services/pqcFixErr.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { CommonService } from 'src/app/share/_services/common.service';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { FixError } from 'src/app/share/_models/fix_error.model';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
import { FormControl } from '@angular/forms';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/share/_services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fix-error',
  templateUrl: './fix-error.component.html',
  styleUrls: ['./fix-error.component.css'],
})
export class FixErrorComponent implements OnInit {
  // bản test
  address = environment.api_end_point;
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  @Input() show_check = '';
  @Input() woData: any;
  idWorkOrder?: string;
  show_work_order = true;
  lstProcess?: any[];
  errorNameForm = new FormControl('');
  filteredError?: Observable<string[]>;
  wo: any;
  lstview = true;
  crud = false;
  create = false;
  edit = false;
  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private modalService: NgbModal,
    private tokenStorage: KeycloakService,
    private fixErrorService: PQCFixErrService,
    private errorService: ErrorListService,
    private commonservice: CommonService,
    protected autoLogout: AuthService,
    protected http: HttpClient,
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
  };

  formEx: any = {
  };

  form: any = {};

  formErrorChild: any = {};
  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.getInfo();
  }

  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
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

      // Sử dụng forkJoin để thực hiện các yêu cầu song song
      forkJoin({
        settingProcess: this.commonservice.getSettingProcess(),
        errorCategories: this.errorService.getAllCategories()
      }).subscribe(
        ({ settingProcess, errorCategories }) => {
          this.lstProcess = settingProcess.lstSettingProcess;
          this.lstErrorRes = errorCategories;
          this.lstErrorGr = errorCategories.lstError;
          console.log(this.lstErrorRes);
        },
        (err) => {
          console.error('Error fetching data:', err);
        }
      );
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

    if (this.show_check === 'SHOW') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      type = 'show';
      this.show_work_order = false;
    }

    if (type === 'add' || type === 'show' || type === 'edit') {
      console.log('wo ::', this.wo);

      if (!this.wo) {
        // Gọi API để lấy danh sách lỗi
        this.http.get<any>(`${this.address}/fix-error/${id}`).subscribe(
          (lstFixErr) => {
            console.log('check data FIX ERROR :: ', lstFixErr);
            this.lstErrorFix = lstFixErr.sort((a: any, b: any) => a.checkTime - b.checkTime);
            this.lstErrorFix.forEach((element) => {
              element.ids = Utils.randomString(5);
            });
          },
          (err) => {
            console.error('Error fetching fix-error data:', err);
          }
        );
      } else {
        this.form = this.wo.pqcWorkOrder;
        this.lstErrorFix = this.wo.pqcWorkOrder.lstFixErr;
        this.lstErrorFix.forEach((element) => {
          element.ids = Utils.randomString(5);
        });
      }

      // Xử lý bộ lọc lỗi
      this.filteredError = this.errorNameForm.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterError(value || ''))
      );
    }
  }


  // crud

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };

  error = '';
  onSubmit(action: any) {
    console.log(this.formEx);
    this.pqcService
      .addStep(
        this.lstErrorFix,
        'FIX_ERR',
        this.actRoute.snapshot.params['id'],
        action
      )
      .toPromise()
      .then(
        (data) => {
          this.edit = false;
          this.create = false;
          alert('Thêm mới thông tin kiểm tra thành công');
        },
        (err) => { }
      );
  }

  lstErrorFix: FixError[] = [];
  onAddError() {
    const { quantity, quantityErr, errGr, errName, serial, ratio, note, lotNumber, conclude, materials, stage } = this.formEx;

    var check = new FixError();
    check.errGr = errGr;
    check.errName = errName;
    check.lotNumber = lotNumber;
    check.note = note;
    check.quantity = quantity;
    check.ratio = ratio;
    check.serial = serial;
    check.conclude = conclude;
    check.quantityErr = quantityErr;
    check.workOrderId = this.idWorkOrder;
    check.userId = this.tokenStorage.getUsername();
    check.materials = materials;
    check.stage = stage;

    check.ids = Utils.randomString(5);
    this.fixErrorService.createUpdate(check).toPromise().then((data) => {
      Swal.fire(
        'Thành công',
        'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
        'success'
      )
      this.modalService.dismissAll();
      check.id = data.id;
      this.lstErrorFix.push(check);
      this.formEx = {};
    },
      (error) => { })
  }

  deleteCheck(id: any) {
    console.log(id);
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn tiếp tục thực hiện xóa',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {
        this.lstErrorFix?.forEach((element, index) => {
          if (element.ids == id) {
            this.fixErrorService.delete(element.id).toPromise().then((data) => {
              Swal.fire(
                'Thành công',
                'Bạn đã thực xóa thông tin kiểm tra thành công.',
                'success'
              )
              this.lstErrorFix?.splice(index, 1);
            },
              (error) => { })
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  editId: any;
  editCheck(id: any) {
    this.editId = id;
    this.lstErrorFix?.forEach((element) => {
      if (element.ids == id) {
        this.formEx.errGr = element.errGr;
        this.formEx.errName = element.errName;
        this.formEx.lotNumber = element.lotNumber;
        this.formEx.quantity = element.quantity;
        this.formEx.ratio = element.ratio;
        this.formEx.serial = element.serial;
        this.formEx.conclude = element.conclude;
        this.formEx.quantityErr = element.quantityErr;
        this.formEx.note = element.note;
        this.formEx.id = element.id;
        this.formEx.materials = element.materials;
        this.formEx.stage = element.stage;
      }
    });
  }

  onEditError() {
    this.lstErrorFix?.forEach((element) => {
      if (element.ids == this.editId) {
        element.errGr = this.formEx.errGr;
        element.errName = this.formEx.errName;
        element.lotNumber = this.formEx.lotNumber;
        element.quantity = this.formEx.quantity;
        element.ratio = this.formEx.ratio;
        element.serial = this.formEx.serial;
        element.conclude = this.formEx.conclude;
        element.quantityErr = this.formEx.quantityErr;
        element.note = this.formEx.note;
        element.id = this.formEx.id;
        element.materials = this.formEx.materials;
        element.stage = this.formEx.stage;

        this.fixErrorService.createUpdate(element).toPromise().then((data) => {
          Swal.fire(
            'Thành công',
            'Bạn đã thực hiện cập nhật thông tin kiểm tra thành công.',
            'success'
          )
          this.modalService.dismissAll();
          this.formEx = {};
        },
          (error) => { })


      }
    });
  }

  errorAdd = '';
  onChangeQuantityError(errorNumber: any) {
    if (this.totalCheckElement == null || this.totalCheckElement == 0) {
      this.errorAdd = 'Bạn chưa thực hiện nhập số lượng kiểm tra';
      this.formErrorChild.ratio = 0;
    } else {
      this.errorAdd = '';
      var number =
        (errorNumber /
          (this.totalCheckElement == 0 ? 1 : this.totalCheckElement)) *
        100;
      this.formErrorChild.ratio = number.toFixed(2) + '%';
    }
  }

  arrErrChild: Array<ErrorElectronicComponent> = [];
  onAddErrorChild() {
    const { errGroup, errName, quantity } = this.formErrorChild;
    var errGrname = null;
    this.lstErrorGr?.forEach((element) => {
      if (element.id == errGroup) {
        errGrname = element.name;
      } else {
        errGrname = '';
      }
    });

    var ratio =
      (
        (quantity /
          (this.totalCheckElement == 0 ? 1 : this.totalCheckElement)) *
        100
      ).toFixed(2) + '%';
    const errorChild = new ErrorElectronicComponent(
      errName,
      errGrname,
      quantity,
      ratio,
      Utils.randomString(5)
    );
    this.arrErrChild.push(errorChild);
  }

  onChangeErrorGroup(idx: any) {
    this.lstError = [];
    this.optionsError = [];
    this.formEx.errName = '';
    this.lstErrorGr?.forEach((element) => {
      if (element.name == idx) {
        this.lstError = element.errChild;

        // this.formErrorChild.errGroup = element.name;
      }
    });

    this.lstError.forEach(element => {
      this.optionsError.push(element.name)
    })


  }

  optionsError: string[] = [];
  private _filterError(value: string): string[] {
    const filterValue = (value ?? "").toLowerCase();
    return this.optionsError?.filter(option => (option ?? "").toLowerCase().includes(filterValue));
  }

  deleteErrorRow(ids: any) {
    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.arrErrChild.splice(index, 1);
      }
    });
  }

  totalCheckElement = 0;
  open(content: any, idError: any) {
    this.http.get<any>(`${this.address}/pqc-wo/${this.actRoute.snapshot.params['id']}`).subscribe(data => {

      this.formEx = {};
      console.log(idError);
      if (idError != '') {
        this.editCheck(idError);
      } else {
        this.formEx.lotNumber = data[0][1];
      }


      this.formEx.checkTime = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en_US');
      this.modalService.open(content, this.modalOptions).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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

  ratioCal() {
    var number =
      (this.formEx.quantityErr /
        (this.formEx.quantity == 0 ? 1 : this.formEx.quantity)) *
      100;
    this.formEx.ratio = number.toFixed(2) + '%';
  }

  changeWo(data: any) {
    this.wo = data;
    console.log("wo ::" + this.wo)
  }
}
