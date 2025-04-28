import { async } from '@angular/core/testing';
import { FormControl, ValidatorFn } from '@angular/forms'
import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';
import {
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { ActivatedRoute } from '@angular/router';
import Utils from 'src/app/share/_utils/utils';
import { Observable, startWith, map, firstValueFrom, forkJoin } from 'rxjs';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { ScadaRequestService } from 'src/app/share/_services/scada-request.service';
import { PQCMountCheckService } from 'src/app/share/_services/pqcMountCheck.service';
import { MountCompCheck } from 'src/app/share/_models/mount_check.model';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
import { AuthService } from 'src/app/share/_services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mount-comp-check',
  templateUrl: './mount-comp-check.component.html',
  styleUrls: ['./mount-comp-check.component.css'],
})
export class MountCompCheckComponent implements OnInit {
  // bản test
  address = environment.api_end_point;
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  @Input() show_check = '';
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
    private scadaService: ScadaRequestService,
    private mountService: PQCMountCheckService,
    protected autoLogout: AuthService,
    protected http: HttpClient
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstmountCompCheck: MountCompCheck[] = [];
  lstmountCompCheckResponse: MountCompCheck[] = [];
  lstProductionLine: any[] = [];
  lstMachine: any[] = [];
  formSearch: any = {};
  options: string[] = [];
  optionsMachine: string[] = [];
  filteredOptions?: Observable<string[]>;
  filteredMachine?: Observable<string[]>;
  myControl = new FormControl('');
  maChineControl = new FormControl('');
  formEx: any = {};

  form: any = {};

  formErrorChild: any = {};

  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  show_work_order = true;
  idWorkOrder?: string;

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.form.checkTime = formatDate(new Date(), 'yyMMdd_HHmm', 'en_US');
    this.getInfo();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filteredMachine = this.maChineControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMachine(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = (value ?? "").toLowerCase();
    return this.options?.filter(option => (option ?? "").toLowerCase().includes(filterValue));
  }

  private _filterMachine(value: string): string[] {
    const filterValue = (value ?? "").toLowerCase();
    return this.optionsMachine?.filter(option => (option ?? "").toLowerCase().includes(filterValue));
  }

  async getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
    const type = this.actRoute.snapshot.params['type'];

    if (!id && !type) {
      this.lstview = true;
      this.crud = false;
      return;
    }

    console.log(id, type);

