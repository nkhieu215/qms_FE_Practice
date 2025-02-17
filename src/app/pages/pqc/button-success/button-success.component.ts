import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/share/_services/common.service';
@Component({
  selector: 'app-button-success',
  templateUrl: './button-success.component.html',
  styleUrls: ['./button-success.component.css']
})
export class ButtonSuccessComponent implements OnInit {

  constructor(
    private actRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) { }

  @Input() item_type = '';
  @Input() show_work_order = '';
  strNameTitle?: string;
  strUrl?: string;
  showButtonSuccess?: boolean = false;

  ngOnInit(): void {
    var type = this.actRoute.snapshot.params['type'];
    if (type == 'add') {
      this.showButtonSuccess = true
    }
    console.log(type)
    switch (this.item_type) {
      case 'TIN':
        this.strNameTitle = 'Kiểm tra in kem thiếc';
        this.strUrl = '/pqc/pqc-tin-check';
        break;

      case 'NVL':
        this.strNameTitle = 'Kiểm tra nguyên vật liệu';
        this.strUrl = '/pqc/check-nvl';
        break;

      case 'CHECK_NVL':
        this.strNameTitle = 'Kiểm tra 100% nguyên vật liệu';
        this.strUrl = '/pqc/check-nvl-100';
        break;
      case 'MOUNT_COMPONENTS':
        this.strNameTitle = 'Gắn linh kiện';
        this.strUrl = '/pqc/mount-comp-check';
        break;
      case 'SOLDER':
        this.strNameTitle = 'Kiểm tra lò hàn';
        this.strUrl = '/pqc/pqc-solder-check';
        break;
      case 'INTERCHANGEABILITY':
        this.strNameTitle = 'Kiểm tra lắp lẫn';
        this.strUrl = '/pqc/pqc-interchangeability-check';
        break;

      case 'ASSEMBLES':
        this.strNameTitle = 'Kiểm tra quá trình lắp ráp SP';
        this.strUrl = '/pqc/pqc-assembles-check';
        break;
      case 'PHOTOELECTRIC':
        this.strNameTitle = 'Kiểm tra thông số quang điện cho SP';
        this.strUrl = '/pqc/photoelectric';
        break;
      case 'PHOTOELECTRIC_PRODUCT':
        this.strNameTitle = 'Kiểm tra thông số quang điện cho BTP';
        this.strUrl = '/pqc/photoelectric-product';
        break;
      case 'FIX_ERR':
        this.strNameTitle = 'Kiểm tra lỗi sửa lại';
        this.strUrl = '/pqc/fix-error';
        break;

      case 'STORE_CHECK':
        this.strNameTitle = 'Kiểm tra chi tiết nhập kho sx';
        this.strUrl = '/pqc/pqc-store-check';
        break;
      case 'QC_CHECK':
        this.strNameTitle = 'Mẫu đánh giá chất lượng sp';
        this.strUrl = '/pqc/pqc-qc-check';
        break;
      case 'APPROVE_STORE':
        this.strNameTitle = 'Duyệt nhập kho';
        this.strUrl = '/pqc/pqc-tin-check';
        break;
      case 'MAKE_ORDER':
        this.strNameTitle = 'Danh sách lệnh sản xuất';
        this.strUrl = '/pqc/make-order-production';
        break;
    }
  }

  onSubmit(type: any) {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn tiếp tục thực hiện hoàn thành quá trình kiểm tra ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {
        this.commonService.successStep(this.actRoute.snapshot.params['id'], this.item_type, type).toPromise().then(
          data => {
            console.log("check data", data);
            if (data.result.message == 'NULL') {
              Swal.fire(
                'Thất bại',
                'Công đoạn check NVL chưa hoàn thành',
                'warning'
              )
            } else {
              // console.log('check data: ', data);
              Swal.fire(
                'Thành công',
                'Bạn đã thực hiện thành công.',
                'success'
              )
            }
            this.router.navigate([this.strUrl])
          },
          error => {
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
}
