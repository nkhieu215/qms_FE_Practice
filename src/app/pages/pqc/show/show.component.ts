

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Utils from 'src/app/share/_utils/utils';
import Swal from 'sweetalert2';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ScadaRequestService } from 'src/app/share/_services/scada-request.service';
import { PqcDataService } from 'src/app/share/_services/pqcDataService.service';
import { saveAs } from 'file-saver';
import { formatDate } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { ExportExcelService } from 'src/app/share/_services/export-excel.service';
import { AuthService } from 'src/app/share/_services/auth.service';
import { PortalHostDirective } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'pqc-show-work-order',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {
  // bản test
  address = environment.api_end_point;
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  checkPrint = '';
  checkType = '';
  @Input() item_id = '';
  @Input() item_type = '';
  @Input() show_check = '';
  @Output() eventData = new EventEmitter<any>();

  constructor(
    private pqcService: PQCService,
    private modalService: NgbModal,
    private scadaService: ScadaRequestService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private data: PqcDataService,
    private tokenStorage: KeycloakService,
    private exportExelService: ExportExcelService,
    protected autoLogout: AuthService,
    protected http: HttpClient
  ) { }


  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.checkPrint = this.actRoute.snapshot.params['print'];
    this.checkType = this.actRoute.snapshot.params['type'];
    this.getInforWorkOrder();
  }

  form: any = {
  };
  getInforWorkOrder() {
    // this.pqcService.getDetailPqcWorkOrder(this.item_id).toPromise().then((data) => {
    this.http.get<any>(`${this.address}/pqc-wo/info/${this.item_id}`).subscribe(data => {
      this.form = data;
      sessionStorage.setItem('workOrder', this.form.workOrderId)
      sessionStorage.setItem('daq', this.form.checkDaq)
      this.data.changeWo(data.pqcWorkOrder);
      console.log('check data show ::', this.form);
      this.eventData.emit(data.pqcWorkOrder);
      sessionStorage.setItem('sapWo', data.sapWo)
      var type = this.actRoute.snapshot.params['type'];
      if (this.item_type != null && type == 'add' && this.show_check != 'SHOW') {
        this.pqcService.getStatusByStepAndWoId(this.item_id, this.item_type).subscribe(data => {

          // if(data.lstOrder[0] == null){
          //   Swal.fire({
          //     title: 'Lỗi',
          //     text: 'Bạn không có quyền thực hiện yêu cầu này',
          //     icon: 'warning',
          //     showCancelButton: false,
          //     confirmButtonText: 'Đồng ý',
          //   }).then((result) => {
          //     this.router.navigate(['/'])
          //   })

          //   return;
          // }


          console.log('check showssss', data.lstOrder, this.item_id, this.item_type);
          var statusStep = data.lstOrder[0].status
          if (statusStep == 'SUCCESS') {
            Swal.fire({
              title: 'Lỗi',
              text: 'Bạn đã thực hiện gửi yêu cầu phê duyệt / yêu cầu đã được phê duyệt',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Đồng ý',
            }).then((result) => {
              this.router.navigate(['/'])
            })

          }
        })
      }

    });
  }

  scadaMacine?: any[];
  machine: any;
  open(content: any, cases: number) {
    const id = this.actRoute.snapshot.params['id'];
    if (cases === 1) {
      this.http.post<any>(`${this.address}/scada-quantity`, `${this.form.workOrderId}-${this.form.lotNumber}`).subscribe(res => {
        console.log('scada quantity', res);
        this.scadaMacine = res;
      })

    } else {
      this.scadaService.getMachineByWoScada(id, 'MACHINE').toPromise()
        .then(
          (data) => {
            console.log("scada:", data);
            this.scadaMacine = data.lstMachine;
          },
          (err) => { }
        );

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


  detailError(ids: any) {

  }


  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    keyboard: false,
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  exportExcelDetail() {
    let daqInfo: any[] = []
    this.http.get<any>(`${this.address}/pqc-wo/${this.actRoute.snapshot.params['id']}`).subscribe(result => {
      console.log(`check data wo :::::::::: ${sessionStorage.getItem('sapWo')}-${result[0][1]}`)
      this.http.get<any>(`${this.address}/api/v1/infodaq/product-tests/lot/${sessionStorage.getItem('sapWo')}-${result[0][1]}`).subscribe(res => {
        console.log('check data infoDAQ :::::::::: ', res)
        res.forEach((element: any) => {
          element.testData = JSON.parse(element.testData);
          if (daqInfo.length == 0) {
            const data = { type: element.typeTest, settings: element.testData.settings, data: [element] };
            daqInfo.push(data);
          } else {
            const check = daqInfo.find((x: any) => x.type == element.typeTest);
            if (check == null) {
              const data = { type: element.typeTest, settings: element.testData.settings, data: [element] };
              daqInfo.push(data);
            } else {
              check.data.push(element);
            }
          }
        })
        console.log('check data listDAQResultType :::::::::: ', daqInfo)
      })

      this.pqcService.getDetailPqcWorkOrder(this.item_id).subscribe(
        data => {
          let wo = data.pqcWorkOrder;
          let user = this.tokenStorage.getUsername();
          this.pqcService.report(this.item_id, daqInfo).subscribe(
            blob => saveAs(blob, user + "_" + wo.workOrderId + "_" + wo.sapWo + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx")
          )
        },
        error => { }
      )
    })
  }
  exportInfo() {
    let dataForExcel = [
      this.form.branchName,
      this.form.lotNumber,
      this.form.planingWorkOrderCode,
      this.form.workOrderId,
      this.form.quantityPlan,
      this.form.productionCode,
      this.form.productionName,
      this.form.sapWo,
      this.form.bomVersion,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]
    let reportData = {
      fileName: 'export_genQrCode_' + this.form.lotNumber,
      title: 'Thông tin kiểm tra',
      data: dataForExcel,
      headers: [
        "ProductionLine", "Lot", "PoCode", "PlanningCode", "NumberOfPlanning", "ItemCode", "ProductName", "SapWo", "Version",
        "TimeRecieved", "ReelID", "PartNumber", "Vendor", "QuantityOfPackage", "MFGDate", "ProductionShilt", "OpName", "Comments"
      ],
    };

    this.exportExelService.exportPrint(reportData);

  }
}
