import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-testing-critical-group',
  templateUrl: './testing-critical-group.component.html',
  styleUrls: ['./testing-critical-group.component.css'],
  styles: [`
    .greenClass{
      background-color:#0AE40A;width: 75px;
      border-radius: 10px;
      margin: auto;}
    .redClass{
      background-color:#FF0000;width: 100px;
      border-radius: 10px;
      margin: auto;}
    `]
})
export class TestingCriticalGroupComponent {
  // bản test
  address = 'http://localhost:8449';
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  path = 'api/testing-critical';
  listOfCriticalGroup: any;
  listOfCriticalGroupOrigin: any;
  // biến check trùng
  check = false;
  //open popup thêm mới
  insertPopup = false;
  popupTitle = '';
  //phân trang
  @Input() testingCriticalGroup = '';
  @Input() username = '';
  @Input() status = '';
  @Input() itemPerPage = 10;

  pageNumber = 1;
  itemsPerPage = 10;
  // thông tin phân trang
  totalData = 0;
  nextPageBtn = false;
  lastPageBtn = false;
  backPageBtn = true;
  firstPageBtn = true;
  //Dữ liệu tìm kiếm
  body: {
    id: number
    testingCriticalGroup: string;
    username: string;
    status: string;
    createdAt: string;
    updateAt: string;
    itemPerPage: number;
    offSet: number;
    note: string
  } = {
      id: 0,
      testingCriticalGroup: '',
      username: '',
      createdAt: '',
      updateAt: ''
      , note: '',
      status: '',
      itemPerPage: this.itemPerPage,
      offSet: (this.pageNumber - 1) * this.itemPerPage,
    };
  // dữ liệu thêm mới/ update
  bodyInsert: {
    id: number | null
    testingCriticalGroup: string;
    username: string;
    status: string;
    createdAt: string;
    updateAt: string;
    itemPerPage: number;
    offSet: number;
    note: string
  } = {
      id: 0,
      testingCriticalGroup: '',
      username: '',
      createdAt: '',
      updateAt: ''
      , note: '',
      status: '',
      itemPerPage: this.itemPerPage,
      offSet: (this.pageNumber - 1) * this.itemPerPage,
    };
  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  constructor(
    protected http: HttpClient,
    private modalService: NgbModal,
  ) { }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  mappingBodySearchAndPagination(): void {
    this.body.testingCriticalGroup = this.testingCriticalGroup;
    this.body.username = this.username;
    this.body.status = this.status;
    this.body.itemPerPage = this.itemPerPage;
    this.body.offSet = (this.pageNumber - 1) * this.itemPerPage;
    console.log('body: ', this.body);
  }
  nextPage(): void {
    this.pageNumber++;
    this.mappingBodySearchAndPagination();
    this.backPageBtn = false;
    this.firstPageBtn = false;
    if (this.pageNumber === Math.floor(this.totalData / this.itemPerPage) + 1) {
      this.nextPageBtn = true;
    }
    this.getTestingCriticalGroupList();
  }
  lastPage(): void {
    this.pageNumber = Math.floor(this.totalData / this.itemPerPage) + 1;
    this.mappingBodySearchAndPagination();
    this.backPageBtn = false;
    this.firstPageBtn = false;
    this.lastPageBtn = true;
    this.nextPageBtn = true;
    this.getTestingCriticalGroupList();
  }
  backPage(): void {
    this.pageNumber--;
    this.mappingBodySearchAndPagination();
    this.nextPageBtn = false;
    this.lastPageBtn = false;
    if (this.pageNumber === 1) {
      this.backPageBtn = true;
      this.firstPageBtn = true;
    }
    this.getTestingCriticalGroupList();
  }
  firstPage(): void {
    this.pageNumber = 1;
    this.mappingBodySearchAndPagination();
    this.nextPageBtn = false;
    this.lastPageBtn = false;
    this.backPageBtn = true;
    this.firstPageBtn = true;
    this.getTestingCriticalGroupList();
  }
  findFucntion(): void {
    this.mappingBodySearchAndPagination();
    setTimeout(() => {
      this.getTestingCriticalGroupList();
      this.getTotalData();
    }, 100);
  }
  getTotalData(): void {
    this.http.post<any>(`${this.address}/${this.path}/group/get-total`, this.body).subscribe(res => {
      this.totalData = res;
      if (this.totalData < this.itemPerPage) {
        this.nextPageBtn = true;
        this.lastPageBtn = true;
      } else {
        this.nextPageBtn = false;
        this.lastPageBtn = false;
      }
      console.log('total data', res, Math.floor(this.totalData / this.itemPerPage));
    });
  }
  getTestingCriticalGroupList(): void {
    this.http.post<any>(`${this.address}/${this.path}/group/get-all`, this.body).subscribe(res => {
      this.listOfCriticalGroup = res;
    })
  }
  ngOnInit() {
    this.getTestingCriticalGroupList();
    this.getTotalData();
    this.http.get<any>(`${this.address}/${this.path}/group/get-all`).subscribe(res => {
      this.listOfCriticalGroupOrigin = res;
    })
  }

