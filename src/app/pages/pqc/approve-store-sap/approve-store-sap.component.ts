
import { FormControl, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import Utils from 'src/app/share/_utils/utils';
import Swal from 'sweetalert2';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { Observable, startWith, map, firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/share/_services/common.service';
import { StoreCheckService } from 'src/app/share/_services/store_check.service';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { StepCheck } from '../aprove-quality-evaluation/aprove-quality-evaluation.component';
import { StoreCheck } from 'src/app/share/_models/storeCheck.model';
import { PQCPEndingOrderResponse } from 'src/app/share/response/pqcResponse/pqcPendingOrderResponse';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/share/_services/auth.service';

@Component({
  selector: 'app-approve-store-sap',
  templateUrl: './approve-store-sap.component.html',
  styleUrls: ['./approve-store-sap.component.css']
})
export class ApproveStoreSapComponent implements OnInit {
  show_work_order = true;
  approveId?: number;
  lstview = true;
  crud = false;
  approve = false;
  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router,
    private storeCheckService: StoreCheckService,
    protected autoLogout: AuthService
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstCheckStep?: string[] = []
  id?: any;
  dataApprove: any = {
  };
  formSearch: any = {

  }
  form: any = {
  };
  lstCheck: StepCheck[] = [];
  lstStoreCheck?: StoreCheck[] = [];
  lstStoreHis?: any[] = [];
  storeCheck?: any = {
  };

  lstBpGroupDTOS?: any[];
  lstKhoBhDTOS?: any[];
  lstOwhsDTOS?: any[];

  filteredKhoNhap?: Observable<Owhs[]>;
  filteredDoiTuong?: Observable<string[]>;
  filteredKhoBh?: Observable<KhoBH[]>;

  myControl = new FormControl('');
  khobhForm = new FormControl('');
  doituongForm = new FormControl('');
  optionsKhoBh: KhoBH[] = [];
  optionsOwhs: Owhs[] = [];
  optionsDoituong: string[] = [];

  ngOnInit(): void {
    this.autoLogout.autoLogout(0, 'approve store');
    this.approveId = this.actRoute.snapshot.params['approveId'];
    this.getInfo();

    this.filteredKhoNhap = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filteredKhoBh = this.khobhForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterKhoBH(value || '')),
    );

    this.filteredDoiTuong = this.doituongForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDoiTuong(value || '')),
    );

    if (this.actRoute.snapshot.params['type'] == 'add' || this.actRoute.snapshot.params['type'] == 'show') {
      // load check store
      this.storeCheckService
        .loadStoreCheckByWoId(this.actRoute.snapshot.params['id'])
        .toPromise()
        .then(
          (data) => {
            this.lstStoreCheck = data.lstCheck;
            this.lstStoreCheck?.forEach((element) => {
              element.ids = Utils.randomString(5);
              element.statusApproveSapStr = Utils.getStatusName(element.statusApproveSap);
            });
          },
          (error) => { }
        );
    }


  }

  private _filter(value: string): any[] {
    const filterValue = (value ?? "").toLowerCase();
    return this.optionsOwhs?.filter(option => (option.whsName ?? "").toLowerCase().includes(filterValue));
  }

  private _filterKhoBH(value: string): any[] {
    const filterValue = (value ?? "").toLowerCase();
    return this.optionsKhoBh?.filter(option => (option.name ?? "").toLowerCase().includes(filterValue));
  }

  private _filterDoiTuong(value: string): any[] {
    const filterValue = (value ?? "").toLowerCase();
    return this.optionsDoituong?.filter(option => (option ?? "").toLowerCase().includes(filterValue));
  }

  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.id = id;
    const type = this.actRoute.snapshot.params['type'];
    if (id == null && type == null) {
      this.lstview = true;
      this.crud = false;
      this.refreshPage();
    }

    if (type == 'add' || type == 'show') {
      this.approve = true;
      this.lstview = false;
      this.commonService.statusStep(id).toPromise().then(
        data => {
          this.lstCheck = data.lstStep;
          this.lstCheck.forEach(element => {
            this.lstCheckStep?.push(element.step);
            element.checked = true;
          });
        },
        error => { }
      )

      this.storeCheckService.getDetailStoreCheck(this.id).subscribe(data => {
        this.storeCheck = data.storeCheck;
      })
    }

    if (type == 'show') {
      this.lstview = false;
      this.show_work_order = false;
    }
  }



  openShowHisSAP(content: any, id: any) {
    this.lstStoreHis = [];
    this.lstStoreCheck?.forEach((element) => {
      if (element.id == id) {
        var obj = JSON.parse(element.hisString);
        for (var i in obj)
          this.lstStoreHis?.push(obj[i]);
      }
    });

    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  openShowDetailStore(content: any, id: any) {
    this.lstStoreCheck?.forEach((element) => {
      if (element.id == id) {
        element.lstElectronic = [];
        element.lstErrorCheck = [];
        element.lstStructure = [];
        element.lstConfused = [];
        element.lstSafe = [];
        element.lstSize = [];
        element.lstExternal = [];

        this.storeCheckService.getLstCheckByStoreId('ELEC', id).toPromise().then((data) => {
          element.lstElectronic = data.lstElectric;
        })

        this.storeCheckService.getLstCheckByStoreId('ERROR', id).toPromise().then((data) => {
          element.lstErrorCheck = data.lstCheckErrs;
        })

        this.storeCheckService.getLstCheckByStoreId('STRUCTURE', id).toPromise().then((data) => {
          element.lstStructure = data.lstStructures;
        })

        this.storeCheckService.getLstCheckByStoreId('CONFUSED', id).toPromise().then((data) => {
          element.lstConfused = data.lstConfuseds;
        })

        this.storeCheckService.getLstCheckByStoreId('SAFE', id).toPromise().then((data) => {
          element.lstSafe = data.lstStoreSafe;
        })

        this.storeCheckService.getLstCheckByStoreId('SIZE', id).toPromise().then((data) => {
          element.lstSize = data.lstSize;
        })

        this.storeCheckService.getLstCheckByStoreId('EXTER', id).toPromise().then((data) => {
          element.lstExternal = data.lsCheckExternalInspections;
        })

        this.storeCheck = element;
      }
    });


    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }


  open(content: any, id: any, storeId: any) {

    this.id = id;
    this.approveId = storeId;
    this.form = {};
    this.storeCheckService.getCommonSapApprove().subscribe(data => {
      this.lstBpGroupDTOS = data.lstBpGroupDTOS;
      this.lstBpGroupDTOS?.forEach(element => {
        this.optionsDoituong.push(`${element.name}`);
      });
      this.optionsKhoBh = data.lstKhoBhDTOS
      this.optionsOwhs = data.lstOwhsDTOS
      this.form.dateApproveSap = new Date();
      // console.log(this.optionsKhoBh);
    })



    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  changeWo(data: any) {
    // this.wo
  }

  refreshPage() {
    const { name, code, lot, startDate, endDate, sap, woCode, status, branchName, groupName } = this.formSearch;
    this.pqcService.getApproveStoreSap(this.page, this.pageSize, name, code, lot, "", startDate, endDate, sap, woCode, "WAIT", branchName, groupName).subscribe(
      data => {
        var productionLst = new PQCPEndingOrderResponse();
        productionLst = data;

        this.lstWorkOrder = productionLst.lstOrder;
        this.lstWorkOrder?.forEach(element => {
          element.strStatus = Utils.getStatusName(element.statusApproveSap);
        })

        this.collectionSize = Number(productionLst?.total) * this.pageSize;
      },
      err => {

      }
    );
  }


  note?: any;

  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  closeResult: string = '';
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onApprove(approve: any) {

    // console.log(this.dataApprove);
    this.dataApprove.storeId = this.approveId;
    this.dataApprove.action = approve;
    this.dataApprove.id = this.id;
    this.dataApprove.note = this.form.note;
    this.dataApprove.dateApproveSap = this.form.dateApproveSap;
    this.dataApprove.quantityStoreSap = this.form.quantityStoreSap;
    this.storeCheckService.sendApproveStore(this.dataApprove).subscribe(data => {
      if (data.result.ok) {
        Swal.fire("Thành công", "Bạn đã thực hiện nhập kho thành công", 'success');

      } else {
        Swal.fire("Thất bại", "Hệ thống đang bận vui lòng thử lại sau", 'warning');
      }
      this.modalService.dismissAll();
      // load check store
      this.storeCheckService
        .loadStoreCheckByWoId(this.id)
        .toPromise()
        .then(
          (data) => {
            this.lstStoreCheck = data.lstCheck;
            this.lstStoreCheck?.forEach((element) => {
              element.ids = Utils.randomString(5);
              element.statusApproveSapStr = Utils.getStatusName(element.statusApproveSap);
            });
          },
          (error) => { }
        );
    })
  }

  setValueApprove(data: any, key: string) {
    this.dataApprove[key] = data;
  }
}

export interface Owhs {
  whsCode?: string;
  whsName?: string;
}

export interface KhoBH {
  code?: string;
  name?: string;
}