    if (type === 'add') {
      this.edit = false;
      this.create = true;
      this.lstview = false;

      // Gọi API để lấy danh sách lỗi
      this.errorService.getAllCategories().subscribe(
        (data) => {
          this.lstErrorRes = data;
          this.lstErrorGr = data.lstError;
          console.log(this.lstErrorRes);
        },
        (err) => {
          console.error('Error fetching error categories:', err);
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
      this.show_work_order = false;
    }

    if (!this.lstview) {
      // Sử dụng forkJoin để thực hiện các yêu cầu song song
      const requests: { lstMount: Observable<any>; dataMachine?: Observable<any>; dataLine?: Observable<any> } = {
        lstMount: this.http.get<any>(`${this.address}/mount/${id}`),
      };

      if (type === 'add') {
        requests['dataMachine'] = this.scadaService.getMachineName();
        requests['dataLine'] = this.scadaService.getLine();
      }

      forkJoin(requests).subscribe(
        ({ lstMount, dataMachine, dataLine }: any) => {
          // Xử lý dữ liệu lstMount
          this.lstmountCompCheck = lstMount.sort((a: any, b: any) => a.checkTime - b.checkTime);
          this.lstmountCompCheck.forEach((element) => {
            element.ids = Utils.randomString(5);
          });

          // Xử lý dữ liệu máy móc và dây chuyền (chỉ khi type === 'add')
          if (type === 'add') {
            this.lstMachine = dataMachine?.lstMachine || [];
            this.lstMachine.forEach(({ name, code }) => {
              this.optionsMachine.push(`${name} - ${code}`);
            });

            this.lstProductionLine = dataLine?.lstLine || [];
            this.lstProductionLine.forEach(({ name, code }) => {
              this.options.push(`${name} - ${code}`);
            });
          }
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
  };

  onSubmit(action: any) {
    this.pqcService
      .addStep(
        this.lstmountCompCheck,
        'MOUNT_COMPONENTS',
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

  onAddError() {
    const {
      batchId,
      line,
      checkPerson,
      checkTime,
      machineName,
      quatity,
      errTotal,
      conclude,
      note,
      dttdMountCompId,
      operators,
      createdAt
    } = this.formEx;

    var check = new MountCompCheck();
    check.batchId = batchId;
    check.line = line;
    check.checkPerson = checkPerson;
    check.checkTime = checkTime;
    check.createdAt = new Date();
    check.updatedAt = new Date();
    check.machineName = machineName;
    check.quatity = quatity;
    check.errTotal = errTotal;
    check.conclude = conclude;
    check.note = note;
    check.ids = Utils.randomString(5);
    check.workOrderId = this.actRoute.snapshot.params['id'];
    check.dttdMountCompId = dttdMountCompId;
    check.operators = operators;
    console.log('check data request :: ', check)
    this.mountService.createUpdate(check).toPromise().then(
      data => {
        if (check.dttdMountCompId) {
          Swal.fire(
            'Thêm mới thông tin',
            'Bạn đã thực hiện cập nhật thông tin kiểm tra thành công.',
            'success'
          )

        } else {
          Swal.fire(
            'Thêm mới thông tin',
            'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
            'success'
          )
          check.dttdMountCompId = data.idCheck;
          check.ids = Utils.randomString(5);
          this.lstmountCompCheck?.push(check);
        }

        this.modalService.dismissAll();
      },
      error => { }
    )
  }

  deleteCheck(id: any) {
    this.lstmountCompCheck?.forEach((element, index) => {
      if (element.ids == id) {
        this.mountService.delete(element.dttdMountCompId).toPromise().then(
          data => {
            Swal.fire(
              'Xóa thông tin',
              'Bạn đã thực hiện Xóa thành công.',
              'success'
            )
            this.lstmountCompCheck?.splice(index, 1);
          },
          error => { }
        )

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
  dttdCheckId: any;
  onAddErrorChild() {
    const { errGroup, errName, quantity } = this.formErrorChild;
    var ratio = ((quantity / (this.totalCheckElement == 0 ? 1 : this.totalCheckElement)) * 100).toFixed(2) + '%';
    const errorChild = new ErrorElectronicComponent(errName, errGroup, quantity, ratio, Utils.randomString(5));
    errorChild.dttdCheckId = this.dttdCheckId;

    this.mountService.addError(errorChild).toPromise().then(
      data => {
        Swal.fire(
          'Thông báo',
          'Bạn đã thực hiện thêm mới thông tin thành công.',
          'success'
        )

      },
      error => { }
    )

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

  deleteErrorRow(ids: any) {
    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.mountService.deleteError(element.id).toPromise().then(
          data => {
            this.arrErrChild.splice(index, 1);
            Swal.fire(
              'Thông báo',
              'Bạn đã thực hiện Xóa thông tin thành công.',
              'success'
            )
          }
        )
      }
    });
  }

  totalCheckElement = 0;
  open(content: any, idError: any) {
    this.formEx = {};
    console.log(idError, this.lstmountCompCheck);
    this.formEx.checkTime = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en_US');
    this.formEx.checkPerson = this.tokenStorage.getUsername();
    this.formErrorChild = [];
    if (idError != null) {
      this.lstmountCompCheck?.forEach((element) => {
        if (element.ids == idError) {
          this.dttdCheckId = element.dttdMountCompId;
          this.totalCheckElement = Number(element.quatity);
          this.formEx = element;
          if (element.dttdMountCompId != null) {
            this.mountService
              .getDetail(element.dttdMountCompId)
              .subscribe(
                (data) => {
                  this.arrErrChild = data.detail.lstError;
                  this.arrErrChild.forEach(element => {
                    element.ids = Utils.randomString(5);
                  })
                },
                (err) => { }
              );
          }
        }
      });
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

}