  update(index: number, type: string, content: any) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    this.insertPopup = true;
    // document.getElementById('background')!.style.background = 'rgb(25 26 26 / 75%)';
    // document.getElementById('background')!.style.position = 'absolute';
    var date = new Date
    if (type == 'update') {
      this.popupTitle = 'Chỉnh sửa nhóm tiêu chí';
      this.testingCriticalGroup = this.listOfCriticalGroup[index].testingCriticalGroup;
      this.status = this.listOfCriticalGroup[index].status;
      this.bodyInsert.id = this.listOfCriticalGroup[index].id;
      this.bodyInsert.testingCriticalGroup = this.listOfCriticalGroup[index].testingCriticalGroup;
      this.bodyInsert.createdAt = this.listOfCriticalGroup[index].createdAt;
      this.bodyInsert.note = this.listOfCriticalGroup[index].note;
      this.bodyInsert.username = 'admin';
      this.bodyInsert.updateAt = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      this.bodyInsert.status = this.listOfCriticalGroup[index].status;
      console.log("insert", this.bodyInsert)
    } else {
      this.popupTitle = 'Thêm mới nhóm tiêu chí';
      this.bodyInsert.id = null;
      this.bodyInsert.status = "Active"
      this.bodyInsert.createdAt = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      this.bodyInsert.username = 'admin';
      this.bodyInsert.updateAt = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      console.log("update", this.bodyInsert)
    }
    // if(document.getElementById(`${id.toString()}-input`)!.hidden == true){
    //   document.getElementById(`${id.toString()}-input`)!.hidden = false;
    //   document.getElementById(`${id.toString()}-select`)!.hidden = false;
    //   document.getElementById(`${id.toString()}-button`)!.hidden = false;
    //   document.getElementById(`${id.toString()}-span`)!.hidden = true;
    //   document.getElementById(`${id.toString()}-div`)!.hidden = true;
    // }else{
    //   document.getElementById(`${id.toString()}-input`)!.hidden = true;
    //   document.getElementById(`${id.toString()}-select`)!.hidden = true;
    //   document.getElementById(`${id.toString()}-button`)!.hidden = true;
    //   document.getElementById(`${id.toString()}-span`)!.hidden = false;
    //   document.getElementById(`${id.toString()}-div`)!.hidden = false;
    // }
  }
  close() {
    this.insertPopup = false;
    document.getElementById('background')!.style.background = 'rgb(25 26 26 / 0%)';
    document.getElementById('background')!.style.position = 'unset';
  }
  submit() {
    if (this.bodyInsert.testingCriticalGroup === '') {
      Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng điền thông tin nhóm tiêu chí',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Đồng ý',
        timer: 1000
      })
    } else if (this.bodyInsert.testingCriticalGroup.trim() === this.testingCriticalGroup.trim()) {
      this.http.post(`${this.address}/${this.path}/group/submit`, this.bodyInsert).subscribe(() => {
        Swal.fire({
          title: 'Thành công',
          text: '',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Đồng ý',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })
      })
    } else {
      for (let i = 0; i < this.listOfCriticalGroup.length; i++) {
        if (this.listOfCriticalGroup[i].testingCriticalGroup.trim() === this.bodyInsert.testingCriticalGroup.trim()) {
          Swal.fire({
            title: 'Lỗi',
            text: 'Đã tồn tại nhóm tiêu chí ',
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            confirmButtonText: 'Đồng ý',
            timer: 1000
          })
          this.check = true;
        }
      }
      setTimeout(() => {
        console.log("update", this.check)
        if (this.check === false) {
          this.http.post(`${this.address}/${this.path}/group/submit`, this.bodyInsert).subscribe(() => {
            Swal.fire({
              title: 'Thành công',
              text: '',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Đồng ý',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            })
          })
          this.insertPopup = false;
        } else { this.check = false }
      }, 300)
    }
  }
  changeStatus(index: any) {
    if (this.listOfCriticalGroup[index].status == 'Active') {
      this.listOfCriticalGroup[index].status = 'Deactivate';
      console.log('update', this.listOfCriticalGroup[index]);
      this.http.post(`${this.address}/${this.path}/group/submit`, this.listOfCriticalGroup[index]).subscribe(() => {
        Swal.fire({
          title: 'Thành công',
          text: 'Cập nhật trạng thái thành công',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Đồng ý',
        })
      })
    } else {
      this.listOfCriticalGroup[index].status = 'Active';
      console.log('insert', this.listOfCriticalGroup[index]);
      this.http.post(`${this.address}/${this.path}/group/submit`, this.listOfCriticalGroup[index]).subscribe(() => {
        Swal.fire({
          title: 'Thành công',
          text: 'Cập nhật trạng thái thành công',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Đồng ý',
          timer: 1000
        })
      })
    }
  }
}
