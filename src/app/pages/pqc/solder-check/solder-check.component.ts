import { _filter } from './../interchangeability/interchangeability.component';
import { FormControl } from '@angular/forms';
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
import { Observable, startWith, map, firstValueFrom } from 'rxjs';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { ScadaRequestService } from 'src/app/share/_services/scada-request.service';
import { PQCSolderCheckService } from 'src/app/share/_services/pqcSolderCheck.service';
import { SolderCompCheck } from 'src/app/share/_models/solder_check.model';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
@Component({
  selector: 'app-solder-check',
  templateUrl: './solder-check.component.html',
  styleUrls: ['./solder-check.component.css'],
})
export class SolderCheckComponent implements OnInit {
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
    private scadaService: ScadaRequestService,
    private solderService: PQCSolderCheckService,
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstSolderCompCheck?: SolderCompCheck[] = [];
  lstSolderCompCheckResponse: SolderCompCheck[] = [];
  lstMachine2: any[] = [];
  lstProductionLine: any[] = [];
  formSearch: any = {
    name: null,
    code: null,
    lot: null,
  };

  formEx: any = {};

  form: any = {};
  options: string[] = [];
  optionsMachine: string[] = [];
  filteredOptions?: Observable<string[]>;
  filteredMachine?: Observable<string[]>;
  myControl = new FormControl('');
  maChineControl = new FormControl('');
  formErrorChild: any = {};
  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  ngOnInit(): void {
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

    if (type =="add") {
      // this.scadaService.getMachineName().toPromise().then(dataMachine=>{
      //   this.lstMachine2 = dataMachine.lstMachine2
      //   this.lstMachine2?.forEach(({ name, code }) => {
      //     this.optionsMachine.push(`${name} - ${code}`);
      //   })
      //   console.log( this.lstMachine2 )
      // }, error=>{})

      let dataMachine = await firstValueFrom(this.scadaService.getMachineName());
      this.lstMachine2 = dataMachine.lstMachine;
      this.lstMachine2?.forEach(({ name, code }) => {
        this.optionsMachine.push(`${name} - ${code}`);
      })

      let dataLine = await firstValueFrom(this.scadaService.getLine());
      this.lstProductionLine = dataLine.lstLine;
      this.lstProductionLine?.forEach(({ name, code }) => {
        this.options.push(`${name} - ${code}`);
      })


      // this.scadaService.getLine().toPromise().then(data => {
      //   this.lstProductionLine = data.lstLine
      // }, error => { })

    }


    this.idWorkOrder = id;
    if (this.show_check == 'SHOW') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      type = 'show';
      this.show_work_order = false;
    }

