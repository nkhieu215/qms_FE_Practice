import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/share/_services/common.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-button-success',
  templateUrl: './button-success.component.html',
  styleUrls: ['./button-success.component.css']
})
export class ButtonSuccessComponent implements OnInit {

  constructor(
    private actRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private http: HttpClient,
  ) { }
  // bản test
  address = environment.api_end_point;
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  @Input() item_type = '';
  @Input() show_work_order = '';
  strNameTitle?: string;
  strUrl?: string;
  showButtonSuccess?: boolean = false;
  @Input() checkDAQ: boolean = false;
  ngOnInit(): void {
    var type = this.actRoute.snapshot.params['type'];
    setTimeout(() => {
      this.checkDAQ = sessionStorage.getItem('daq') === 'true' ? true : false;
    }, 1000);
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

  onSubmitWithCondition(type: any) {
    this.http.get<any>(`${this.address}/pqc-wo/${this.actRoute.snapshot.params['id']}`).subscribe(result => {
      console.log(`check data wo :::::::::: ${sessionStorage.getItem('sapWo')}-${result[0][1]}`)
      this.http.get<any>(`${this.address}/api/v1/infodaq/product-tests/lot/${sessionStorage.getItem('sapWo')}-${result[0][1]}`).subscribe(res => {
        console.log('check data infoDAQ :::::::::: ', res)
        if (res.length === 0) {
          Swal.fire({
            title: 'Thông báo',
            text: 'Chưa có kết quả kiểm tra DAQ ?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Đóng',
          })
        } else {
          this.commonService.statusStep(this.actRoute.snapshot.params['id']).toPromise().then(
            data => {
              const result = data.lstStep.filter((x: any) => x.step != 'QC_CHECK'
                && x.step != 'PHOTOELECTRIC_PRODUCT'
                && x.step != 'PHOTOELECTRIC'
                && x.step != 'APPROVE_STORE'
                && x.step != 'STORE_CHECK'
                && x.step != 'SAP_STORE'
                && x.step != 'PRINT_SERIAL').filter((y: any) => y.status !== 'SUCCESS');
              if (result.length > 0) {
                Swal.fire({
                  title: 'Thông báo',
                  text: 'Còn công đoạn chưa hoàn thành ?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Tiếp tục',
                })
              } else {
                Swal.fire({
                  title: 'Xác nhận',
                  text: 'Bạn có muốn tiếp tục thực hiện hoàn thành quá trình kiểm tra ? ',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Đồng ý',
                  cancelButtonText: 'Hủy'
                }).then((result) => {
                  if (result.value) {
                    // console.log(data.lstStep)
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
                          this.http.post<any>(`${this.address}/pqc-wo/update-daq/${this.actRoute.snapshot.params['id']}`, this.checkDAQ).subscribe();
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
            },
            error => {
            }
          );
        }
      });
    });
  }
  onSubmit(type: any) {
    if (this.item_type === 'STORE_CHECK') {
      this.commonService.statusStep(this.actRoute.snapshot.params['id']).toPromise().then(
        data => {
          const result = data.lstStep.filter((x: any) => x.step != 'QC_CHECK'
            && x.step != 'PHOTOELECTRIC_PRODUCT'
            && x.step != 'PHOTOELECTRIC'
            && x.step != 'APPROVE_STORE'
            && x.step != 'STORE_CHECK'
            && x.step != 'SAP_STORE'
            && x.step != 'PRINT_SERIAL').filter((y: any) => y.status !== 'SUCCESS');
          if (result.length > 0) {
            Swal.fire({
              title: 'Thông báo',
              text: 'Còn công đoạn chưa hoàn thành ?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Tiếp tục',
            })
          } else {
            Swal.fire({
              title: 'Xác nhận',
              text: 'Bạn có muốn tiếp tục thực hiện hoàn thành quá trình kiểm tra ? ',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Đồng ý',
              cancelButtonText: 'Hủy'
            }).then((result) => {
              if (result.value) {
                // console.log(data.lstStep)

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
                      this.http.post<any>(`${this.address}/pqc-wo/update-daq/${this.actRoute.snapshot.params['id']}`, this.checkDAQ).subscribe();
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
        },
        error => {
        }
      );
    } else {
      Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có muốn tiếp tục thực hiện hoàn thành quá trình kiểm tra ? ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.value) {
          // console.log(data.lstStep)
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
}
