import { _filter } from './../interchangeability/interchangeability.component';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map, firstValueFrom } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import {
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import Utils from 'src/app/share/_utils/utils';
import { ftruncate } from 'fs';
import Swal from 'sweetalert2';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { ScadaRequestService } from 'src/app/share/_services/scada-request.service';
import { PQCAssemblesCheckService } from 'src/app/share/_services/pqcAssembles.service';
import { CommonService } from 'src/app/share/_services/common.service';
import { AssemblesCheck } from 'src/app/share/_models/assembles_check.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';

@Component({
  selector: 'app-assembles',
  templateUrl: './assembles.component.html',
  styleUrls: ['./assembles.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssemblesComponent implements OnInit {
  @Input() show_check = '';
  idWorkOrder?: string;
  show_work_order = true;

  lstview = true;
  crud = false;
  create = false;
  edit = false;
  lstProcess?:any[];
  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private modalService: NgbModal,
    private tokenStorage: KeycloakService,
    private errorService: ErrorListService,
    private scadaService: ScadaRequestService,
    private assemblesCheckService: PQCAssemblesCheckService,
    private commonService : CommonService
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstAssemblesCompCheck?: AssemblesCheck[] = [];
  lstAssemblesCheckResponse: AssemblesCheck[] = [];
  lstProductionLine?: any[] = [];
  formSearch: any = {};
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions?: Observable<string[]>;
  formEx: any = {};

  form: any = {};

  formErrorChild: any = {};

  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  ngOnInit(): void {
    this.form.checkPerson = this.tokenStorage.getUsername();
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
      this.commonService.getSettingProcess().subscribe(data=>{
        this.lstProcess = data.lstSettingProcess;
      })

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


      let dataLine = await firstValueFrom(this.scadaService.getLine());
      this.lstProductionLine = dataLine.lstLine;
      this.lstProductionLine?.forEach(({ name, code }) => {
        this.options.push(`${name} - ${code}`);
      })
      console.log(this.lstProductionLine);



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


    if (type == 'add' || type == 'show' || type == 'edit') {
      this.pqcService.getDetailPqcWorkOrder(id).subscribe((data) => {
        this.form = data.pqcWorkOrder;
        this.lstAssemblesCheckResponse = data.pqcWorkOrder.lstAssembles;
        this.lstAssemblesCheckResponse.forEach((element) => {
          var check = new AssemblesCheck();

          check.line = element.line;
          check.checkPerson = element.checkPerson;
          check.processName = element.processName;
          check.quatity = element.quatity;
          check.quatityPass = element.quatityPass;
          check.quatityFail = element.quatityFail;
          check.ratio = element.ratio;
          check.conclude = element.conclude;
          check.checkTime = element.checkTime;
          check.note = element.note;
          check. operators = element.operators;
          check.ids = Utils.randomString(5);
          check.id = element.id;
          this.lstAssemblesCompCheck?.push(check);
        });
      });
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
        this.lstAssemblesCompCheck,
        'ASSEMBLES',
        this.actRoute.snapshot.params['id'], action
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
    const {operators, lotNumber, line, checkPerson, processName, quatityPass, quatity, quatityFail, conclude, note, checkTime, ratio,
    } = this.formEx;

    var check = new AssemblesCheck();
    check.id = this.formEx.id;
    check.lotNumber = lotNumber;
    check.line = line
    check.checkPerson = checkPerson
    check.processName = processName
    check.quatity = quatity
    check.quatityPass = quatityPass
    check.quatityFail = quatityFail
    check.ratio = ratio
    check.conclude = conclude
    check.checkTime = checkTime
    check.note = note;
    check.ids = Utils.randomString(5);
    check.workOrderId = this.actRoute.snapshot.params['id'];
    check.operators = operators

    this.assemblesCheckService.createUpdate(check).subscribe(
      data => {
        Swal.fire(
          'Thành công',
          'Bạn đã thực hiện thêm mới/cập nhật thông tin kiểm tra thành công.',
          'success'
        )

        check.id = data.idCheck;
        if(this.formEx.id == null){
          this.lstAssemblesCompCheck?.push(check);
        }
      },
      errot => { }
    )

    console.log(this.lstAssemblesCompCheck);
  }

  deleteCheck(id: any) {
    this.lstAssemblesCompCheck?.forEach((element, index) => {
      if (element.ids == id) {
        this.lstAssemblesCompCheck?.splice(index, 1);
        this.assemblesCheckService.delete(element.id).subscribe(
          data=>{
            Swal.fire(
              'Thành công',
              'Bạn đã thực hiện xóa thông tin kiểm tra thành công.',
              'success'
            )
          }
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

  onAddErrorChild() {
    const { serial,errGroup, errName, quantity } = this.formErrorChild;
    var errGrname = null;
    this.lstErrorGr?.forEach((element) => {
      if (element.id == errGroup) {
        errGrname = element.name;
      } else {
        errGrname = '';
      }
    });

    var ratio = ((quantity / (this.totalCheckElement == 0 ? 1 : this.totalCheckElement)) * 100 ).toFixed(2) + '%';
    const errorChild = new ErrorElectronicComponent(errName, errGroup, quantity, ratio, Utils.randomString(5));
    errorChild.dttdCheckId = this.dttdCheckId;
    errorChild.serial = serial;

    this.assemblesCheckService.addError(errorChild).subscribe(
      data=>{
        Swal.fire(
          'Thành công',
          'Bạn đã thực hiện cập nhật thông tin kiểm tra thành công.',
          'success'
        )
        this.arrErrChild.push(errorChild);
      },
      error=>{}
    )
  }

  onChangeErrorGroup(idx: any) {
    this.lstErrorGr?.forEach((element) => {
      if (element.name == idx) {
        this.lstError = element.errChild;
        // this.formErrorChild.errGroup = element.name;
      }
    });
  }

  deleteErrorRow(ids: any) {
    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.assemblesCheckService.deleteError(element.id).subscribe(
          data=>{
            Swal.fire(
              'Thành công',
              'Bạn đã thực hiệ xóa thông tin lỗi kiểm tra thành công.',
              'success'
            )
            this.arrErrChild.splice(index, 1);
          },
          error=>{}
        )

      }
    });
  }

  totalCheckElement = 0;
  dttdCheckId?:any
  open(content: any, idError: any) {
    this.formEx ={};
    this.formEx.checkTime = formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US');
    this.formEx.checkPerson = this.tokenStorage.getUsername();
    console.log(this.formEx.checkTime);

    this.formErrorChild = [];

    if (idError != null) {
      this.lstAssemblesCompCheck?.forEach((element) => {
        if (element.ids == idError) {
          this.arrErrChild = element.errorLists;
          this.totalCheckElement = Number(element.quatity);
          this.dttdCheckId = element.id;
          if (element.id != null) {
            this.assemblesCheckService
              .getDetail(element.id)
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



  openEdit(content: any, id: any) {
    this.formEx ={};
    this.lstAssemblesCompCheck?.forEach(element=>{
      if(id == element.id){
        this.formEx = element;
      }
    })

    console.log( this.formEx);

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

  calRatio() {
    var number =
      (this.formEx.quatityFail /
        (this.formEx.quatity == 0 ? 1 : this.formEx.quatity)) *
      100;
    this.formEx.ratio = number.toFixed(2) + '%';
  }
}