    this.pqcService.getDetailPqcWorkOrder(id).subscribe((data) => {
      this.form = data.pqcWorkOrder;
      this.lstSolderCompCheckResponse = data.pqcWorkOrder.lstSolder;
      this.lstSolderCompCheckResponse.forEach((element) => {
        var check = new SolderCompCheck();
        check.batchId = element.batchId;
        check.line = element.line;
        check.checkPerson = element.checkPerson;
        check.checkTime = element.checkTime;
        check.machineName = element.machineName;
        check.quatity = element.quatity;
        check.errTotal = element.errTotal;
        check.conclude = element.conclude;
        check.note = element.note;
        check.operators = element.operators;
        check.ids = Utils.randomString(5);
        check.dttdSolderCheckId = element.dttdSolderCheckId;
        this.lstSolderCompCheck?.push(check);
      });
    });
  }

  // crud

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };

  error = '';
  onSubmit(action: any) {
    console.log(this.formEx);
    this.pqcService.addStep(this.lstSolderCompCheck, 'SOLDER', this.actRoute.snapshot.params['id'], action)
      .toPromise().then(
        (data) => {
          Swal.fire(
            'Thêm mới thông tin',
            'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
            'success'
          )
          this.edit = false;
          this.create = false;
        },
        (err) => { }
      );
  }

  onAddUpdateCheck() {
    const { batchId, line, checkPerson, checkTime, machineName, quatity, errTotal, conclude, note, dttdSolderCheckId, operators } = this.formEx;
    var check = new SolderCompCheck();
    check.batchId = batchId;
    check.line = line,
    check.checkPerson = checkPerson,
    check.checkTime = checkTime,
    check.machineName = machineName,
    check.quatity = quatity;
    check.errTotal = errTotal;
    check.conclude = conclude;
    check.note = note;
    check.workOrderId = this.actRoute.snapshot.params['id'];
    check.dttdSolderCheckId = dttdSolderCheckId;
    check.operators = operators
    this.solderService.createUpdate(check).toPromise().then(
      data => {
        if (check.dttdSolderCheckId) {
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
          check.dttdSolderCheckId = data.idCheck;
          check.ids = Utils.randomString(5);
          this.lstSolderCompCheck?.push(check);
          console.log(this.lstSolderCompCheck);
        }

        console.log()
        this.modalService.dismissAll();
      },
      error => { }
    )
  }

  deleteCheck(id: any) {
    this.lstSolderCompCheck?.forEach((element, index) => {
      if (element.ids == id) {
        this.solderService.delete(element.dttdSolderCheckId).toPromise().then(
          data => {
            Swal.fire(
              'Xóa thông tin',
              'Bạn đã thực hiện Xóa thành công.',
              'success'
            )
            this.lstSolderCompCheck?.splice(index, 1);
          },
          error => { }
        )

      }
    });
  }

  editId: any;

  errorAdd = '';
  onChangeQuantityError(errorNumber: any, ids: any) {
    if (this.totalCheckElement == null || this.totalCheckElement == 0) {
      this.errorAdd = 'Bạn chưa thực hiện nhập số lượng kiểm tra';
      this.formErrorChild.ratio = 0;
    } else {
      this.errorAdd = '';
      var number =
        (errorNumber /
          (this.totalCheckElement == 0 ? 1 : this.totalCheckElement)) *
        100;
      this.totalCheckElement = this.totalCheckElement + errorNumber;
      this.formErrorChild.ratio = number.toFixed(2) + '%';
    }

    this.lstSolderCompCheck?.forEach((element) => {
      if ((element.ids = ids)) {
        element.errTotal = element.errTotal + errorNumber;
      }
    });
  }

  arrErrChild: Array<ErrorElectronicComponent> = [];
  dttdCheckId : any;
  onAddErrorChild() {

    const { errGroup, errName, quantity } = this.formErrorChild;
    var ratio = ((quantity / (this.totalCheckElement == 0 ? 1 : this.totalCheckElement)) * 100).toFixed(2) + '%';
    const errorChild = new ErrorElectronicComponent(errName, errGroup, quantity, ratio, Utils.randomString(5));
    errorChild.dttdCheckId =  this.dttdCheckId;

    this.solderService.addError(errorChild).toPromise().then(
      data=>{
        Swal.fire(
          'Thông báo',
          'Bạn đã thực hiện thêm mới thông tin thành công.',
          'success'
        )

      },
      error=>{}
    )

    this.arrErrChild.push(errorChild);
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
        this.solderService.deleteError(element.id).toPromise().then(
          data=>{
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
  idsError?: any;
  lstErrorMachine?: [] = [];
  open(content: any, idError: any, type: any) {
    this.formEx = {};
    this.idsError = idError;
    this.formEx.checkPerson = this.tokenStorage.getUsername();
    this.formEx.checkTime = formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US');
    this.formErrorChild = [];


    if (idError != null) {
      this.lstSolderCompCheck?.forEach((element) => {
        console.log(element.ids + '-' + idError)

        if (element.ids == idError) {
          this.dttdCheckId = element.dttdSolderCheckId;
          this.totalCheckElement = Number(element.quatity);
          this.formEx = element;

          if (element.dttdSolderCheckId != null) {
            this.solderService
              .getDetail(element.dttdSolderCheckId)
              .subscribe(
                (data) => {
                  this.arrErrChild = data.detail.lstError;
                  this.arrErrChild.forEach(element=>{
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
