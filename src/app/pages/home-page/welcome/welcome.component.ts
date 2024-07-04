import { ApplicationConfig, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartOptions, Chart } from 'chart.js';
import { ChartType } from 'ng-apexcharts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TinCheckSerialService } from 'src/app/share/_services/tinCheckSerial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeChart } from 'src/app/share/_services/welcome.service';
import { environment } from 'src/environments/environment';
import { Observable, filter } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import zoomPlugin from 'chartjs-plugin-zoom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { speed } from 'jquery';
Chart.register(zoomPlugin);
// import { Chart } from '../../../../../node_modules/chart.js/auto/auto.mjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" })
};

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  //multiple select
  nhaCungCap!: { id: number, name: string, soLuong: number, status: boolean }[]

  selectedNhaCungCap!: { id: number, name: string, soLuong: number, status: boolean }[];
  //-------------------------------------------------------------------------------
  listOfDataDashBoard: any;
  _listOfDataDashBoard: any = {
    pqcPhotoElectDashResponseList: [],
    pqcPhotoElectProductDashResponseList: [],
    pqcQuantityDashResponseList: [],
    pqcStoreCheckList: [],
    workOrderWaitStatusResponseList: [],
    iqcElectCompDashList: [],
    iqcElectCompErrsList: []
  };

  tongSlSpNhapKho: number = 0;// 9. tổng số lượng nhập kho
  tongSlSpKhongDat: number = 0;// 10. tổng số lượng không đạt
  tiLeSpDat: number = 0; //11.
  tiLeSpLoiQuaTrinh: number = 0; //12.
  tongSlBTPNhapKho: number = 0; //13.
  tongSlBTPKhongDat: number = 0; //14.
  tiLeBTPDat: number = 0; //15.
  tiLeBTPLoiQuaTrinh: number = 0; //16.
  choPheDuyetLenhSX: number = 0; //17.
  choPheDuyetBBKT: number = 0; //18.
  soLoKT: number = 0; //19.
  soLoKhongDat: number = 0; //20.
  soLoNhanNhuong: number = 0; //21.
  slVatTuNhap: number = 0; //22.
  slVatTuDat: number = 0; //23.
  slVatTuKhongDat: number = 0; //24.
  slVatTuNhanNhuong: number = 0; //25.
  tiLeLoiVatTuQTSX: number = 0; //26.
  tongSoNCC: number = 0; //27.
  tongSoBienBanIQC: number = 0; //28.
  tongSoMauDoSP: number = 0; //29.
  soMauSPDat: number = 0; //30.
  tiLeSPDatThongSo: number = 0; //31.
  soMauSPKhongDat: number = 0; //32.
  tongSoMauDoBTPDrv: number = 0; //33.
  soMauBTPDrvDat: number = 0; //34.
  tiLeBTPDrvDatThongSo: number = 0; //35.
  soMauBTPDrvKhongDat: number = 0; //36.
  // search body
  @Input() startDate = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
  @Input() endDate = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  searchBody: { startDate: string | null, endDate: string | null, productCode: string, productName: string, branchName: string, groupName: string } = {
    startDate: this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: this.datePipe.transform(new Date, 'yyyy-MM-dd'),
    productCode: '',
    productName: '',
    branchName: '',
    groupName: ''
  }
  popupReport = false;
  popupConfig = false;
  listOfNganh = [
    { tenNganh: 'Ngành SMART', target: 20 },
    { tenNganh: 'Ngành DTTD', target: 10 },
    { tenNganh: 'Ngành LR LED', target: 15 },
    { tenNganh: 'Ngành TBCS', target: 10 },
    { tenNganh: 'Ngành CNPT', target: 10 },
  ]
  // Biến ẩn hiện title và button tắt màn hình
  labelTitle = true; // mặc định bật
  closeScreen = false; // mặc định tắt
  //Khởi tạo data cho chart mục 40
  chart40: { key: string, value: number }[] = [];
  chart40labels: any[] = [];
  //Mục 41 data gốc chart
  chartSLDat: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartSLKhongDat: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartSLNhanNhuong: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartTongSL: { id: number, name: string, soLuong: number, status: boolean }[] = []
  //Mục 41 data show chart
  labelsChart41: string[] = []
  chartSLDatShow: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartSLKhongDatShow: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartSLNhanNhuongShow: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartTongSLShow: { id: number, name: string, soLuong: number, status: boolean }[] = []
  listOfTarget = [
    { nameTarget: 'Tỉ lệ sản phẩm đạt', targetMin: 0, targetMax: 0.002, color: '' },
    { nameTarget: 'Tỉ lệ sản phẩm đạt', targetMin: 0.002, targetMax: 0.015, color: '' },
    { nameTarget: 'Tỉ lệ sản phẩm đạt', targetMin: 0.015, targetMax: 100, color: '' },
  ]

  listOfReport = [

    { timeReport: '19/03/2024 15:05:30', user: 'admin', comment: '', status: 'wait' },
    { timeReport: '19/03/2024 10:05:30', user: 'admin', comment: '', status: 'wait' },
    { timeReport: '19/03/2024 15:05:30', user: 'admin', comment: '', status: 'wait' },
    { timeReport: '19/03/2024 15:05:30', user: 'admin', comment: '', status: 'wait' },
    { timeReport: '19/03/2024 15:05:30', user: 'admin', comment: '', status: 'wait' },
    { timeReport: '18/03/2024 10:05:30', user: 'admin', comment: '', status: 'wait' },
    { timeReport: '17/03/2024 15:05:30', user: 'admin', comment: '', status: 'wait' },
    { timeReport: '16/03/2024 10:05:30', user: 'admin', comment: '', status: 'wait' },

  ]
  //test angular material
  listGroupNameSearch: any[] = [];
  listBranchNameSearch: any[] = [];
  branchSearchKey = ''
  groupSearchKey = ''
  productCodeSearchKey = ''
  productNameSearchKey = ''
  //end test
  path: string;
  // Mục 40
  myChartChatLuongNhap: any
  //Mục 42
  tongLoiChart: { errName: string, checkingQuantity: number }[] = []
  tongRutNghiemChart: { errName: string, checkingQuantity: number }[] = []
  myCharthatLuongHang: any
  //Mục 41
  myChartTTVatTu: any
  //Danh sách gợi ý phục vụ mutil select
  branchList: any[] = [];
  groupList: any[] = [];
  productionCodeList: any[] = [];
  productionNameList: any[] = [];
  _branchList: any[] = [];
  _groupList: any[] = [];
  _productionCodeList: any[] = [];
  _productionNameList: any[] = [];
  @ViewChild('multiUserSearch') multiUserSearchInput?: ElementRef
  constructor(
    // private accountService: AccountService,
    // private loginService: LoginService,
    // private applicationConfig: ApplicationConfig,
    private modalService: NgbModal,
    private welcomeChart: WelcomeChart,
    private http: HttpClient,
    protected datePipe: DatePipe,
    protected document: Document,
  ) { this.path = environment.api_end_point }
  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }
  // ------------------------------------------------ * Chức năng tìm kiếm theo khoảng thời gian * ----------------------------------
  //Hàm check giá trị thời gian trả về sau khi chọn
  checkDate() {
    this.searchBody.startDate = this.startDate
    this.searchBody.endDate = this.endDate
    // console.log(this.startDate, this.endDate)
  }
  // Hàm chạy chức năng tìm kiếm
  search(): void {
    // lọc theo ngành
    if (this.listBranchNameSearch.length > 0) {
      this._listOfDataDashBoard = this.dashboardFilterByBranch(this.listBranchNameSearch)
      //lọc theo tổ
      if (this.listGroupNameSearch.length > 0) {
        this._listOfDataDashBoard = this.dashboardFilterByGroup(this.listGroupNameSearch);
        // console.log("test btn 2: ",this._listOfDataDashBoard)
      }
    } else {
      if (this.listGroupNameSearch.length > 0) {
        this._listOfDataDashBoard = this.dashboardFilterByGroupOnly(this.listGroupNameSearch);
      } else {
        alert("Chưa chọn đơn vị sản xuất")
      }
    }
    this.resetDataAfterFilter()
    // console.log("test btn: ",this._listOfDataDashBoard)
  }
  //------------------------------------------------- * Chức năng tìm kiếm theo các trường thông tin * --------------------------------
  //---------------------------------- filter theo đơn vị sản xuất -------------------------------
  onBranchNameChange(item: any, e: any) {
    // lưu vào danh sách tìm kiếm
    let accItem = this.listBranchNameSearch.find((ai: any) => ai.key === item)
    if (accItem) {
      accItem.checkBox = !accItem.checkBox;
      this.listBranchNameSearch = this.listBranchNameSearch.filter(item => item.checkBox === true)
    } else {
      const item1: { key: string, checkBox: boolean } = { key: item, checkBox: true }
      this.listBranchNameSearch.push(item1);
    }
    //cập nhật lại danh sách gợi ý mã sp và tên sp
    this.resetListGuideByBranch(this.listBranchNameSearch)
    // console.log("branch",this.listBranchNameSearch)
  }
  //Hàm check giá trị trả về sau khi chọn đơn vị sản xuất
  OnBranchNameInputChange(): void {
    this._branchList = this.branchList.filter((item: any) => item.branchName.toLowerCase().includes(this.branchSearchKey.toLowerCase()))
    // console.log("1111: ",e)
  }
  //reset danh sách gợi ý theo branch sau khi chọn đơn vị sản xuất
  resetListGuideByBranch(group: any[]): void {
    let _groupList: any[] = [];
    let _productionCodeList: any[] = [];
    let _productionNameList: any[] = [];
    group.forEach((item: any) => {
      const groupList = this.groupList.filter((item1: any) => item1.branchName!.includes(item.key))
      groupList.forEach((item: any) => { _groupList.push(item) });
      const productionCodeList = this.productionCodeList.filter((item1: any) => item1.branchName!.includes(item.key))
      productionCodeList.forEach((item: any) => { _productionCodeList.push(item) });
      const productionNameList = this.productionNameList.filter((item1: any) => item1.branchName!.includes(item.key))
      productionNameList.forEach((item: any) => { _productionNameList.push(item) });
    })
    this._groupList = _groupList;
    this._productionCodeList = _productionCodeList;
    this._productionNameList = _productionNameList;
    if (group.length === 0) {
      this._groupList = this.groupList;
      this._productionCodeList = this.productionCodeList;
      this._productionNameList = this.productionNameList;
    }
    // console.log("rs 1:",_groupList);
    // console.log("rs 2:",_productionCodeList);
    // console.log("rs 3:",_productionNameList);
  }
  // --------------------------------- filter theo group (tổ) ------------------------------------
  onGroupNameChange(item: any, e: any) {
    // lưu vào danh sách tìm kiếm
    let accItem = this.listGroupNameSearch.find((ai: any) => ai.key === item)
    if (accItem) {
      accItem.checkBox = !accItem.checkBox;
      this.listGroupNameSearch = this.listGroupNameSearch.filter(item => item.checkBox === true)
      e.isUserInput = true;
    } else {
      const item1: { key: string, checkBox: boolean } = { key: item, checkBox: true }
      this.listGroupNameSearch.push(item1);
    }
    //cập nhật lại danh sách gợi ý mã sp và tên sp
    this.resetListGuideByGroup(this.listGroupNameSearch)
    // console.log("test",this.listGroupNameSearch)
    // console.log("test1",e)
  }
  //Hàm check giá trị trả về sau khi chọn tổ
  OnGroupNameInputChange(e: Event): void {
    this._groupList = this.groupList.filter((item: any) => item.groupName.toLowerCase().includes(this.groupSearchKey.toLowerCase()))
    // console.log("1111: ",e)
  }
  //reset danh sách gợi ý theo group sau khi chọn tổ
  resetListGuideByGroup(group: any[]): void {
    let _productionCodeList: any[] = [];
    let _productionNameList: any[] = [];
    group.forEach((item: any) => {
      const productionCodeList = this.productionCodeList.filter((item1: any) => item1.groupName!.includes(item.key))
      productionCodeList.forEach((item: any) => { _productionCodeList.push(item) });
      const productionNameList = this.productionNameList.filter((item1: any) => item1.groupName!.includes(item.key))
      productionNameList.forEach((item: any) => { _productionNameList.push(item) });
    })
    this._productionCodeList = _productionCodeList;
    this._productionNameList = _productionNameList;
    if (group.length === 0) {
      this._productionCodeList = this.productionCodeList;
      this._productionNameList = this.productionNameList;
    }
    // console.log("rs 4:",_productionCodeList);
    // console.log("rs 5:",_productionNameList);
  }
  // --------------------------------- filter theo mã sản phẩm (production code) ------------------------------------
  onProductionCodeChange(item: any, e: any) {
    // lưu vào danh sách tìm kiếm
    let accItem = this.listGroupNameSearch.find((ai: any) => ai.key === item)
    if (accItem) {
      accItem.checkBox = !accItem.checkBox;
      this.listGroupNameSearch = this.listGroupNameSearch.filter(item => item.checkBox === true)
      e.isUserInput = true;
    } else {
      const item1: { key: string, checkBox: boolean } = { key: item, checkBox: true }
      this.listGroupNameSearch.push(item1);
    }
    //cập nhật lại danh sách gợi ý mã sp và tên sp
    this.resetListGuideByGroup(this.listGroupNameSearch)
    // console.log("test",this.listGroupNameSearch)
    // console.log("test1",e)
  }
  // ------------------------------------------------------- chức năng lọc -------------------------------------------------------
  //Hàm lọc thông tin tìm kiếm theo ngành
  dashboardFilterByBranch(key: any[]): any {
    // console.log("key",key)
    let listOfDataDashBoard: any = {
      pqcPhotoElectDashResponseList: [],
      pqcPhotoElectProductDashResponseList: [],
      pqcQuantityDashResponseList: [],
      pqcStoreCheckList: [],
      workOrderWaitStatusResponseList: [],
      iqcElectCompDashList: this.listOfDataDashBoard.iqcElectCompDashList,
      iqcElectCompErrsList: this.listOfDataDashBoard.iqcElectCompErrsList
    }
    for (let i = 0; i < key.length; i++) {
      const pqcPhotoElectDashResponseList: any[] = this.listOfDataDashBoard.pqcPhotoElectDashResponseList.filter((item: any) => item.branchName === key[i].key);
      const pqcPhotoElectProductDashResponseList: any[] = this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList.filter((item: any) => item.branchName === key[i].key);
      const pqcQuantityDashResponseList: any[] = this.listOfDataDashBoard.pqcQuantityDashResponseList.filter((item: any) => item.branchName === key[i].key);
      const pqcStoreCheckList: any[] = this.listOfDataDashBoard.pqcStoreCheckList.filter((item: any) => item.branchName === key[i].key);
      const workOrderWaitStatusResponseList: any[] = this.listOfDataDashBoard.workOrderWaitStatusResponseList.filter((item: any) => item.branchName === key[i].key);
      // console.log("result: ",pqcPhotoElectDashResponseList)
      pqcPhotoElectDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcPhotoElectDashResponseList.push(item)
      })
      pqcPhotoElectProductDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcPhotoElectProductDashResponseList.push(item)
      })
      pqcQuantityDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcQuantityDashResponseList.push(item)
      })
      pqcStoreCheckList.forEach((item: any) => {
        listOfDataDashBoard.pqcStoreCheckList.push(item)
      })
      workOrderWaitStatusResponseList.forEach((item: any) => {
        listOfDataDashBoard.workOrderWaitStatusResponseList.push(item)
      })
    }
    return listOfDataDashBoard
  }
  //Hàm lọc thông tin tìm kiếm theo tổ
  dashboardFilterByGroup(key: any[]): any {
    // console.log("key",key)
    let listOfDataDashBoard: any = {
      pqcPhotoElectDashResponseList: [],
      pqcPhotoElectProductDashResponseList: [],
      pqcQuantityDashResponseList: [],
      pqcStoreCheckList: [],
      workOrderWaitStatusResponseList: [],
      iqcElectCompDashList: this._listOfDataDashBoard.iqcElectCompDashList,
      iqcElectCompErrsList: this._listOfDataDashBoard.iqcElectCompErrsList
    }
    for (let i = 0; i < key.length; i++) {
      const pqcPhotoElectDashResponseList: any[] = this._listOfDataDashBoard.pqcPhotoElectDashResponseList.filter((item: any) => item.groupName === key[i].key);
      const pqcPhotoElectProductDashResponseList: any[] = this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList.filter((item: any) => item.groupName === key[i].key);
      const pqcQuantityDashResponseList: any[] = this._listOfDataDashBoard.pqcQuantityDashResponseList.filter((item: any) => item.groupName === key[i].key);
      const pqcStoreCheckList: any[] = this._listOfDataDashBoard.pqcStoreCheckList.filter((item: any) => item.groupName === key[i].key);
      const workOrderWaitStatusResponseList: any[] = this._listOfDataDashBoard.workOrderWaitStatusResponseList.filter((item: any) => item.groupName === key[i].key);
      // console.log("result: ",pqcPhotoElectDashResponseList)
      pqcPhotoElectDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcPhotoElectDashResponseList.push(item)
      })
      pqcPhotoElectProductDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcPhotoElectProductDashResponseList.push(item)
      })
      pqcQuantityDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcQuantityDashResponseList.push(item)
      })
      pqcStoreCheckList.forEach((item: any) => {
        listOfDataDashBoard.pqcStoreCheckList.push(item)
      })
      workOrderWaitStatusResponseList.forEach((item: any) => {
        listOfDataDashBoard.workOrderWaitStatusResponseList.push(item)
      })
    }
    return listOfDataDashBoard
  }
  //Hàm lọc thông tin tìm kiếm chỉ theo tổ
  dashboardFilterByGroupOnly(key: any[]): any {
    // console.log("key",key)
    let listOfDataDashBoard: any = {
      pqcPhotoElectDashResponseList: [],
      pqcPhotoElectProductDashResponseList: [],
      pqcQuantityDashResponseList: [],
      pqcStoreCheckList: [],
      workOrderWaitStatusResponseList: [],
      iqcElectCompDashList: this.listOfDataDashBoard.iqcElectCompDashList,
      iqcElectCompErrsList: this.listOfDataDashBoard.iqcElectCompErrsList
    }
    for (let i = 0; i < key.length; i++) {
      const pqcPhotoElectDashResponseList: any[] = this.listOfDataDashBoard.pqcPhotoElectDashResponseList.filter((item: any) => item.groupName === key[i].key);
      const pqcPhotoElectProductDashResponseList: any[] = this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList.filter((item: any) => item.groupName === key[i].key);
      const pqcQuantityDashResponseList: any[] = this.listOfDataDashBoard.pqcQuantityDashResponseList.filter((item: any) => item.groupName === key[i].key);
      const pqcStoreCheckList: any[] = this.listOfDataDashBoard.pqcStoreCheckList.filter((item: any) => item.groupName === key[i].key);
      const workOrderWaitStatusResponseList: any[] = this.listOfDataDashBoard.workOrderWaitStatusResponseList.filter((item: any) => item.groupName === key[i].key);
      // console.log("result: ",pqcPhotoElectDashResponseList)
      pqcPhotoElectDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcPhotoElectDashResponseList.push(item)
      })
      pqcPhotoElectProductDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcPhotoElectProductDashResponseList.push(item)
      })
      pqcQuantityDashResponseList.forEach((item: any) => {
        listOfDataDashBoard.pqcQuantityDashResponseList.push(item)
      })
      pqcStoreCheckList.forEach((item: any) => {
        listOfDataDashBoard.pqcStoreCheckList.push(item)
      })
      workOrderWaitStatusResponseList.forEach((item: any) => {
        listOfDataDashBoard.workOrderWaitStatusResponseList.push(item)
      })
    }
    return listOfDataDashBoard
  }
  //Hàm tính toán lại dữ liệu sau khi lọc
  resetDataAfterFilter(): void {
    //reset dữ liệu
    this.chart40 = [];
    this.chart40labels = [];
    this.chartSLDat = [];
    this.chartSLKhongDat = [];
    this.chartSLNhanNhuong = [];
    this.chartTongSL = [];
    this.tongSlSpNhapKho = 0;// 9. tổng số lượng nhập kho
    this.tongSlSpKhongDat = 0;// 10. tổng số lượng không đạt
    this.tiLeSpDat = 0; //11.
    this.tiLeSpLoiQuaTrinh = 0; //12.
    this.tongSlBTPNhapKho = 0; //13.
    this.tongSlBTPKhongDat = 0; //14.
    this.tiLeBTPDat = 0; //15.
    this.tiLeBTPLoiQuaTrinh = 0; //16.
    this.choPheDuyetLenhSX = 0; //17.
    this.choPheDuyetBBKT = 0; //18.
    this.soLoKT = 0; //19.
    this.soLoKhongDat = 0; //20.
    this.soLoNhanNhuong = 0; //21.
    this.slVatTuNhap = 0; //22.
    this.slVatTuDat = 0; //23.
    this.slVatTuKhongDat = 0; //24.
    this.slVatTuNhanNhuong = 0; //25.
    this.tiLeLoiVatTuQTSX = 0; //26.
    this.tongSoNCC = 0; //27.
    this.tongSoBienBanIQC = 0; //28.
    this.tongSoMauDoSP = 0; //29.
    this.soMauSPDat = 0; //30.
    this.tiLeSPDatThongSo = 0; //31.
    this.soMauSPKhongDat = 0; //32.
    this.tongSoMauDoBTPDrv = 0; //33.
    this.soMauBTPDrvDat = 0; //34.
    this.tiLeBTPDrvDatThongSo = 0; //35.
    this.soMauBTPDrvKhongDat = 0; //36.
    this.labelsChart41 = [];
    // tính toán dữ liệu và lưu vào biến hiển thị
    for (let i = 0; i < this._listOfDataDashBoard.pqcStoreCheckList.length; i++) {
      if (this._listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Đạt' && this._listOfDataDashBoard.pqcStoreCheckList[i].productType === 1) {// Mục 9
        // console.log("19",this.tongSlSpNhapKho + Number(this._listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
        this.tongSlSpNhapKho = this.tongSlSpNhapKho + Number(this._listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
      }
      if (this._listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Không đạt' && this._listOfDataDashBoard.pqcStoreCheckList[i].productType === 1) {// Mục 10
        // console.log("19",this.tongSlSpKhongDat + Number(this._listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
        this.tongSlSpKhongDat += Number(this._listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
      }
      if (this._listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Đạt' && this._listOfDataDashBoard.pqcStoreCheckList[i].productType === 0) {//Mục 13
        // console.log("19",this.tongSlBTPNhapKho + Number(this._listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
        this.tongSlBTPNhapKho += Number(this._listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
      }
      if (this._listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Không đạt' && this._listOfDataDashBoard.pqcStoreCheckList[i].productType === 0) {//Mục 14
        // console.log("19",this.tongSlBTPKhongDat + Number(this._listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
        this.tongSlBTPKhongDat += Number(this._listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
      }
    }
    for (let i = 0; i < this._listOfDataDashBoard.pqcQuantityDashResponseList.length; i++) {
      if (this._listOfDataDashBoard.pqcQuantityDashResponseList[i].conclude === 'Đạt') {//Mục 19
        this.soLoKT++;
      }
      if (this._listOfDataDashBoard.pqcQuantityDashResponseList[i].conclude === 'Không đạt') {//Mục 20
        this.soLoKhongDat++;
      }
      if (this._listOfDataDashBoard.pqcQuantityDashResponseList[i].conclude === 'Nhân nhượng') {//Mục 21
        this.soLoNhanNhuong++;
      }
    }
    for (let i = 0; i < this._listOfDataDashBoard.iqcElectCompDashList.length; i++) {
      if (this._listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Đạt nhập kho' && Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0 ||
        this._listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Không đạt trả về' && Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0 ||
        this._listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Nhập kho nhân nhượng' && Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0) {//Mục 22
        this.slVatTuNhap += Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity);
      }
      if (this._listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Đạt nhập kho' && Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0) {//Mục 23
        this.slVatTuDat += Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity);
      }
      if (this._listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Không đạt trả về' && Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0) {//Mục 24
        this.slVatTuKhongDat += Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity);
      }
      if (this._listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Nhập kho nhân nhượng' && Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0) {//Mục 25
        this.slVatTuNhanNhuong += Number(this._listOfDataDashBoard.iqcElectCompDashList[i].poQuantity);
      }
    }
    //Xây dựng thông tin cho mục 41
    let count = 0;
    let calculated = this._listOfDataDashBoard.iqcElectCompDashList.reduce((acc: any[], item: any) => {//27

      let accItem = acc.find((ai: any) => ai.origin === item.origin)

      if (accItem) {
        accItem.tongSoLuong = Number(accItem.tongSoLuong) + Number(item.poQuantity)
        if (item.conclusion === 'Đạt nhập kho') {
          accItem.slDatNhapKho = Number(accItem.slDatNhapKho) + Number(item.poQuantity);
        }
        if (item.conclusion === 'Không đạt trả về') {
          accItem.slKhongDat = Number(accItem.slKhongDat) + Number(item.poQuantity);
        }
        if (item.conclusion === 'Nhập kho nhân nhượng') {
          accItem.slNhanNhuong = Number(accItem.slNhanNhuong) + Number(item.poQuantity);
        }
      } else {
        count++
        item.tongSoLuong = Number(item.poQuantity);
        item.slDatNhapKho = 0;
        item.slKhongDat = 0;
        item.slNhanNhuong = 0;
        if (item.conclusion === 'Đạt nhập kho') {
          item.slDatNhapKho = Number(item.poQuantity);
        }
        if (item.conclusion === 'Không đạt trả về') {
          item.slKhongDat = Number(item.poQuantity);
        }
        if (item.conclusion === 'Nhập kho nhân nhượng') {
          item.slNhanNhuong = Number(item.poQuantity);
        }
        acc.push(item)
        const chartSLDatItem: { id: number, name: string, soLuong: number, status: boolean } = { id: count, name: item.origin, soLuong: 0, status: false };
        const chartSLKhongDatItem: { id: number, name: string, soLuong: number, status: boolean } = { id: count, name: item.origin, soLuong: 0, status: false };
        const chartSLNhanNhuongItem: { id: number, name: string, soLuong: number, status: boolean } = { id: count, name: item.origin, soLuong: 0, status: false };
        const chartTongSLItem: { id: number, name: string, soLuong: number, status: boolean } = { id: count, name: item.origin, soLuong: 0, status: false };
        this.chartSLDat.push(chartSLDatItem);
        this.chartSLKhongDat.push(chartSLKhongDatItem);
        this.chartSLNhanNhuong.push(chartSLNhanNhuongItem);
        this.chartTongSL.push(chartTongSLItem);
        this.labelsChart41.push(chartSLDatItem.name)
      }
      return acc;
    }, [])
    calculated = calculated.filter((item: any) => item.origin !== null && item.origin !== '')
    this.chartSLDat = this.chartSLDat.filter((item: any) => item.name !== null && item.name !== '')
    this.chartSLKhongDat = this.chartSLKhongDat.filter((item: any) => item.name !== null && item.name !== '')
    this.chartSLNhanNhuong = this.chartSLNhanNhuong.filter((item: any) => item.name !== null && item.name !== '')
    this.chartTongSL = this.chartTongSL.filter((item: any) => item.name !== null && item.name !== '')
    this.labelsChart41 = this.labelsChart41.filter((item: any) => item !== null && item !== '')
    this.tongSoNCC = calculated.length;
    //gán thông tin vào data chart 40
    for (let i = 0; i < calculated.length; i++) {
      this.chartSLDat[i].soLuong += Number(calculated[i].slDatNhapKho);
      this.chartSLKhongDat[i].soLuong += Number(calculated[i].slKhongDat);
      this.chartSLNhanNhuong[i].soLuong += Number(calculated[i].slNhanNhuong);
      this.chartTongSL[i].soLuong += Number(calculated[i].tongSoLuong);
    }
    // tính toán số lượng max để set hiển thị cho trục y chart 41
    const chart41MaxValue = this.caculateMaxValue(this.chartTongSL);
    // xây dựng dữ liệu cho  chart mục 40
    let calculatedChart = this._listOfDataDashBoard.iqcElectCompDashList.reduce((acc: any[], item: any) => {//27
      let accItem = acc.find((ai: any) => ai.conclusion === item.conclusion)
      if (accItem) {
        if (Number(item.poQuantity) > 0) {
          accItem.tongSoLuong = Number(accItem.tongSoLuong) + Number(item.poQuantity);
        }
      } else {
        item.tongSoLuong = Number(item.poQuantity);
        acc.push(item);
      }
      return acc;
    }, [])
    calculatedChart = calculatedChart.filter((item: any) => item.conclusion !== null && item !== '1')
    // console.log("Mục 40: ",calculatedChart);
    //Gán vào phần hiển thị chart 40
    for (let i = 0; i < calculatedChart.length; i++) {
      const item: { key: string, value: number } = { key: calculatedChart[i].conclusion, value: calculatedChart[i].tongSoLuong };
      this.chart40.push(item);
      this.chart40labels.push(calculatedChart[i].conclusion);
    }
    for (let i = 0; i < this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList.length; i++) {
      if (this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].conclude === 'Đạt' ||
        this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].conclude === 'Không đạt') {//Mục 29
        this.tongSoMauDoSP += Number(this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].quantity);
      }
      if (this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].conclude === 'Đạt') {//Mục 30
        this.soMauSPDat += Number(this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].quantity);
      }
      if (this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].conclude === 'Không đạt') {//Mục 32
        this.soMauSPKhongDat += Number(this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].quantity);
      }
    }
    for (let i = 0; i < this._listOfDataDashBoard.pqcPhotoElectDashResponseList.length; i++) {
      if (this._listOfDataDashBoard.pqcPhotoElectDashResponseList[i].conclude === 'Đạt' ||
        this._listOfDataDashBoard.pqcPhotoElectDashResponseList[i].conclude === 'Không đạt') {//Mục 33
        this.tongSoMauDoBTPDrv += Number(this._listOfDataDashBoard.pqcPhotoElectDashResponseList[i].quantity);
      }
      if (this._listOfDataDashBoard.pqcPhotoElectDashResponseList[i].conclude === 'Đạt') {//Mục 34
        this.soMauBTPDrvDat += Number(this._listOfDataDashBoard.pqcPhotoElectDashResponseList[i].quantity);
      }
      if (this._listOfDataDashBoard.pqcPhotoElectDashResponseList[i].conclude === 'Không đạt') {//Mục 36
        this.soMauBTPDrvKhongDat += Number(this._listOfDataDashBoard.pqcPhotoElectDashResponseList[i].quantity);
      }
    }
    this.tongSoBienBanIQC = this._listOfDataDashBoard.iqcElectCompDashList.length;//Muc 28
    this.tiLeSpDat = Number(((this.tongSlSpNhapKho / (this.tongSlSpNhapKho + this.tongSlSpKhongDat)) * 100).toFixed(3));//Mục 12
    this.tiLeBTPDat = Number(((this.tongSlBTPNhapKho / (this.tongSlBTPNhapKho + this.tongSlBTPKhongDat)) * 100).toFixed(3));//Mục 15
    this.tiLeSPDatThongSo = Number(((this.soMauSPDat / this.tongSoMauDoSP) * 100).toFixed(3));//Mục 31
    this.tiLeBTPDrvDatThongSo = Number(((this.soMauBTPDrvDat / this.tongSoMauDoBTPDrv) * 100).toFixed(3));//Mục 35

    //  console.log('1',calculated);
    //  console.log('dat',this.chartSLDat);
    //  console.log('khong dat',this.chartSLKhongDat);
    //  console.log('chart nhân nhượng',this.chartSLNhanNhuong);
    //  console.log('chart tổng số lượng',this.chartTongSL);
    //update chart mục 40
    if (this.chart40.length === 0) {// khi không có dữ liệu để hiển thị
      const datasets = [{
        data: [{ key: '', value: 1 }],
        backgroundColor: [
          'rgba(0, 0, 0, 0)',
        ],
        borderColor: [
          'rgba(0,0,0,0.7)',
        ],
        labels: [' ']
      }]
      const options = {
        plugins: {
          datalabels: {
            align: 'center',
            anchor: 'center',
            formatter: (value: any) => '',
          },
          legend: {
            display: true,
            position: "right",
            align: "center"
          },
        }
      }
      this.myChartChatLuongNhap.options = options;
      this.myChartChatLuongNhap.data.datasets = datasets
      this.myChartChatLuongNhap.data.labels = this.chart40labels;
      this.myChartChatLuongNhap!.update();
    } else {// khi có dữ liệu để hiển thị
      const datasets = [{
        data: this.chart40 as unknown,
        backgroundColor: ["#7FDBFF", "#3d9970", "#39cccc"]
      }]
      const options = {
        plugins: {
          datalabels: {
            align: 'center',
            anchor: 'center',
            formatter: (value: any, context: any) => {
              //Khởi tạo biến chứa dữ liệu trong context
              // console.log(context.chart.data.datasets[0].data)
              const data: any[] = context.chart.data.datasets[0].data
              //Khởi tạo biến chứa kết quả tính tổng
              let total = 0;
              data.forEach((element: any) => {
                total += element.value
              });;
              // console.log(total)
              //Khởi tạo biến chứa kết quả tính toán %
              const percenTageValue = (value.value / total * 100).toFixed(3)
              return `${percenTageValue}%`
            },
            font: {
              size: 20
            }
          },
          legend: {
            display: true,
            position: "right",
            align: "center"
          },
        }
      }
      this.myChartChatLuongNhap.options = options;
      this.myChartChatLuongNhap.data.datasets = datasets
      this.myChartChatLuongNhap.data.labels = this.chart40labels;
      this.myChartChatLuongNhap!.update();
    }
    //Mục 41
    const datasetsMuc41 = [{
      data: this.chartSLDat as unknown,
      datalabels: {
        align: 'end',
        anchor: 'center',
        formatter: (i: any) => i.soLuong,
        font: {
          size: 20
        }
      },
      label: 'Số lượng đạt',
      barThickness: 40

    }, {
      type: 'bar',
      data: this.chartSLKhongDat,
      datalabels: {
        align: 'end',
        anchor: 'end',
        formatter: (i: any) => i.soLuong,
        font: {
          size: 20
        }
      },
      label: 'Số lượng không đạt',
      barThickness: 40
    },
    {
      type: 'bar',
      data: this.chartSLNhanNhuong,
      datalabels: {
        align: 'end',
        anchor: 'end',
        formatter: (i: any) => i.soLuong,
        font: {
          size: 20
        }
      },
      label: 'Số lượng nhân nhượng',
      barThickness: 40
    },
    {
      type: 'line',
      data: this.chartTongSL,
      datalabels: {
        align: 'end',
        anchor: 'end',
        formatter: (i: any) => i.soLuong,
        font: {
          size: 20
        }
      },
      label: 'Tổng số lượng nhập',
      backgroundColor: '#36a2eb',
      borderColor: '#36a2eb',
    }
    ]
    //update chart muc 41
    this.myChartTTVatTu.data.datasets = datasetsMuc41;
    this.myChartTTVatTu.data.labels = this.labelsChart41;
    this.myChartTTVatTu.options.plugins.zoom.limits.y.max = chart41MaxValue;
    this.myChartTTVatTu.update();
    console.log("search chart 41", this.labelsChart41);
    //Tạo data cho từng chart -> cần để các trường có tên giống nhau vì đang set trong 1 option
    let tongLoiChart: { errName: string, checkingQuantity: number }[] = []
    let tongRutNghiemChart: { errName: string, checkingQuantity: number }[] = []
    let labelsChart42: string[] = [];
    for (let i = 0; i < this._listOfDataDashBoard.iqcElectCompErrsList.length; i++) {
      const item: { errName: string, checkingQuantity: number } = { errName: this._listOfDataDashBoard.iqcElectCompErrsList[i].errName, checkingQuantity: this._listOfDataDashBoard.iqcElectCompErrsList[i].checkingQuantity };
      tongLoiChart.push(item);
      const item1: { errName: string, checkingQuantity: number } = { errName: this._listOfDataDashBoard.iqcElectCompErrsList[i].errName, checkingQuantity: this._listOfDataDashBoard.iqcElectCompErrsList[i].quantity };
      tongRutNghiemChart.push(item1);
      labelsChart42.push(item.errName);
    }
    const chart42MaxValue = this.caculateMaxValue42(tongLoiChart);
    // gán vào trong data chart 42
    const datasetsMuc42 = [{
      data: tongLoiChart as unknown,
      datalabels: {
        align: 'end',
        anchor: 'end',
        formatter: (i: any) => i.checkingQuantity,
        font: {
          size: 20
        }
      },
      label: 'Tổng số lượng rút nghiệm',
      barThickness: 40
    },
    {
      data: tongRutNghiemChart as unknown,
      datalabels: {
        align: 'end',
        anchor: 'end',
        formatter: (i: any) => i.checkingQuantity,
        font: {
          size: 20
        }
      },
      label: 'Tổng lỗi',
      barThickness: 40
    }]
    //update chart muc 42
    this.myCharthatLuongHang.data.datasets = datasetsMuc42
    this.myCharthatLuongHang.data.labels = labelsChart42;
    this.myCharthatLuongHang.options.plugins.zoom.limits.y.max = chart42MaxValue;
    this.myCharthatLuongHang.update();
  }
  ngOnInit(): void {
    // console.log("date", this.searchBody)
    // console.log("start date", this.startDate)
    // console.log("end date", this.endDate)
    // document.getElementById("startDate")!.innerHTML = this.startDate!
    // Tỉ lệ lỗi các bộ phận SX so với mục tiêu
    const config = {
      type: 'bar',
      data: {
        type: 'bar',
        labels: ['LR LED', 'Thiết bị chiếu sáng', 'DTTD', 'CNPT', 'SMART'],
        datasets: [{
          data: [{ key: 'LR LED', value: 20 }, { key: 'Thiết bị chiếu sáng', value: 20 }, { key: 'DTTD', value: 15 }, { key: 'CNPT', value: 20 }, { key: 'SMART', value: 25 }] as unknown,
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.value,
            font: {
              size: 20
            }
          },
          backgroundColor: [
            'rgba(127, 219, 225, 1)',
          ],
          tension: 0.1,
          label: 'Tỉ lệ lỗi',
          barThickness: 40
        },
        {
          type: 'line',
          data: [{ key: 'LR LED', value: 30 }, { key: 'Thiết bị chiếu sáng', value: 25 }, { key: 'DTTD', value: 10 }, { key: 'CNPT', value: 25 }, { key: 'SMART', value: 10 }],
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.value,
            font: {
              size: 20,
            },

          },
          backgroundColor: [
            'rgba(201, 12, 12, 1)',
          ],
          borderColor: 'rgba(201, 12, 12, 1)',
          label: 'Tỉ lệ lỗi mục tiêu',
        }
        ],

      },
      options: {
        maintainAspectRatio: false,
        parsing: {
          xAxisKey: 'key',
          yAxisKey: 'value',
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            }
          },
          x: {
            // ticks: {
            //   // For a category axis, the val is the index so the lookup via getLabelForValue is needed
            //   callback: (value:any, index:any, values:any):string => {
            //     console.log('value:',value,index,values)
            //     // Hide every 2nd tick label

            //     return 'hello';
            //   },
            // },
            grid: {
              display: false,
            }
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
              threshold: 10
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy'
            },
            limits: {
              y: { min: 0, max: 35 }
            },
          },
          // title: {
          //   display: true,
          //   text: 'Tỉ lệ lỗi các bộ phận SX so với mục tiêu',
          //   font: {
          //     size: 30,
          //   }
          // },
        }
      },
      plugins: [ChartDataLabels],
    };
    // render init block
    const myChart = new Chart(
      document.getElementById('myChart') as HTMLCanvasElement,
      config as ChartConfiguration
    );

    const configNhomLoi = {
      type: 'pie',
      data: {
        datasets: [{
          data: [{ key: 'Nhóm lỗi thao tác', value: 30 }, { key: 'Nhóm lỗi vật tư', value: 60 }, { key: 'Nhóm lỗi máy', value: 90 }] as unknown,
          datalabels: {
            align: 'center',
            anchor: 'center',
            formatter: (value: any, context: any) => {
              const data: any[] = context.chart.data.datasets[0].data
              //Khởi tạo biến chứa kết quả tính tổng
              let total = 0;
              data.forEach((element: any) => {
                total += element.value
              });;
              // console.log(total)
              //Khởi tạo biến chứa kết quả tính toán %
              const percenTageValue = (value.value / total * 100).toFixed(2)
              return `${percenTageValue}%`
            },
            font: {
              size: 20,

            }
          },
          backgroundColor: ["#7FDBFF", "#3d9970", "#39cccc"],
        }],
        labels: ['Nhóm lỗi thao tác', 'Nhóm lỗi vật tư', 'Nhóm lỗi máy']
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right",
            align: "center"
          },
          // title: {
          //   display: true,
          //   text: 'Phân tích nhóm lỗi trong sản xuất',
          //   font: {
          //     size: 30,
          //   }
          // },
        },
      },
      plugins: [ChartDataLabels],
      position: {
        legend: 'right'
      },
    };
    // Phân tích nhóm lỗi trong sx
    const myChartNhomLoi = new Chart(
      document.getElementById('myChartNhomLoi') as HTMLCanvasElement,
      configNhomLoi as ChartConfiguration
    )
    //Top sản phẩm nhiều lỗi nhất trong sx
    const configSPNhieuLoi = {
      type: 'bar',
      data: {
        labels: ['Buld 40W', 'Downlight AT đổi màu', 'Module AT 20', 'Driver downlight', 'Driver Led Dây', 'Đèn đường 200W'],
        datasets: [{
          data: [{ key: 'Buld 40W', value: 200 }, { key: 'Downlight AT đổi màu', value: 300 }, { key: 'Module AT 20', value: 30 }, { key: 'Driver downlight', value: 50 }, { key: 'Driver Led Dây', value: 30 }, { key: 'Đèn đường 200W', value: 20 }] as unknown,
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.value,
            font: {
              size: 20
            }
          },
          label: 'Lỗi',
          barThickness: 40,
          tension: 0.1,
          backgroundColor: [
            '#ffdf02',
          ]
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        parsing: {
          xAxisKey: 'key',
          yAxisKey: 'value',

        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            }
          },
          x: {
            grid: {
              display: false,
            }
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
              threshold: 10
            },
            zoom: {
              // enabled: true,
              // mode: 'xy', // Allow zooming in the x direction
              wheel: {
                enabled: true,
              },
            },
            limits: {
              y: { min: 0, max: 350 }
            },
          },
          // title: {
          //   display: true,
          //   text: 'Top sản phẩm nhiều lỗi nhất trong sản xuất',
          //   font: {
          //     size: 30,
          //   }
          // }
        }
      },
      plugins: [ChartDataLabels],

    };

    const myChartSPNhieuLoi = new Chart(
      document.getElementById('myChartSPNhieuLoi') as HTMLCanvasElement,
      configSPNhieuLoi as ChartConfiguration
    )
    // Tạo chart Mục Tổng hợp chất lượng hàng hóa
    const configChatLuongNhap = {
      type: 'pie',
      data: {
        datasets: [{
          data: this.chart40 as unknown,
          backgroundColor: ["#7FDBFF", "#3d9970", "#39cccc"]
        }],
        labels: this.chart40labels,

      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          // title: {
          //   display: true,
          //   text: 'Tổng hợp chất lượng nhập hàng hoá',
          //   font: {
          //     size: 30,
          //   }
          // },
          datalabels: {
            align: 'center',
            anchor: 'center',
            formatter: (value: any, context: any) => {
              //Khởi tạo biến chứa dữ liệu trong context
              // console.log(context.chart.data.datasets[0].data)
              const data: any[] = context.chart.data.datasets[0].data
              //Khởi tạo biến chứa kết quả tính tổng
              let total = 0;
              data.forEach((element: any) => {
                total += element.value
              });;
              // console.log(total)
              //Khởi tạo biến chứa kết quả tính toán %
              const percenTageValue = (value.value / total * 100).toFixed(3)
              return `${percenTageValue}%`
            },
            font: {
              size: 20
            }
          },
          legend: {
            display: true,
            position: "right",
            align: "center",

          },
        }
      },
      plugins: [ChartDataLabels],
    };
    this.myChartChatLuongNhap = new Chart(
      document.getElementById('myChartChatLuongNhap') as HTMLCanvasElement,
      configChatLuongNhap as ChartConfiguration
    )
    //Mục 42 Tổng hợp tình trạng vật tư mua hàng
    const configChatLuongHang = {
      type: 'bar',
      data: {
        datasets: [{
          type: 'bar',
          data: this.tongLoiChart as unknown,
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.checkingQuantity,
            font: {
              size: 20
            }
          },
          label: 'Tổng số lượng rút nghiệm',
          barThickness: 40
        }
          , {
          type: 'bar',
          data: this.tongRutNghiemChart,
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.checkingQuantity,
            font: {
              size: 20
            }
          },
          label: 'Tổng lỗi',

        },

        ]
      },
      options: {
        maintainAspectRatio: false,
        parsing: {
          xAxisKey: 'errName',
          yAxisKey: 'checkingQuantity',
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          x: {
            grid: {
              display: false,
            }
          }
        },
        plugins: {
          pan: {
            enabled: true,
            mode: 'xy',
            threshold: 10
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
                speed: 0.3,
              }
            },
            limits: {
              y: { min: 0, max: 500 }
            }
          },
          // title: {
          //   display: true,
          //   text: 'Thống kê lỗi chất lượng hàng mua',
          //   font: {
          //     size: 30,
          //   }
          // },
          legend: {
            display: true,
            position: "bottom",
            align: "center"
          },
        }
      },
      plugins: [ChartDataLabels],
    };

    this.myCharthatLuongHang = new Chart(
      document.getElementById('myChartChatLuongHang') as HTMLCanvasElement,
      configChatLuongHang as ChartConfiguration
    )
    //Mục 41 Tổng hợp tình trạng vật tư mua hàng
    const configTTVatTu = {
      type: 'bar',
      data: {
        datasets: [{
          data: this.chartSLDat as unknown,
          datalabels: {
            align: 'end',
            anchor: 'center',
            formatter: (i: any) => i.soLuong,
            font: {
              size: 20
            },
            barThickness: 40
          },
          label: 'Số lượng đạt',
        }, {
          type: 'bar',
          data: this.chartSLKhongDat,
          datalabels: {
            formatter: (i: any) => i.soLuong,
            font: {
              size: 20
            },
            barThickness: 40
          },
          label: 'Số lượng không đạt',
        },
        {
          type: 'bar',
          data: this.chartSLNhanNhuong,
          datalabels: {

            formatter: (i: any) => i.soLuong,
            font: {
              size: 20
            },
            barThickness: 40
          },
          label: 'Số lượng nhân nhượng',
        },
        {
          type: 'line',
          data: this.chartTongSL,
          datalabels: {
            formatter: (i: any) => i.soLuong,
            font: {
              size: 20
            }
          },
          label: 'Tổng số lượng nhập',
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        parsing: {
          xAxisKey: 'name',
          yAxisKey: 'soLuong',

        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            }
          },
          x: {
            // ticks: {
            //   // For a category axis, the val is the index so the lookup via getLabelForValue is needed
            //   callback: (value:any, index:any, values:any):string => {
            //     // Hide every 2nd tick label

            //     return this.chartTongSL[value].name.substr(0,6) + '...';
            //   },

            // },
            grid: {
              display: false,
            }
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy',
              threshold: 10
            },
            zoom: {
              wheel: {
                enabled: true,
                speed: 0.3,
              }
            },
            limits: {
              y: { min: 0, max: 14000000 }
            }
          },
          legend: {
            display: true,
            position: "bottom",
          },
          // title: {
          //   display: true,
          //   text: 'Tổng hợp tình trạng vật tư mua hàng',
          //   font: {
          //     size: 30,
          //   }
          // },
        }
      },
      plugins: [ChartDataLabels],
    };

    this.myChartTTVatTu = new Chart(
      document.getElementById('myChartTTVatTu') as HTMLCanvasElement,
      configTTVatTu as ChartConfiguration
    )
    this.getAllDataDashBoard();
  }
  // ------------------------------------- Hàm thực hiện tìm kiếm theo khoảng thời gian ------------------------------------
  getAllDataDashBoard(): void {
    //reset dữ liệu
    this.listOfDataDashBoard = [];
    this.chart40 = [];
    this.chart40labels = [];
    this.chartSLDat = [];
    this.chartSLKhongDat = [];
    this.chartSLNhanNhuong = [];
    this.chartTongSL = [];
    this.tongSlSpNhapKho = 0;// 9. tổng số lượng nhập kho
    this.tongSlSpKhongDat = 0;// 10. tổng số lượng không đạt
    this.tiLeSpDat = 0; //11.
    this.tiLeSpLoiQuaTrinh = 0; //12.
    this.tongSlBTPNhapKho = 0; //13.
    this.tongSlBTPKhongDat = 0; //14.
    this.tiLeBTPDat = 0; //15.
    this.tiLeBTPLoiQuaTrinh = 0; //16.
    this.choPheDuyetLenhSX = 0; //17.
    this.choPheDuyetBBKT = 0; //18.
    this.soLoKT = 0; //19.
    this.soLoKhongDat = 0; //20.
    this.soLoNhanNhuong = 0; //21.
    this.slVatTuNhap = 0; //22.
    this.slVatTuDat = 0; //23.
    this.slVatTuKhongDat = 0; //24.
    this.slVatTuNhanNhuong = 0; //25.
    this.tiLeLoiVatTuQTSX = 0; //26.
    this.tongSoNCC = 0; //27.
    this.tongSoBienBanIQC = 0; //28.
    this.tongSoMauDoSP = 0; //29.
    this.soMauSPDat = 0; //30.
    this.tiLeSPDatThongSo = 0; //31.
    this.soMauSPKhongDat = 0; //32.
    this.tongSoMauDoBTPDrv = 0; //33.
    this.soMauBTPDrvDat = 0; //34.
    this.tiLeBTPDrvDatThongSo = 0; //35.
    this.soMauBTPDrvKhongDat = 0; //36.
    this.labelsChart41 = []
    //test
    this.http.post<any>('http://localhost:8449/dashboard/home-default', this.searchBody).subscribe(res => {
      // chạy trên hệ thống
      // this.http.post<any>('http://192.168.68.92/qms/dashboard/home-default', this.searchBody).subscribe(res => {
      this.listOfDataDashBoard = res;
      console.log('result dashboard', res);
      this.choPheDuyetLenhSX = res.countIqcWaitApproveStatus
      this.choPheDuyetBBKT = res.countWorkOrderWaitStatus
      // tính toán dữ liệu và lưu vào biến hiển thị
      for (let i = 0; i < this.listOfDataDashBoard.pqcStoreCheckList.length; i++) {
        // ------------------ Trường hợp là thành phẩm ( productype === 1) --------------------
        if (this.listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Đạt' && this.listOfDataDashBoard.pqcStoreCheckList[i].productType === 1) {// Mục 9
          // console.log("19",this.tongSlSpNhapKho + Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
          // cách tính sl nhập kho
          this.tongSlSpNhapKho = this.tongSlSpNhapKho + Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
        }
        if (this.listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Không đạt' && this.listOfDataDashBoard.pqcStoreCheckList[i].productType === 1) {// Mục 10
          // console.log("19",this.tongSlSpKhongDat + Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
          // cách tính sl không đạt
          this.tongSlSpKhongDat += Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
        }
        // ------------------ Trường hợp là bán thành phẩm ( productype === 0) --------------------
        if (this.listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Đạt' && this.listOfDataDashBoard.pqcStoreCheckList[i].productType === 0) {//Mục 13
          // console.log("19",this.tongSlBTPNhapKho + Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
          this.tongSlBTPNhapKho += Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
        }
        if (this.listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Không đạt' && this.listOfDataDashBoard.pqcStoreCheckList[i].productType === 0) {//Mục 14
          // console.log("19",this.tongSlBTPKhongDat + Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
          this.tongSlBTPKhongDat += Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
        }
      }
      for (let i = 0; i < this.listOfDataDashBoard.pqcQuantityDashResponseList.length; i++) {
        if (this.listOfDataDashBoard.pqcQuantityDashResponseList[i].conclude === 'Đạt') {//Mục 19
          this.soLoKT++;
        }
        if (this.listOfDataDashBoard.pqcQuantityDashResponseList[i].conclude === 'Không đạt') {//Mục 20
          this.soLoKhongDat++;
        }
        if (this.listOfDataDashBoard.pqcQuantityDashResponseList[i].conclude === 'Nhân nhượng') {//Mục 21
          this.soLoNhanNhuong++;
        }
      }
      for (let i = 0; i < this.listOfDataDashBoard.iqcElectCompDashList.length; i++) {
        if (this.listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Đạt nhập kho' && Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0 ||
          this.listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Không đạt trả về' && Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0 ||
          this.listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Nhập kho nhân nhượng' && Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0) {//Mục 22
          this.slVatTuNhap += Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity);
        }
        if (this.listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Đạt nhập kho' && Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0) {//Mục 23
          this.slVatTuDat += Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity);
        }
        if (this.listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Không đạt trả về' && Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0) {//Mục 24
          this.slVatTuKhongDat += Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity);
        }
        if (this.listOfDataDashBoard.iqcElectCompDashList[i].conclusion === 'Nhập kho nhân nhượng' && Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity) > 0) {//Mục 25
          this.slVatTuNhanNhuong += Number(this.listOfDataDashBoard.iqcElectCompDashList[i].poQuantity);
        }
      }
      //Xây dựng thông tin cho mục 41
      let count = 0;
      let calculated = this.listOfDataDashBoard.iqcElectCompDashList.reduce((acc: any[], item: any) => {//27
        let accItem = acc.find((ai: any) => ai.origin === item.origin)
        if (accItem) {
          accItem.tongSoLuong = Number(accItem.tongSoLuong) + Number(item.poQuantity)
          if (item.conclusion === 'Đạt nhập kho') {
            accItem.slDatNhapKho = Number(accItem.slDatNhapKho) + Number(item.poQuantity);
          }
          if (item.conclusion === 'Không đạt trả về') {
            accItem.slKhongDat = Number(accItem.slKhongDat) + Number(item.poQuantity);
          }
          if (item.conclusion === 'Nhập kho nhân nhượng') {
            accItem.slNhanNhuong = Number(accItem.slNhanNhuong) + Number(item.poQuantity);
          }
        } else {
          count++
          item.tongSoLuong = Number(item.poQuantity);
          item.slDatNhapKho = 0;
          item.slKhongDat = 0;
          item.slNhanNhuong = 0;
          if (item.conclusion === 'Đạt nhập kho') {
            item.slDatNhapKho = Number(item.poQuantity);
          }
          if (item.conclusion === 'Không đạt trả về') {
            item.slKhongDat = Number(item.poQuantity);
          }
          if (item.conclusion === 'Nhập kho nhân nhượng') {
            item.slNhanNhuong = Number(item.poQuantity);
          }
          acc.push(item)
          const chartSLDatItem: { id: number, name: string, soLuong: number, status: boolean } = { id: count, name: item.origin, soLuong: 0, status: false };
          const chartSLKhongDatItem: { id: number, name: string, soLuong: number, status: boolean } = { id: count, name: item.origin, soLuong: 0, status: false };
          const chartSLNhanNhuongItem: { id: number, name: string, soLuong: number, status: boolean } = { id: count, name: item.origin, soLuong: 0, status: false };
          const chartTongSLItem: { id: number, name: string, soLuong: number, status: boolean } = { id: count, name: item.origin, soLuong: 0, status: false };
          this.chartSLDat.push(chartSLDatItem);
          this.chartSLKhongDat.push(chartSLKhongDatItem);
          this.chartSLNhanNhuong.push(chartSLNhanNhuongItem);
          this.chartTongSL.push(chartTongSLItem);
          this.labelsChart41.push(chartSLDatItem.name);
        }
        return acc;
      }, [])
      // xây dựng dữ liệu cho  chart mục 40
      let calculatedChart = this.listOfDataDashBoard.iqcElectCompDashList.reduce((acc: any[], item: any) => {//27
        let accItem = acc.find((ai: any) => ai.conclusion === item.conclusion)
        if (accItem) {
          if (Number(item.poQuantity) > 0) {
            accItem.tongSoLuong = Number(accItem.tongSoLuong) + Number(item.poQuantity);
          }
        } else {
          item.tongSoLuong = Number(item.poQuantity);
          acc.push(item);
        }
        return acc;
      }, [])
      calculatedChart = calculatedChart.filter((item: any) => item.conclusion !== null && item !== '1')
      // console.log("Mục 40: ",calculatedChart);
      //Gán vào phần hiển thị chart
      for (let i = 0; i < calculatedChart.length; i++) {
        const item: { key: string, value: number } = { key: calculatedChart[i].conclusion, value: calculatedChart[i].tongSoLuong };
        this.chart40.push(item);
        this.chart40labels.push(calculatedChart[i].conclusion);
      }
      // cập nhật số lượng,tên của danh sách nhà cung cấp
      calculated = calculated.filter((item: any) => item.origin !== null && item.origin !== '')
      this.chartSLDat = this.chartSLDat.filter((item: any) => item.name !== null && item.name !== '')
      this.chartSLKhongDat = this.chartSLKhongDat.filter((item: any) => item.name !== null && item.name !== '')
      this.chartSLNhanNhuong = this.chartSLNhanNhuong.filter((item: any) => item.name !== null && item.name !== '')
      this.chartTongSL = this.chartTongSL.filter((item: any) => item.name !== null && item.name !== '')
      this.labelsChart41 = this.labelsChart41.filter((item: any) => item !== null && item !== '')
      this.tongSoNCC = calculated.length;
      //gán thông tin vào data chart 41
      for (let i = 0; i < calculated.length; i++) {
        this.chartSLDat[i].soLuong += Number(calculated[i].slDatNhapKho);
        this.chartSLKhongDat[i].soLuong += Number(calculated[i].slKhongDat);
        this.chartSLNhanNhuong[i].soLuong += Number(calculated[i].slNhanNhuong);
        this.chartTongSL[i].soLuong += Number(calculated[i].tongSoLuong);
      }
      // tính toán số lượng max để set hiển thị cho trục y chart 41
      const chart41MaxValue = this.caculateMaxValue(this.chartTongSL);
      for (let i = 0; i < this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList.length; i++) {
        if (this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].conclude === 'Đạt' ||
          this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].conclude === 'Không đạt') {//Mục 29
          this.tongSoMauDoSP += Number(this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].quantity);
        }
        if (this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].conclude === 'Đạt') {//Mục 30
          this.soMauSPDat += Number(this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].quantity);
        }
        if (this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].conclude === 'Không đạt') {//Mục 32
          this.soMauSPKhongDat += Number(this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList[i].quantity);
        }
      }
      for (let i = 0; i < this.listOfDataDashBoard.pqcPhotoElectDashResponseList.length; i++) {
        if (this.listOfDataDashBoard.pqcPhotoElectDashResponseList[i].conclude === 'Đạt' ||
          this.listOfDataDashBoard.pqcPhotoElectDashResponseList[i].conclude === 'Không đạt') {//Mục 33
          this.tongSoMauDoBTPDrv += Number(this.listOfDataDashBoard.pqcPhotoElectDashResponseList[i].quantity);
        }
        if (this.listOfDataDashBoard.pqcPhotoElectDashResponseList[i].conclude === 'Đạt') {//Mục 34
          this.soMauBTPDrvDat += Number(this.listOfDataDashBoard.pqcPhotoElectDashResponseList[i].quantity);
        }
        if (this.listOfDataDashBoard.pqcPhotoElectDashResponseList[i].conclude === 'Không đạt') {//Mục 36
          this.soMauBTPDrvKhongDat += Number(this.listOfDataDashBoard.pqcPhotoElectDashResponseList[i].quantity);
        }
      }
      this.tongSoBienBanIQC = this.listOfDataDashBoard.iqcElectCompDashList.length;//Muc 28
      this.tiLeSpDat = Number(((this.tongSlSpNhapKho / (this.tongSlSpNhapKho + this.tongSlSpKhongDat)) * 100).toFixed(3));//Mục 12
      this.tiLeBTPDat = Number(((this.tongSlBTPNhapKho / (this.tongSlBTPNhapKho + this.tongSlBTPKhongDat)) * 100).toFixed(3));//Mục 15
      this.tiLeSPDatThongSo = Number(((this.soMauSPDat / this.tongSoMauDoSP) * 100).toFixed(3));//Mục 31
      this.tiLeBTPDrvDatThongSo = Number(((this.soMauBTPDrvDat / this.tongSoMauDoBTPDrv) * 100).toFixed(3));//Mục 35

      // console.log('1',calculated);
      // console.log('chart',this.chart40);
      // console.log('labels',this.chart40labels);
      // console.log('4',this.chartSLNhanNhuong);
      console.log('5', this.tiLeBTPDrvDatThongSo);
      // ---------------------------------------------- tạm thời thay thế bằng các chart cố định ---------------------------------------------------
      // //update chart mục 40
      // if (this.chart40.length === 0) {// khi không có dữ liệu để hiển thị
      //   const datasets = [{
      //     data: [{ key: '', value: 1 }],
      //     backgroundColor: [
      //       'rgba(0, 0, 0, 0)',
      //     ],
      //     borderColor: [
      //       'rgba(0,0,0,0.7)',
      //     ],
      //     labels: [' ']
      //   }]
      //   const options = {
      //     plugins: {
      //       // title: {
      //       //   display: true,
      //       //   text: 'Tổng hợp chất lượng nhập hàng hoá',
      //       //   font: {
      //       //     size: 30,
      //       //   }
      //       // },
      //       datalabels: {
      //         align: 'center',
      //         anchor: 'center',
      //         formatter: (value: any) => '',
      //       },
      //       legend: {
      //         display: true,
      //         position: "right",
      //         align: "center"
      //       },
      //     }
      //   }
      //   this.myChartChatLuongNhap.options = options;
      //   this.myChartChatLuongNhap.data.datasets = datasets
      //   this.myChartChatLuongNhap.data.labels = this.chart40labels;
      //   this.myChartChatLuongNhap!.update();
      // } else {// khi có dữ liệu để hiển thị
      //   const datasets = [{
      //     data: this.chart40 as unknown,
      //     backgroundColor: ["#7FDBFF", "#3d9970", "#39cccc"]
      //   }]
      //   const options = {
      //     maintainAspectRatio: false,
      //     responsive: true,
      //     plugins: {
      //       // title: {
      //       //   display: true,
      //       //   text: 'Tổng hợp chất lượng nhập hàng hoá',
      //       //   font: {
      //       //     size: 30,
      //       //   }
      //       // },
      //       datalabels: {
      //         align: 'center',
      //         anchor: 'center',
      //         formatter: (value: any, context: any) => {
      //           //Khởi tạo biến chứa dữ liệu trong context
      //           // console.log(context.chart.data.datasets[0].data)
      //           const data: any[] = context.chart.data.datasets[0].data
      //           //Khởi tạo biến chứa kết quả tính tổng
      //           let total = 0;
      //           data.forEach((element: any) => {
      //             total += element.value
      //           });
      //           // console.log(total)
      //           //Khởi tạo biến chứa kết quả tính toán %
      //           const percenTageValue = (value.value / total * 100).toFixed(3)
      //           return `${percenTageValue}%`
      //         },
      //         font: {
      //           size: 20
      //         }
      //       },
      //       legend: {
      //         display: true,
      //         position: "right",
      //         align: "center"
      //       },
      //     }
      //   }

      //   this.myChartChatLuongNhap.options = options;
      //   this.myChartChatLuongNhap.data.datasets = datasets
      //   this.myChartChatLuongNhap.data.labels = this.chart40labels;
      //   this.myChartChatLuongNhap!.update();
      // }
      const datasets = [{ // chart 40 thay thế cho sự kiện
        data: [{ key: 'Đạt nhập kho', value: 95 }, { key: 'Không đạt', value: 1 }, { key: 'Nhân nhượng', value: 4 }] as unknown,
        backgroundColor: ["#7FDBFF", "#3d9970", "#39cccc"]
      }]
      const options = {
        maintainAspectRatio:false,
        responsive: true,
        plugins: {
          // title: {
          //   display: true,
          //   text: 'Tổng hợp chất lượng nhập hàng hoá',
          //   font: {
          //     size: 30,
          //   }
          // },
          datalabels: {
            align: 'center',
            anchor: 'center',
            formatter: (value: any, context: any) => {
              //Khởi tạo biến chứa dữ liệu trong context
              // console.log(context.chart.data.datasets[0].data)
              const data: any[] = context.chart.data.datasets[0].data
              //Khởi tạo biến chứa kết quả tính tổng
              let total = 0;
              data.forEach((element: any) => {
                total += element.value
              });
              // console.log(total)
              //Khởi tạo biến chứa kết quả tính toán %
              const percenTageValue = (value.value / total * 100).toFixed(0)
              return `${percenTageValue}%`
            },
            font:{
              size:20
            }
          },
          legend: {
            display: true,
            position: "right",
            align: "center"
          },
        }
      }
      this.myChartChatLuongNhap.options = options;
      this.myChartChatLuongNhap.data.datasets = datasets
      this.myChartChatLuongNhap.data.labels = ['Đạt nhập kho', 'Không đạt', 'Nhân nhượng'];
      this.myChartChatLuongNhap!.update();
      //Mục 41
      // const datasetsMuc41 = [{
      //   data: this.chartSLDat as unknown,
      //   datalabels: {
      //     align: 'end',
      //     anchor: 'center',
      //     formatter: (i: any) => i.soLuong,
      //     font: {
      //       size: 15
      //     }
      //   },
      //   label: 'Số lượng đạt',
      //   barThickness: 40,
      //   backgroundColor: [
      //     '#a0e482',
      //   ]
      // }, {
      //   type: 'bar',
      //   data: this.chartSLKhongDat,
      //   datalabels: {
      //     align: 'end',
      //     anchor: 'center',
      //     formatter: (i: any) => i.soLuong,
      //     font: {
      //       size: 15
      //     }
      //   },
      //   label: 'Số lượng không đạt',
      //   barThickness: 40
      // },
      // {
      //   type: 'bar',
      //   data: this.chartSLNhanNhuong,
      //   datalabels: {
      //     align: 'end',
      //     anchor: 'center',
      //     formatter: (i: any) => i.soLuong,
      //     font: {
      //       size: 15
      //     }
      //   },
      //   label: 'Số lượng nhân nhượng',
      //   barThickness: 40
      // },
      // {
      //   type: 'line',
      //   data: this.chartTongSL,
      //   datalabels: {
      //     align: 'end',
      //     anchor: 'center',
      //     formatter: (i: any) => i.soLuong,
      //     font: {
      //       size: 15
      //     }
      //   },
      //   label: 'Tổng số lượng nhập',
      //   backgroundColor: '#36a2eb',
      //   borderColor: '#36a2eb',
      // }
      // ]
      // //update chart muc 41
      // // Biến xác định độ dài chart
      // if (this.chartTongSL.length >= 10) {
      //   document.getElementById("chartItemTwo")!.style.width = "1500px";
      // } else if (this.chartTongSL.length >= 15) {
      //   document.getElementById("chartItemTwo")!.style.width = "3000px";
      // } else if (this.chartTongSL.length >= 5) {
      //   document.getElementById("chartItemTwo")!.style.width = "1000px";
      // }
      const datasetsMuc41 = [{ // chart 41 thay thế cho sự kiện
        data: [{
          name:'NCC 001',
          soLuong:12000000
        },{
          name:'NCC 002',
          soLuong:7500000
        },
        {
          name:'NCC 003',
          soLuong:10050000
        },
        {
          name:'NCC 004',
          soLuong:5570000
        }] as unknown,
        datalabels: {
          align: 'end',
          anchor: 'center',
          formatter: (i: any) => i.soLuong,
          font:{
            size:15
           }
        },
        label: 'Số lượng đạt',
        barThickness: 40,
        backgroundColor: [
          '#a0e482',
        ]
      }, {
        type: 'bar',
        data: [{
          name:'NCC 001',
          soLuong:3000
        },{
          name:'NCC 002',
          soLuong:1875
        },
        {
          name:'NCC 003',
          soLuong:2512
        },
        {
          name:'NCC 004',
          soLuong:1393
        }] as unknown,
        datalabels: {
          align: 'end',
          anchor: 'center',
          formatter: (i: any) => i.soLuong,
          font:{
            size:15
           }
        },
        label: 'Số lượng không đạt',
        barThickness: 40
      },
      {
        type: 'bar',
        data: [{
          name:'NCC 001',
          soLuong:5000
        },{
          name:'NCC 002',
          soLuong:3000
        },
        {
          name:'NCC 003',
          soLuong:4020
        },
        {
          name:'NCC 004',
          soLuong:2228
        }] as unknown,
        datalabels: {
          align: 'end',
          anchor: 'center',
          formatter: (i: any) => i.soLuong,
          font:{
            size:15
           }
        },
        label: 'Số lượng nhân nhượng',
        barThickness: 40
      },
      {
        type: 'line',
        data: [{
          name:'NCC 001',
          soLuong:12008000
        },{
          name:'NCC 002',
          soLuong:7504875
        },
        {
          name:'NCC 003',
          soLuong:10056532
        },
        {
          name:'NCC 004',
          soLuong:5573621
        }] as unknown,
        datalabels: {
          align: 'end',
          anchor: 'center',
          formatter: (i: any) => i.soLuong,
          font:{
            size:15
           }
        },
        label: 'Tổng số lượng nhập',
        backgroundColor: '#36a2eb',
        borderColor: '#36a2eb',
      }
      ]
        // document.getElementById("chartItemTwo")!.style.width = "1500px";
      this.myChartTTVatTu.data.datasets = datasetsMuc41
      // this.myChartTTVatTu.data.labels = this.labelsChart41;
      this.myChartTTVatTu.data.labels = ['NCC 001','NCC 002','NCC 003','NCC 004'];//su kien
      this.myChartTTVatTu.options.plugins.zoom.limits.y.max = chart41MaxValue;
      this.myChartTTVatTu.update();
      console.log("Defauts chart 41", this.labelsChart41);
      //Tạo data cho từng chart -> cần để các trường có tên giống nhau vì đang set trong 1 option
      let tongLoiChart: { errName: string, checkingQuantity: number }[] = []
      let tongRutNghiemChart: { errName: string, checkingQuantity: number }[] = []
      let labelsChart42: string[] = [];
      for (let i = 0; i < this.listOfDataDashBoard.iqcElectCompErrsList.length; i++) {
        const item: { errName: string, checkingQuantity: number } = { errName: this.listOfDataDashBoard.iqcElectCompErrsList[i].errName, checkingQuantity: this.listOfDataDashBoard.iqcElectCompErrsList[i].checkingQuantity };
        tongLoiChart.push(item);
        const item1: { errName: string, checkingQuantity: number } = { errName: this.listOfDataDashBoard.iqcElectCompErrsList[i].errName, checkingQuantity: this.listOfDataDashBoard.iqcElectCompErrsList[i].quantity };
        tongRutNghiemChart.push(item1);
        labelsChart42.push(item.errName);
      }
      const chart42MaxValue = this.caculateMaxValue42(tongLoiChart);
      // gán vào trong data chart 42
      // const datasetsMuc42 = [{
      //   data: tongLoiChart as unknown,
      //   datalabels: {
      //     align: 'end',
      //     anchor: 'end',
      //     formatter: (i: any) => i.checkingQuantity,
      //     font: {
      //       size: 20
      //     }
      //   },
      //   label: 'Tổng số lượng rút nghiệm',
      //   barThickness: 40,
      //   backgroundColor: [
      //     '#86c7f3',
      //   ]
      // },
      // {
      //   data: tongRutNghiemChart as unknown,
      //   datalabels: {
      //     align: 'end',
      //     anchor: 'end',
      //     formatter: (i: any) => i.checkingQuantity,
      //     font: {
      //       size: 20
      //     }
      //   },
      //   label: 'Tổng lỗi',
      //   barThickness: 40,
      //   backgroundColor: [
      //     '#ffa1b5',
      //   ]
      // }]
      const datasetsMuc42 = [{//su kien
        data: [{
          errName:'Lỗi bộ vỏ',
          checkingQuantity:350
        },
        {
          errName:'Lỗi PCB',
          checkingQuantity:200
        },
        {
          errName:'Lỗi ngoại quan',
          checkingQuantity:450
        }] as unknown,
        datalabels: {
          align: 'end',
          anchor: 'end',
          formatter: (i: any) => i.checkingQuantity,
          font:{
            size:20
           }
        },
        label: 'Tổng số lượng rút nghiệm',
        barThickness: 40,
        backgroundColor: [
          '#86c7f3',
        ]
      },
      {
        data:[{
          errName:'Lỗi bộ vỏ',
          checkingQuantity:30
        },
        {
          errName:'Lỗi PCB',
          checkingQuantity:5
        },
        {
          errName:'Lỗi ngoại quan',
          checkingQuantity:22
        }] as unknown,
        datalabels: {
          align: 'end',
          anchor: 'end',
          formatter: (i: any) => i.checkingQuantity,
          font:{
            size:20
           }
        },
        label: 'Tổng lỗi',
        barThickness: 40,
        backgroundColor: [
          '#ffa1b5',
        ]
      }]
      //update chart muc 42
      this.myCharthatLuongHang.data.datasets = datasetsMuc42
      // this.myCharthatLuongHang.data.labels = labelsChart42;
      this.myCharthatLuongHang.data.labels = ['Lỗi bộ vỏ','Lỗi PCB','Lỗi ngoại quan'];//sukien
      this.myCharthatLuongHang.options.plugins.zoom.limits.y.max = chart42MaxValue;
      this.myCharthatLuongHang.update();
      //Khởi tạo danh sách gợi ý phục vụ cho multiselect
      this.branchList = this.listOfDataDashBoard.workOrderWaitStatusResponseList.reduce((acc: any, item: any) => {
        let accItem = acc.find((ai: any) => ai.branchName === item.branchName)
        if (!accItem) {
          item.checkBox = true;
          acc.push(item)
        }
        return acc;
      }, [])
      this.branchList = this.branchList.filter((item: any) => item.groupName !== null);
      this._branchList = this.branchList
      // this.resetListGuideByBranch(this.listBranchNameSearch)
      // console.log("list branch: ",this.branchList);
      this.groupList = this.listOfDataDashBoard.workOrderWaitStatusResponseList.reduce((acc: any, item: any) => {
        let accItem = acc.find((ai: any) => ai.groupName === item.groupName)
        if (!accItem) {
          item.checkBox = true;
          acc.push(item)
        }
        return acc;
      }, [])
      // console.log("list group: ",this.groupList);
      this.groupList = this.groupList.filter((item: any) => item.groupName !== null);
      this._groupList = this.groupList
      this.productionCodeList = this.listOfDataDashBoard.workOrderWaitStatusResponseList.reduce((acc: any, item: any) => {
        let accItem = acc.find((ai: any) => ai.productionCode === item.productionCode)
        if (!accItem) {
          item.checkBox = true;
          acc.push(item)
        }
        return acc;
      }, [])
      // console.log("list production code: ",this.productionCodeList);
      this.productionCodeList = this.productionCodeList.filter((item: any) => item.groupName !== null);
      this._productionCodeList = this.productionCodeList
      this.productionNameList = this.listOfDataDashBoard.workOrderWaitStatusResponseList.reduce((acc: any, item: any) => {
        let accItem = acc.find((ai: any) => ai.productionName === item.productionName)
        if (!accItem) {
          item.checkBox = true;
          acc.push(item)
        }
        return acc;
      }, [])
      // console.log("list production name: ",this.productionNameList);
      this.productionNameList = this.productionNameList.filter((item: any) => item.groupName !== null)
      this._productionNameList = this.productionNameList
      //Thay đổi màu cho ô chứa tỉ lệ % (chưa cần chạy)
      // this.getColor(this.tiLeSpDat,'tiLeSpDat');
      // this.getColor(this.tiLeSpLoiQuaTrinh,'tiLeSpLoiQuaTrinh');
      // this.getColor(this.tiLeBTPDat,'tiLeBTPDat');
      // this.getColor(this.tiLeBTPLoiQuaTrinh,'tiLeBTPLoiQuaTrinh');
      // this.getColor(this.tiLeLoiVatTuQTSX,'tiLeLoiVatTuQTSX');
      // this.getColor(this.tiLeSPDatThongSo,'tiLeSPDatThongSo');
      // this.getColor(this.tiLeBTPDrvDatThongSo,'tiLeBTPDrvDatThongSo');

    })
  }
  openPopupReport(): void {
    this.popupReport = true;
  }

  openPopupConfig(): void {
    this.popupConfig = true;
  }

  closePopupReport(): void {
    this.popupReport = false;
  }

  closePopupConfig(): void {
    this.popupConfig = false;
  }
  // change color
  getColor(value: number, index: any): void {
    if (value >= 0 && value < 40) {
      document.getElementById(index as string)!.style.color = 'red';
      console.log('red', value, index);
    } else if (value >= 40 && value < 70) {
      document.getElementById(index as string)!.style.color = 'yellow';
      console.log('yellow', value, index);
    } else if (value > 70) {
      document.getElementById(index as string)!.style.color = 'green';
      console.log('green', value, index);
    } else if (Number.isNaN(value)) {
      document.getElementById(index as string)!.style.color = 'red';
    }
  }
  //format giá trị từ 1000 -> 1k
  formatNumberToK(value: number): string {
    return value > 1000 ? (value / 1000).toFixed(0) : (value / 1000).toFixed(0);
  }
  viewFullScreen(index: any): void {
    //Cập nhật thông tin chung
    this.labelTitle = !this.labelTitle;
    this.closeScreen = !this.closeScreen;
    const chartBox = document.querySelectorAll('.chart-list')[index];
    chartBox.classList.toggle('view-full-screen')
    // update lại font size các trục x, y
    if (this.closeScreen === true) {
      Chart.defaults.font.size = 30;
    } else {
      Chart.defaults.font.size = 10;
    }
    if (index === 0 || index === 1) {
      const chartBox2 = document.querySelectorAll('.chart-item-two-list')[index];
      chartBox2.classList.toggle('view-full-screen-item-list');
      console.log(window.innerWidth);
    } else if (index === 2 || index === 3) {
      if (index === 2) {
        if (this.closeScreen === true) {
          document.getElementById('myChartSPNhieuLoi-style')!.style.width = '2000px'
        } else {
          document.getElementById('myChartSPNhieuLoi-style')!.style.width = '808px'
        }
      }
      const chartBox2 = document.querySelectorAll('.chart-item-two-list')[index];
      chartBox2.classList.toggle('view-full-screen-item-list');
      console.log(window.innerWidth);
    } else if (index === 4 || index === 5) {
      //set lại độ dài chart 5
      if (index === 4) {
        if (this.closeScreen === true) {
          // Cập nhật độ dài chart
          if (this.chartTongSL.length >= 10) {
            document.getElementById("chartItemTwo")!.style.width = "5000px";
          } else if (this.chartTongSL.length >= 15) {
            document.getElementById("chartItemTwo")!.style.width = "9000px";
          } else if (this.chartTongSL.length >= 5) {
            document.getElementById("chartItemTwo")!.style.width = "2000px";
          }
        } else {
          // Cập nhật độ dài chart
          if (this.chartTongSL.length >= 10) {
            document.getElementById("chartItemTwo")!.style.width = "1500px";
          } else if (this.chartTongSL.length >= 15) {
            document.getElementById("chartItemTwo")!.style.width = "3000px";
          } else if (this.chartTongSL.length >= 5) {
            document.getElementById("chartItemTwo")!.style.width = "1000px";
          }
        }
      }
      const chartBox2 = document.querySelectorAll('.chart-item-two-list')[index];
      chartBox2.classList.toggle('view-full-screen-item-list');
    }
  }
  caculateMaxValue(list: any): number {//tính toán giá trị max khi zoom chart 41
    let max = 0;
    for (let i = 0; i < list.length; i++) {
      if (Number(list[i].soLuong) >= max) {
        max = Number(list[i].soLuong)
      }
    }
    // Cập nhật giá trị max cho trục y
    if (max > 100) {
      max += 50
    } else if (max > 1000) {
      max += 200
    } else if (max > 10000) {
      max += 1000;
    } else if (max > 100000) {
      max += 10000;
    } else if (max > 1000000) {
      max += 100000;
    } else if (max > 10000000) {
      max += 1000000;
    } else if (max > 100000000) {
      max += 10000000;
    } else if (max > 1000000000) {
      max += 100000000;
    }
    return max;
  }
  caculateMaxValue42(list: any): number {//tính toán giá trị max khi zoom chart 42
    let max = 0;
    for (let i = 0; i < list.length; i++) {
      if (Number(list[i].checkingQuantity) >= max) {
        max = Number(list[i].checkingQuantity)
      }
    }
    // Cập nhật giá trị max cho trục y
    if (max > 100) {
      max += 50
    } else if (max > 1000) {
      max += 200
    }
    return max;
  }
  updateWheelZoomSpeed(max: number): number {
    let speed = 0.1;
    if (speed > 100) {
      speed = 0.1
    } else if (speed > 1000) {
      speed = 0.3
    } else if (speed > 10000) {
      speed = 0.5;
    } else if (speed > 100000) {
      speed = 1;
    } else if (speed > 1000000) {
      speed = 10;
    } else if (speed > 10000000) {
      speed = 100;
    } else if (speed > 100000000) {
      speed = 1000;
    } else if (speed > 1000000000) {
      speed = 10000;
    }
    return speed;
  }
}
