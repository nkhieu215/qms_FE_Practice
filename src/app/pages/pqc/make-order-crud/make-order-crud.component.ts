
import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { PQCWOService } from 'src/app/share/_services/pqc_wo.service';
import { Citt1 } from 'src/app/share/response/pqcResponse/citt1';
import { UserDetail } from 'src/app/share/response/pqcResponse/userDetail';
import { PQCPEndingOrderResponse } from 'src/app/share/response/pqcResponse/pqcPendingOrderResponse';

@Component({
  selector: 'app-make-order-crud',
  templateUrl: './make-order-crud.component.html',
  styleUrls: ['./make-order-crud.component.css'],
})
export class MakeOrderProductCRUDComponent implements OnInit {
  constructor(
    private zone: NgZone, // <== added
    private router: Router,
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private pqcWoService:PQCWOService
  ) {}

  id = '';
  action = '';
  error?: string;
  classError?: string;

  lstOrderPending: any;
  bomversion: Citt1[] = [];
  lstUserDetail: UserDetail[] = [];
  isCreate: boolean = false;
  isCreateManual: boolean = false;

  form: any = {
  };

  ngOnInit(): void {
    this.getInfo();
  }

  onSubmit(event: any) {
    console.log(this.form);
    this.form.id = null;
    this.form.profileId = this.form.profile;
    this.form.profileCode =  this.form.profile;

    //
    let checkLstUser =  true;
    let congDoan = '';
    this.lstUserDetail.forEach(element=>{

      if(element.userName =='' || element.userName == null){
        if(congDoan ==''){
          congDoan = element.stageName +'';
        }else{
          congDoan = congDoan + ', '+ element.stageName;
        }

        checkLstUser = false;
      }
    })
    if(!checkLstUser){
      Swal.fire('Cảnh báo','Công đoạn ' + congDoan +' chưa có thông tin người thực hiện','warning');
      return;
    }

    console.log("lot:" + this.form.lotNumber)
    if(this.form.lotNumber == '' || this.lstUserDetail.length === 0 ||this.form.lotNumber ==null){
      Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn cần cập nhật thông tin số lô hoặc thông tin tài khoản kiểm tra để tiếp tục thực hiện ',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.value) {
          this.router.navigate([
            `/pqc/pending-order-production`,
            {},
          ]);
        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      })

    }else{
      this.pqcWoService
      .addNewProcuction(this.form, this.bomversion, this.lstUserDetail)
      .subscribe(
        (data) => {
          console.log(data.result.responseCode);
          if (data.result.responseCode == '00') {
            Swal.fire('Xác nhận','Thực hiện thêm mới lệnh SX thành công','success');
            this.router.navigate(['/pqc/make-order-production']);
          }
        },
        (err) => {}
      );
    }


  }

  getInfo() {
    this.id = this.actRoute.snapshot.params['id'];
    this.action = this.actRoute.snapshot.params['type'];
    if (this.action == 'add' && this.id != '0x0') {
      this.pqcService.getDetailOrder(this.id).subscribe(
        (data) => {
          console.log(data);
          var res = new PQCPEndingOrderResponse();
          res = data;
          this.form = data.planning;


          var datePipe = new DatePipe('en-US');
          this.form.startDate =datePipe.transform(this.form.startTime, 'dd/MM/yyyy');
          this.form.endDate =datePipe.transform(this.form.endTime, 'dd/MM/yyyy');
          //
          this.getBomVersion(this.form.productCode, this.form.bomVersion);
          this.getUserDetail();
        },
        (err) => {}
      );
      this.isCreate = true;
      this.isCreateManual = false;
    } else if (this.action == 'add' && this.id == '0x0') {
      this.isCreateManual = true;
      this.isCreate = false;
    } else {
    }
  }


  getBomVersion(prodCode: string, version: string) {
    this.pqcService.getDetailVersionByProdCode(prodCode, version).subscribe(
      (data) => {
        console.log(data);
        this.bomversion = data.coitt.lstCitt;

        this.bomversion.forEach((element) => {
          element.workOrderQuantity =
            Number(element.uquantity) * this.form.quantityPlan + '';
          element.versions = element.uversions;
        });
        this.form.udocURL = data.coitt.udocURL;
        this.form.udocURL2 = data.coitt.uDocURL2;

      },
      (err) => {}
    );
  }

  getUserDetail() {
    this.pqcService.getUserDetailByWorkOrder(this.form.woId).subscribe(
      (data) => {
        console.log(data);
        var pqcResponse = new PQCPEndingOrderResponse();
        pqcResponse = data;
        this.lstUserDetail = data.lstUserDetail;
      },
      (err) => {}
    );
  }

  buildFromData(data?: any) {}
}
