

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
@Component({
  selector: 'pqc-show-work-order',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {


  @Input() item_id = '';
  @Input() item_type = '';
  @Input() show_check = '';
  @Output() eventData =  new EventEmitter<any>();

  constructor(
    private pqcService: PQCService,
    private modalService: NgbModal,
    private scadaService: ScadaRequestService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private data:PqcDataService,
    private tokenStorage: KeycloakService,
  ) { }


  ngOnInit(): void {
    this.getInforWorkOrder();
  }

  form: any = {
  };
  getInforWorkOrder() {
    this.pqcService.getDetailPqcWorkOrder(this.item_id).toPromise().then((data) => {
      this.form = data.pqcWorkOrder;
      this.data.changeWo(data.pqcWorkOrder);
      console.log(this.form);
      this.eventData.emit(data.pqcWorkOrder);

      var type = this.actRoute.snapshot.params['type'];
      if(this.item_type != null && type =='add' && this.show_check !='SHOW'){
        this.pqcService.getStatusByStepAndWoId(this.item_id,this.item_type).subscribe(data=>{

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


          var statusStep = data.lstOrder[0].status
          console.log(statusStep);
          if(statusStep == 'SUCCESS'){
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

  scadaMacine?:any[];
  machine: any;
  open(content: any) {

   const id = this.actRoute.snapshot.params['id'];
    this.scadaService.getMachineByWoScada(id,'MACHINE').toPromise()
    .then(
      (data) => {
        console.log(data);
        this.scadaMacine = data.lstMachine;
      },
      (err) => { }
    );

    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }


  detailError(ids:any){

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

  exportExcelDetail(){
    this.pqcService.getDetailPqcWorkOrder(this.item_id).subscribe(
      data=>{
        let wo = data.pqcWorkOrder;
        let user= this.tokenStorage.getUsername();
        this.pqcService.report(this.item_id).subscribe(
          blob => saveAs(blob, user +  "_" + wo.workOrderId + "_" + wo.sapWo + "_"+formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx")
        )
      },
      error =>{}
      )
  }
}
