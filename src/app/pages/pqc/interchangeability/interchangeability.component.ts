import { Observable, startWith, map, firstValueFrom } from 'rxjs';
import { FormControl, FormBuilder } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { PQCService } from 'src/app/share/_services/pqc.service';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Utils from 'src/app/share/_utils/utils';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { InterchangeabilityService } from 'src/app/share/_services/interchangeability.service';
import { ScadaRequestService } from 'src/app/share/_services/scada-request.service';
import { Interchangeability } from 'src/app/share/_models/interchangeability.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { AuthService } from 'src/app/share/_services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interchangeability',
  templateUrl: './interchangeability.component.html',
  styleUrls: ['./interchangeability.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InterchangeabilityComponent implements OnInit {
  // bản test
  address = environment.api_end_point;
  // hệ thống
  //address = 'http://192.168.68.92/qms';
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
    private interchangeabilityService: InterchangeabilityService,
    private scadaService: ScadaRequestService,
    private _formBuilder: FormBuilder,
    protected autoLogout: AuthService,
    protected http: HttpClient,
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstInterchangeabilityompCheck: Interchangeability[] = [];
  lstInterchangeabilityCompCheckResponse: Interchangeability[] = [];

  lstProductionLine?: any[] = [];
  lstLine: Line[] = [];

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions?: Observable<string[]>;



  formSearch: any = {};
  formEx: any = {};
  form: any = {};
  formErrorChild: any = {
    errGroup: null,
    errName: null,
    quantity: null,
    ratio: null,
  };
  public bankCtrl: FormControl = new FormControl();
  public bankFilterCtrl: FormControl = new FormControl();

  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.getInfo();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );


  }

  private _filter(value: string): string[] {
    const filterValue = (value ?? "").toLowerCase();
    return this.options?.filter(option => (option ?? "").toLowerCase().includes(filterValue));
  }


  async getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
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
          this.lstErrorGr = data.lstError;
          console.log(this.lstErrorRes);
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

    if (this.show_check == 'SHOW') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      type = 'show';
      this.show_work_order = false;
    }

    if (id) {
      this.http.get<any>(`${this.address}/pqc-interchangeability-check/${id}`).subscribe(lstInter => {

        // this.pqcService.getDetailPqcWorkOrder(id).subscribe((data) => {
        // this.form = data.pqcWorkOrder;
        this.lstInterchangeabilityCompCheckResponse = lstInter.sort((a: any, b: any) => a.checkTime - b.checkTime);
        if (this.lstInterchangeabilityCompCheckResponse != null)
          this.lstInterchangeabilityCompCheckResponse.forEach((element) => {
            var check = new Interchangeability();

            check.elecMax = element.elecMax;
            check.elecMin = element.elecMin;
            check.externalInspection = element.externalInspection;
            check.fiMax = element.fiMax;
            check.fiMin = element.fiMin;
            check.powMax = element.powMax;
            check.powMin = element.powMin;
            check.total = element.total;
            check.line = element.line;
            check.checkPerson = element.checkPerson;
            check.checkTime = element.checkTime;
            check.createdAt = element.createdAt;
            check.updatedAt = element.updatedAt;
            check.quatity = element.quatity;
            check.conclude = element.conclude;
            check.note = element.note;
            check.ids = Utils.randomString(5);
            check.id = element.id;
            this.lstInterchangeabilityompCheck.push(check);
          });
        setTimeout(() => {
          this.lstInterchangeabilityompCheck.sort((a: any, b: any) => a.checkTime - b.checkTime);
        }, 300);
        console.log('check data lst inter :: ', this.lstInterchangeabilityCompCheckResponse)
        // });
      })
    }


    if (type == 'add') {
      let dataLine = await firstValueFrom(this.scadaService.getLine());
      this.lstProductionLine = dataLine.lstLine;
      this.lstProductionLine?.forEach(({ name, code }) => {
        this.options.push(`${name} - ${code}`);
      })
      console.log(this.lstProductionLine);

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
        this.lstInterchangeabilityompCheck,
        'INTERCHANGEABILITY',
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
    // console.log(this.formEx);
    const {
      id,
      checkPerson,
      checkTime,
      conclude,
      elecMax,
      elecMin,
      errTotal,
      externalInspection,
      fiMax,
      fiMin,
      line,
      machineName,
      note,
      powMax,
      powMin,
      quatity,
      total,
      operators,
      createdAt
    } = this.formEx;

    var check = new Interchangeability();
    check.elecMax = elecMax;
    check.elecMin = elecMin;
    check.externalInspection = externalInspection;
    check.fiMax = fiMax;
    check.fiMin = fiMin;
    check.powMax = powMax;
    check.powMin = powMin;
    check.total = total;
    check.line = line;
    check.checkPerson = checkPerson;
    check.checkTime = checkTime;
    check.createdAt = createdAt;
    check.updatedAt = new Date();
    check.quatity = quatity;
    check.conclude = conclude;
    check.workOrderId = this.actRoute.snapshot.params['id'];
    check.note = note;
    check.operators = operators
    check.id = id;
    this.interchangeabilityService.createUpdate(check).toPromise().then(
      data => {
        if (id) {
          Swal.fire(
            'Thành công',
            'Bạn đã thực hiện cập nhật thông tin kiểm tra thành công.',
            'success'
          )
        } else {
          Swal.fire(
            'Thêm mới thông tin',
            'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
            'success'
          )
          check.ids = Utils.randomString(5);
          check.id = data.id;
          this.lstInterchangeabilityompCheck.push(check);
        }
        this.modalService.dismissAll();

      },
      error => { }
    )


    console.log(check);
  }

  deleteCheck(id: any) {
    console.log(id);
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn tiếp tục thực hiện xóa thông tin kiểm tra không ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {
        this.lstInterchangeabilityompCheck?.forEach((element, index) => {
          if (element.ids == id) {
            this.interchangeabilityService.remove(element.id).subscribe(
              data => {
                Swal.fire(
                  'Thông báo',
                  'Bạn đã thực hiện xóa thành công.',
                  'success'
                )
                this.lstInterchangeabilityompCheck?.splice(index, 1);
              },
              error => { }
            )
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })



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

  totalCheckElement = 0;
  open(content: any, idError: any) {
    const showPopup = () => this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    if (idError == null) return showPopup();

    this.formEx = {};
    this.formEx.checkPerson = this.tokenStorage.getUsername();
    this.formEx.checkTime = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en_US');
    this.onEditCheck(idError);
    let found = this.lstInterchangeabilityompCheck?.find((element) => (element.ids == idError));
    this.formEx.id = found?.id;
    this.formEx.createdAt = found?.createdAt;
    console.log(this.formEx)
    this.totalCheckElement = Number(found?.quatity);

    return showPopup();
  }


  editId: any;
  onEditCheck(id: any) {
    this.editId = id;
    this.lstInterchangeabilityompCheck?.forEach(
      (element) => {
        if (element.ids == id) {
          this.formEx.line = element.line;
          this.formEx.quatity = element.quatity;
          this.formEx.conclude = element.conclude;
          this.formEx.elecMax = element.elecMax;
          this.formEx.elecMin = element.elecMin;
          this.formEx.fiMax = element.fiMax;
          this.formEx.fiMin = element.fiMin;
          this.formEx.externalInspection = element.externalInspection;
          this.formEx.lot = element.lot;
          this.formEx.powMax = element.powMax;
          this.formEx.powMin = element.powMin;
          this.formEx.total = element.total;
          this.formEx.note = element.note;
          this.formEx.operators = element.operators;

        }
      }
    )
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

export interface Line {
  name: string;
  code: string;
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().includes(filterValue));
};
