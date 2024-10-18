import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-testing-critical',
  templateUrl: './testing-critical.component.html',
  styleUrls: ['./testing-critical.component.css'],
  styles: [`
    .greenClass{
      background-color:#0AE40A;width: 75px;
      border-radius: 10px;
      margin: auto;}
    .redClass{
      background-color:#FF0000;width: 100px;
      border-radius: 10px;
      margin: auto;}
    .nvlClass{
      background-color:#074173;width: 60px;
      color:#fff;
      border-radius: 10px;
      margin: auto;}
    .lkdtClass{
      background-color:#1679AB;width: 60px;
      color:#fff;
      border-radius: 10px;
      margin: auto;}
    .dgclClass{
      background-color:#77B0AA;width: 150px;
      color:#fff;
      border-radius: 10px;
      margin: auto;}
    `]
})
export class TestingCriticalComponent {
  // bản test
  address = 'http://localhost:8449';
  // hệ thống
  // address = 'http://192.168.68.92/qms';
  path = 'api/testing-critical';
  listOfCritical: any;
  listOfCriticalGroup: any;
  listOfCriticalOrigin: any;
  listOfCriticalFilter: any;
  // Biến check box update
  checkNvl = false;
  checkLkdt = false;
  checkClSp = false;
  // biến check trùng
  check = false;
  //open popup thêm mới
  insertPopup = false;
  updatePopup = false;
  //phân trang
  @Input() testingCriticalGroup = '';
  @Input() username = '';
  @Input() testingName = '';
  @Input() status = '';
  @Input() note = '';
  @Input() testingGroupId = 0;
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
    testingName: string,
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
      testingName: '',
      username: '',
      createdAt: '',
      updateAt: ''
      , note: '',
      status: '',
      itemPerPage: this.itemPerPage,
      offSet: (this.pageNumber - 1) * this.itemPerPage,
    };
  // dữ liệu  update
  bodyUpdate: {
    id: number | null
    testingCriticalGroup: string;
    testingName: string,
    type: string,
    username: string;
    status: string;
    createdAt: string;
    updateAt: string;
    itemPerPage: number;
    offSet: number;
    note: string;
    testingGroupId: number;
  } = {
      id: 0,
      testingCriticalGroup: '',
      type: '',
      testingName: '',
      username: '',
      createdAt: '',
      updateAt: ''
      , note: '',
      status: '',
      itemPerPage: this.itemPerPage,
      offSet: (this.pageNumber - 1) * this.itemPerPage,
      testingGroupId: 0,
    };
  // dữ liệu  insert
  bodyInsert: {
    id: number | null
    testingCriticalGroup: string;
    testingName: string,
    type: string,
    username: string;
    status: string;
    createdAt: string;
    updateAt: string;
    note: string;
    testingGroupId: number;
    typeList: string[]
  }[] = [];
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
    this.body.testingName = this.testingName;
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
    this.getTestingCriticalListPg();
  }
  lastPage(): void {
    this.pageNumber = Math.floor(this.totalData / this.itemPerPage) + 1;
    this.mappingBodySearchAndPagination();
    this.backPageBtn = false;
    this.firstPageBtn = false;
    this.lastPageBtn = true;
    this.nextPageBtn = true;
    this.getTestingCriticalListPg();
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
    this.getTestingCriticalListPg();
  }
  firstPage(): void {
    this.pageNumber = 1;
    this.mappingBodySearchAndPagination();
    this.nextPageBtn = false;
    this.lastPageBtn = false;
    this.backPageBtn = true;
    this.firstPageBtn = true;
    this.getTestingCriticalListPg();
  }
  findFucntion(): void {
    this.mappingBodySearchAndPagination();
    setTimeout(() => {
      this.getTestingCriticalListPg();
      this.getTotalData();
    }, 100);
  }
  getTotalData(): void {
    this.http.post<any>(`${this.address}/${this.path}/get-total`, this.body).subscribe(res => {
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
  getTestingCriticalListPg(): void {
    this.http.post<any>(`${this.address}/${this.path}/get-all`, this.body).subscribe(res => {
      this.listOfCritical = res;
      for (let i = 0; i < this.listOfCritical.length; i++) {
        this.listOfCritical[i].typeList = this.listOfCritical[i].type.split(',');
      }
      console.log("tieu chi: ", this.listOfCritical);
    })
  }
  getTestingCriticalGroupList(): void {
    this.http.get<any>(`${this.address}/${this.path}/group/get-all`).subscribe(res => {
      this.listOfCriticalGroup = res;
      console.log("nhom tieu chi", this.listOfCriticalGroup)
    })
  }
  getTestingCriticalList(): void {
    this.http.get<any>(`${this.address}/${this.path}/get-all`).subscribe(res => {
      this.listOfCriticalOrigin = res;
      this.listOfCriticalFilter = res;
    })
  }
  getTestingCriticalFilterList() {
    for (let i = 0; i < this.listOfCriticalGroup.length; i++) {
      if (this.testingCriticalGroup === this.listOfCriticalGroup[i].testingCriticalGroup) {
        this.testingGroupId = this.listOfCriticalGroup[i].id;
        this.listOfCriticalFilter = this.listOfCriticalOrigin.filter((item: any) => item.testingGroupId === this.testingGroupId);
        console.log("filter tieu chi", this.listOfCriticalFilter)
      }
    }
  }
  ngOnInit() {
    this.getTestingCriticalListPg();
    this.getTotalData();
    this.getTestingCriticalGroupList();
    this.getTestingCriticalList();
  }
  openInsertPopup(content: any) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    this.insertPopup = true;
    this.status = 'Active';
    // document.getElementById('background')!.style.background = 'rgb(25 26 26 / 75%)';
    // document.getElementById('background')!.style.position = 'absolute';
  }
  update(index: number, content: any) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    this.updatePopup = true;
    // document.getElementById('background')!.style.background = 'rgb(25 26 26 / 75%)';
    // document.getElementById('background')!.style.position = 'absolute';
    var date = new Date
    for (let i = 0; i < this.listOfCritical[index].typeList.length; i++) {
      if (this.listOfCritical[index].typeList[i] === 'NVL') {
        this.checkNvl = true;
      } else if (this.listOfCritical[index].typeList[i] === 'LKDT') {
        this.checkLkdt = true;
      } else {
        this.checkClSp = true;
      }
    }
    this.bodyUpdate.testingGroupId = this.listOfCritical[index].testingGroupId;
    this.testingCriticalGroup = this.listOfCritical[index].testingCriticalGroup;
    this.status = this.listOfCritical[index].status;
    this.bodyUpdate.id = this.listOfCritical[index].id;
    this.bodyUpdate.testingCriticalGroup = this.listOfCritical[index].testingCriticalGroup;
    this.bodyUpdate.testingName = this.listOfCritical[index].testingName;
    this.bodyUpdate.createdAt = this.listOfCritical[index].createdAt;
    this.bodyUpdate.note = this.listOfCritical[index].note;
    this.bodyUpdate.username = 'admin';
    this.testingName = this.listOfCritical[index].testingName;
    this.bodyUpdate.updateAt = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    this.bodyUpdate.status = this.listOfCritical[index].status;
    console.log("insert", this.bodyUpdate)
  }
  close() {
    this.updatePopup = false;
    this.checkNvl = false;
    this.checkLkdt = false;
    this.checkClSp = false;
    this.testingCriticalGroup = '';
    this.testingName = '';
    this.status = '';
  }
  closeInsertPopup() {
    this.insertPopup = false;
    this.checkNvl = false;
    this.checkLkdt = false;
    this.checkClSp = false;
    this.testingCriticalGroup = '';
    this.testingName = '';
    this.status = '';
  }
  submit() {
    if (this.bodyUpdate.testingCriticalGroup === '') {
      this.popupError('Vui lòng chọn nhóm tiêu chí');
    } else if (this.bodyUpdate.testingName === '') {
      this.popupError('Vui lòng điền thông tin tiêu chí');
    } else if (this.checkClSp === false && this.checkLkdt === false && this.checkNvl === false) {
      this.popupError('Vui lòng chọn mẫu biên bản');
    } else if (this.bodyUpdate.testingName.trim() === this.testingName.trim()) {
      var typeResult: any[] = []
      if (this.checkClSp === true) {
        typeResult.push('Đánh giá CL SP');
      }
      if (this.checkLkdt === true) {
        typeResult.push('LKDT');
      }
      if (this.checkNvl === true) {
        typeResult.push('NVL')
      }
      this.bodyUpdate.type = typeResult.join(',')
      console.log("update:", this.bodyUpdate)
      this.http.post(`${this.address}/${this.path}/update`, this.bodyUpdate).subscribe(() => {
        this.popupSubmit('Thành công')
      })
    } else {
      this.http.post(`${this.address}/${this.path}/check-dublicate`, this.bodyUpdate).subscribe(res => {
        if (res === 1) {
          var typeResult: any[] = []
          if (this.checkClSp === true) {
            typeResult.push('Đánh giá CL SP');
          }
          if (this.checkLkdt === true) {
            typeResult.push('LKDT');
          }
          if (this.checkNvl === true) {
            typeResult.push('NVL')
          }
          this.bodyUpdate.type = typeResult.join(',')
          console.log("update:", this.bodyUpdate)
          this.http.post(`${this.address}/${this.path}/update`, this.bodyUpdate).subscribe(() => {
            this.popupSubmit('Thành công')
          })
          this.updatePopup = false;
        } else {
          this.popupError('Đã tồn tại tiêu chí')
        }
      })
    }
  }
  changeStatus(index: any) {
    if (this.listOfCritical[index].status == 'Active') {
      this.listOfCritical[index].status = 'Deactivate';
      console.log('update', this.listOfCritical[index]);
      this.http.post(`${this.address}/${this.path}/update`, this.listOfCritical[index]).subscribe(() => {
        this.popupConfirm('Cập nhật thành công');
      })
    } else {
      this.listOfCritical[index].status = 'Active';
      console.log('insert', this.listOfCritical[index]);
      this.http.post(`${this.address}/${this.path}/update`, this.listOfCritical[index]).subscribe(() => {
        this.popupConfirm('Cập nhật thành công');
      })
    }
  }
  changeTestingGroupId(testingCriticalGroup: any, testingGroupId: any) {
    for (let i = 0; i < this.listOfCriticalGroup.length; i++) {
      if (testingCriticalGroup === this.listOfCriticalGroup[i].testingCriticalGroup) {
        testingGroupId = this.listOfCriticalGroup[i].id;
        this.testingGroupId = this.listOfCriticalGroup[i].id;
      }
    }
    console.log("check id:", this.testingGroupId)
  }
  saveInfor() {
    if (this.testingCriticalGroup === '') {
      this.popupError('Vui lòng chọn nhóm tiêu chí');
    } else if (this.testingName === '') {
      this.popupError('Vui lòng điền thông tin tiêu chí');
    } else if (this.checkClSp === false && this.checkLkdt === false && this.checkNvl === false) {
      this.popupError('Vui lòng chọn mẫu biên bản');
    } else {
      this.bodyUpdate.testingName = this.testingName
      this.http.post(`${this.address}/${this.path}/check-dublicate`, this.bodyUpdate).subscribe(res => {
        if (res === 1) {
          var check = false;
          for (let i = 0; i < this.bodyInsert.length; i++) {
            if (this.testingName === this.bodyInsert[i].testingName) {
              this.popupError(`Tiêu chí đã nằm trong danh sách thêm mới`)
              check = true;
            }
          }
          setTimeout(() => {
            if (check === false) {
              var date = new Date
              var typeResult: any[] = []
              if (this.checkClSp === true) {
                typeResult.push('Đánh giá CL SP');
              }
              if (this.checkLkdt === true) {
                typeResult.push('LKDT');
              }
              if (this.checkNvl === true) {
                typeResult.push('NVL')
              }
              this.bodyUpdate.type = typeResult.join(',')
              var item: {
                id: number | null
                testingCriticalGroup: string;
                testingName: string,
                type: string,
                username: string;
                status: string;
                createdAt: string;
                updateAt: string;
                note: string;
                testingGroupId: number;
                typeList: string[]
              } = {
                id: null,
                testingCriticalGroup: this.testingCriticalGroup,
                testingName: this.testingName,
                username: 'admin',
                status: this.status,
                note: this.note,
                testingGroupId: this.testingGroupId,
                type: typeResult.join(','),
                typeList: typeResult,
                createdAt: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                updateAt: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
              }
              this.bodyInsert = [item, ...this.bodyInsert];
            }
          }, 100);
        } else {
          this.popupError(`Tiêu chí đã tồn tại`)
        }
      })
    }
    // setTimeout(() => {
    //   this.checkNvl = false;
    //   this.checkLkdt = false;
    //   this.checkClSp = false;
    // }, 100);
  }
  changeStatusInsert(index: any) {
    if (this.bodyInsert[index].status == 'Active') {
      this.bodyInsert[index].status = 'Deactivate';
    } else {
      this.bodyInsert[index].status = 'Active';
    }
  }
  deleteInsert(testingName: any) {
    this.
      bodyInsert = this.bodyInsert.filter((item: any) => item.testingName !== testingName);
  }
  insertTestingCritical() {
    this.http.post(`${this.address}/${this.path}/insert`, this.bodyInsert).subscribe(() => {
      this.popupSubmit('Thêm mới thành công')
    })
  }
  popupError(mss: string) {
    Swal.fire({
      title: 'Lỗi',
      text: mss,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Đồng ý',
      timer: 1000
    })
  }
  popupSubmit(mss: string) {
    Swal.fire({
      title: 'Thành công',
      text: mss,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Đồng ý',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    })
  }
  popupConfirm(mss: string) {
    Swal.fire({
      title: 'Thành công',
      text: mss,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Đồng ý',
      timer: 1000
    })
  }

}

