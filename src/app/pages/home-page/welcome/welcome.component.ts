import { ApplicationConfig, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartOptions,Chart } from 'chart.js';
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
  _listOfDataDashBoard:any ={ pqcPhotoElectDashResponseList:[],
    pqcPhotoElectProductDashResponseList:[],
    pqcQuantityDashResponseList:[],
    pqcStoreCheckList:[],
    workOrderWaitStatusResponseList:[],
    iqcElectCompDashList:[],
    iqcElectCompErrsList:[]} ;

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
  @Input() startDate = this.datePipe.transform(new Date(new Date().getFullYear(),new Date().getMonth(), 1), 'yyyy-MM-dd');
  @Input() endDate = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  searchBody: { startDate: string | null, endDate: string | null, productCode: string, productName: string, branchName: string, groupName: string } = {
    startDate:this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1),'yyyy-MM-dd'),
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
  //Khởi tạo data cho chart mục 40
  chart40: { key: string, value: number }[] = [];
  chart40labels: any[] = [];
  //Mục 41 data gốc chart
  chartSLDat: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartSLKhongDat: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartSLNhanNhuong: { id: number, name: string, soLuong: number, status: boolean }[] = []
  chartTongSL: { id: number, name: string, soLuong: number, status: boolean }[] = []
  //Mục 41 data show chart
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
  listGroupNameSearch:any[]=[];
  listBranchNameSearch:any[]=[];
  branchSearchKey=''
  groupSearchKey=''
  productCodeSearchKey=''
  productNameSearchKey=''
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
  branchList:any[] = [];
  groupList:any[] = [];
  productionCodeList:any[] = [];
  productionNameList:any[] = [];
  _branchList:any[] = [];
  _groupList:any[] = [];
  _productionCodeList:any[] = [];
  _productionNameList:any[] = [];
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
  checkDate() {
    this.searchBody.startDate = this.startDate
    this.searchBody.endDate = this.endDate
    console.log(this.startDate, this.endDate)
  }
  // test function angular material
  testing():void{
    // lọc theo ngành
    if(this.listBranchNameSearch.length >0){
      this._listOfDataDashBoard = this.dashboardFilterByBranch(this.listBranchNameSearch)
      //lọc theo tổ
      if(this.listGroupNameSearch.length >0){
        this._listOfDataDashBoard = this.dashboardFilterByGroup(this.listGroupNameSearch);
        console.log("test btn 2: ",this._listOfDataDashBoard)
      }
    }else{
      alert("Chưa chọn đơn vị sản xuất")
    }
    this.resetDataAfterFilter()
    console.log("test btn: ",this._listOfDataDashBoard)
  }
  //---------------------------------- filter theo đơn vị sản xuất -------------------------------
  onBranchNameChange(item:any,e:any){
    // lưu vào danh sách tìm kiếm
    let accItem = this.listBranchNameSearch.find((ai:any)=> ai.key === item)
    if(accItem){
      accItem.checkBox = !accItem.checkBox;
      this.listBranchNameSearch = this.listBranchNameSearch.filter(item=> item.checkBox === true)
    }else{
      const item1:{key:string,checkBox:boolean}= {key:item,checkBox:true}
      this.listBranchNameSearch.push(item1);
    }
    //cập nhật lại danh sách gợi ý mã sp và tên sp
  this.resetListGuideByBranch(this.listBranchNameSearch)
  console.log("branch",this.listBranchNameSearch)
  }
  OnBranchNameInputChange():void{
    this._branchList = this.branchList.filter((item:any)=> item.branchName.toLowerCase().includes(this.branchSearchKey.toLowerCase()))
    // console.log("1111: ",e)
  }
  // --------------------------------- filter theo group (tổ) ------------------------------------
  onGroupNameChange(item:any,e:any){
    // lưu vào danh sách tìm kiếm
    let accItem = this.listGroupNameSearch.find((ai:any)=> ai.key === item)
    if(accItem){
      accItem.checkBox = !accItem.checkBox;
      this.listGroupNameSearch = this.listGroupNameSearch.filter(item=> item.checkBox === true)
      e.isUserInput = true;
    }else{
      const item1:{key:string,checkBox:boolean}= {key:item,checkBox:true}
      this.listGroupNameSearch.push(item1);
    }
    //cập nhật lại danh sách gợi ý mã sp và tên sp
  this.resetListGuideByGroup(this.listGroupNameSearch)
    console.log("test",this.listGroupNameSearch)
    console.log("test1",e)
  }
  OnGroupNameInputChange(e:Event):void{
    this._groupList = this.groupList.filter((item:any)=> item.groupName.toLowerCase().includes(this.groupSearchKey.toLowerCase()))
    console.log("1111: ",e)
  }
  // --------------------------------- filter theo mã sản phẩm (production code) ------------------------------------
  onProductionCodeChange(item:any,e:any){
    // lưu vào danh sách tìm kiếm
    let accItem = this.listGroupNameSearch.find((ai:any)=> ai.key === item)
    if(accItem){
      accItem.checkBox = !accItem.checkBox;
      this.listGroupNameSearch = this.listGroupNameSearch.filter(item=> item.checkBox === true)
      e.isUserInput = true;
    }else{
      const item1:{key:string,checkBox:boolean}= {key:item,checkBox:true}
      this.listGroupNameSearch.push(item1);
    }
    //cập nhật lại danh sách gợi ý mã sp và tên sp
  this.resetListGuideByGroup(this.listGroupNameSearch)
    console.log("test",this.listGroupNameSearch)
    console.log("test1",e)
  }
  // ------------------------------------------------------- chức năng lọc -------------------------------------------------------
  //Hàm lọc thông tin tìm kiếm theo ngành
  dashboardFilterByBranch(key:any[]):any{
    console.log("key",key)
    let listOfDataDashBoard:any = {
      pqcPhotoElectDashResponseList:[],
      pqcPhotoElectProductDashResponseList:[],
      pqcQuantityDashResponseList:[],
      pqcStoreCheckList:[],
      workOrderWaitStatusResponseList:[],
      iqcElectCompDashList:this.listOfDataDashBoard.iqcElectCompDashList,
      iqcElectCompErrsList:this.listOfDataDashBoard.iqcElectCompErrsList
    }
    for(let i = 0; i<key.length;i++){
      const pqcPhotoElectDashResponseList: any[] = this.listOfDataDashBoard.pqcPhotoElectDashResponseList.filter((item:any)=> item.branchName.toLowerCase().includes(key[i].key.toLowerCase()));
      const pqcPhotoElectProductDashResponseList: any[] = this.listOfDataDashBoard.pqcPhotoElectProductDashResponseList.filter((item:any)=> item.branchName.toLowerCase().includes(key[i].key.toLowerCase()));
      const pqcQuantityDashResponseList: any[] = this.listOfDataDashBoard.pqcQuantityDashResponseList.filter((item:any)=> item.branchName.toLowerCase().includes(key[i].key.toLowerCase()));
      const pqcStoreCheckList: any[] = this.listOfDataDashBoard.pqcStoreCheckList.filter((item:any)=> item.branchName.toLowerCase().includes(key[i].key.toLowerCase()));
      const workOrderWaitStatusResponseList: any[] = this.listOfDataDashBoard.workOrderWaitStatusResponseList.filter((item:any)=> item.branchName.toLowerCase().includes(key[i].key.toLowerCase()));
      console.log("result: ",pqcPhotoElectDashResponseList)
      pqcPhotoElectDashResponseList.forEach((item:any)=>{
        listOfDataDashBoard.pqcPhotoElectDashResponseList.push(item)
      })
      pqcPhotoElectProductDashResponseList.forEach((item:any)=>{
        listOfDataDashBoard.pqcPhotoElectProductDashResponseList.push(item)
      })
      pqcQuantityDashResponseList.forEach((item:any)=>{
        listOfDataDashBoard.pqcQuantityDashResponseList.push(item)
      })
      pqcStoreCheckList.forEach((item:any)=>{
        listOfDataDashBoard.pqcStoreCheckList.push(item)
      })
      workOrderWaitStatusResponseList.forEach((item:any)=>{
        listOfDataDashBoard.workOrderWaitStatusResponseList.push(item)
      })
    }
    return listOfDataDashBoard
  }
  //Hàm lọc thông tin tìm kiếm theo tổ
  dashboardFilterByGroup(key:any[]):any{
    console.log("key",key)
    let listOfDataDashBoard:any = {
      pqcPhotoElectDashResponseList:[],
      pqcPhotoElectProductDashResponseList:[],
      pqcQuantityDashResponseList:[],
      pqcStoreCheckList:[],
      workOrderWaitStatusResponseList:[],
      iqcElectCompDashList:this._listOfDataDashBoard.iqcElectCompDashList,
      iqcElectCompErrsList:this._listOfDataDashBoard.iqcElectCompErrsList
    }
    for(let i = 0; i<key.length;i++){
      const pqcPhotoElectDashResponseList: any[] = this._listOfDataDashBoard.pqcPhotoElectDashResponseList.filter((item:any)=> item.groupName.toLowerCase().includes(key[i].key.toLowerCase()));
      const pqcPhotoElectProductDashResponseList: any[] = this._listOfDataDashBoard.pqcPhotoElectProductDashResponseList.filter((item:any)=> item.groupName.toLowerCase().includes(key[i].key.toLowerCase()));
      const pqcQuantityDashResponseList: any[] = this._listOfDataDashBoard.pqcQuantityDashResponseList.filter((item:any)=> item.groupName.toLowerCase().includes(key[i].key.toLowerCase()));
      const pqcStoreCheckList: any[] = this._listOfDataDashBoard.pqcStoreCheckList.filter((item:any)=> item.groupName.toLowerCase().includes(key[i].key.toLowerCase()));
      const workOrderWaitStatusResponseList: any[] = this._listOfDataDashBoard.workOrderWaitStatusResponseList.filter((item:any)=> item.groupName.toLowerCase().includes(key[i].key.toLowerCase()));
      console.log("result: ",pqcPhotoElectDashResponseList)
      pqcPhotoElectDashResponseList.forEach((item:any)=>{
        listOfDataDashBoard.pqcPhotoElectDashResponseList.push(item)
      })
      pqcPhotoElectProductDashResponseList.forEach((item:any)=>{
        listOfDataDashBoard.pqcPhotoElectProductDashResponseList.push(item)
      })
      pqcQuantityDashResponseList.forEach((item:any)=>{
        listOfDataDashBoard.pqcQuantityDashResponseList.push(item)
      })
      pqcStoreCheckList.forEach((item:any)=>{
        listOfDataDashBoard.pqcStoreCheckList.push(item)
      })
      workOrderWaitStatusResponseList.forEach((item:any)=>{
        listOfDataDashBoard.workOrderWaitStatusResponseList.push(item)
      })
    }
    return listOfDataDashBoard
  }
  //Hàm lọc thông tin tìm kiếm theo mã Sản phẩm
  //Hàm tính toán lại dữ liệu
  resetDataAfterFilter():void{
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
       }
       return acc;
     }, [])
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
     //Gán vào phần hiển thị chart
     for (let i = 0; i < calculatedChart.length; i++) {
       const item: { key: string, value: number } = { key: calculatedChart[i].conclusion, value: calculatedChart[i].tongSoLuong };
       this.chart40.push(item);
       this.chart40labels.push(calculatedChart[i].conclusion);
     }
     calculated = calculated.filter((item: any) => item.origin !== null && item.origin !== '')
     this.chartSLDat = this.chartSLDat.filter((item: any) => item.name !== null && item.name !== '')
     this.chartSLKhongDat = this.chartSLKhongDat.filter((item: any) => item.name !== null && item.name !== '')
     this.chartSLNhanNhuong = this.chartSLNhanNhuong.filter((item: any) => item.name !== null && item.name !== '')
     this.chartTongSL = this.chartTongSL.filter((item: any) => item.name !== null && item.name !== '')
     this.tongSoNCC = calculated.length;
     //gán thông tin vào data chart
     for (let i = 0; i < calculated.length; i++) {
       this.chartSLDat[i].soLuong += Number(calculated[i].slDatNhapKho);
       this.chartSLKhongDat[i].soLuong += Number(calculated[i].slKhongDat);
       this.chartSLNhanNhuong[i].soLuong += Number(calculated[i].slNhanNhuong);
       this.chartTongSL[i].soLuong += Number(calculated[i].tongSoLuong);
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

     console.log('1',calculated);
     console.log('dat',this.chartSLDat);
     console.log('khong dat',this.chartSLKhongDat);
     console.log('chart nhân nhượng',this.chartSLNhanNhuong);
     console.log('chart tổng số lượng',this.chartTongSL);
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
         font:{
          size:20
         }
        },
        label: 'Số lượng đạt',
        barThickness: 30

     }, {
       type: 'bar',
       data: this.chartSLKhongDat,
       datalabels: {
         align: 'end',
         anchor: 'end',
         formatter: (i: any) => i.soLuong,
         font:{
          size:20
         }
       },
       label: 'Số lượng không đạt',
       barThickness: 30
     },
     {
       type: 'bar',
       data: this.chartSLNhanNhuong,
       datalabels: {
         align: 'end',
         anchor: 'end',
         formatter: (i: any) => i.soLuong,
         font:{
          size:20
         }
       },
       label: 'Số lượng nhân nhượng',
       barThickness: 30
     },
     {
       type: 'line',
       data: this.chartTongSL,
       datalabels: {
         align: 'end',
         anchor: 'end',
         formatter: (i: any) => i.soLuong,
         font:{
          size:20
         }
       },
       label: 'Tổng số lượng nhập',
       backgroundColor: '#36a2eb',
       borderColor: '#36a2eb',
     }
     ]
     //update chart muc 41
     this.myChartTTVatTu.data.datasets = datasetsMuc41
     this.myChartTTVatTu.update();
     //Tạo data cho từng chart -> cần để các trường có tên giống nhau vì đang set trong 1 option
     let tongLoiChart: { errName: string, checkingQuantity: number }[] = []
     let tongRutNghiemChart: { errName: string, checkingQuantity: number }[] = []
     for (let i = 0; i < this._listOfDataDashBoard.iqcElectCompErrsList.length; i++) {
       const item: { errName: string, checkingQuantity: number } = { errName: this._listOfDataDashBoard.iqcElectCompErrsList[i].errName, checkingQuantity: this._listOfDataDashBoard.iqcElectCompErrsList[i].checkingQuantity };
       tongLoiChart.push(item);
       const item1: { errName: string, checkingQuantity: number } = { errName: this._listOfDataDashBoard.iqcElectCompErrsList[i].errName, checkingQuantity: this._listOfDataDashBoard.iqcElectCompErrsList[i].quantity };
       tongRutNghiemChart.push(item1);
     }
     // gán vào trong data chart
     const datasetsMuc42 = [{
       data: tongLoiChart as unknown,
       datalabels: {
         align: 'end',
         anchor: 'end',
         formatter: (i: any) => i.checkingQuantity,
         font:{
          size:20
         }
       },
       label: 'Tổng số lượng rút nghiệm',
       barThickness: 30
     },
     {
       data: tongRutNghiemChart as unknown,
       datalabels: {
         align: 'end',
         anchor: 'end',
         formatter: (i: any) => i.checkingQuantity,
         font:{
          size:20
         }
       },
       label: 'Tổng lỗi',
       barThickness: 30
     }]
     //update chart muc 42
     this.myCharthatLuongHang.data.datasets = datasetsMuc42
     this.myCharthatLuongHang.update();
  }
  //reset danh sách gợi ý theo group
  resetListGuideByGroup(group:any[]):void{
    let _productionCodeList:any[] =[];
    let _productionNameList:any[] =[];
    group.forEach((item:any)=>{
      const productionCodeList = this.productionCodeList.filter((item1:any)=> item1.groupName!.includes(item.key))
      productionCodeList.forEach((item:any)=>{_productionCodeList.push(item)});
      const productionNameList = this.productionNameList.filter((item1:any)=>item1.groupName!.includes(item.key))
      productionNameList.forEach((item:any)=>{_productionNameList.push(item)});
    })
    this._productionCodeList = _productionCodeList;
    this._productionNameList = _productionNameList;
    if(group.length === 0){
      this._productionCodeList =  this.productionCodeList;
    this._productionNameList = this.productionNameList;
    }
    console.log("rs 4:",_productionCodeList);
    console.log("rs 5:",_productionNameList);
  }
   //reset danh sách gợi ý theo branch
   resetListGuideByBranch(group:any[]):void{
    let _groupList:any[] =[];
    let _productionCodeList:any[] =[];
    let _productionNameList:any[] =[];
    group.forEach((item:any)=>{
      const groupList = this.groupList.filter((item1:any)=>item1.branchName!.includes(item.key))
      groupList.forEach((item:any)=>{_groupList.push(item)});
      const productionCodeList = this.productionCodeList.filter((item1:any)=>item1.branchName!.includes(item.key))
      productionCodeList.forEach((item:any)=>{_productionCodeList.push(item)});
      const productionNameList = this.productionNameList.filter((item1:any)=>item1.branchName!.includes(item.key))
      productionNameList.forEach((item:any)=>{_productionNameList.push(item)});
    })
    this._groupList = _groupList;
    this._productionCodeList = _productionCodeList;
    this._productionNameList = _productionNameList;
    if(group.length === 0){
      this._groupList = this.groupList;
      this._productionCodeList =  this.productionCodeList;
    this._productionNameList = this.productionNameList;
    }
    console.log("rs 1:",_groupList);
    console.log("rs 2:",_productionCodeList);
    console.log("rs 3:",_productionNameList);
  }
  ngOnInit(): void {
    console.log("date", this.searchBody)
    console.log("start date", this.startDate)
    console.log("end date", this.endDate)
    // document.getElementById("startDate")!.innerHTML = this.startDate!
    // Tỉ lệ lỗi các bộ phận SX so với mục tiêu
    const config = {
      type: 'bar',
      data: {
        type: 'bar',
        datasets: [{
          data: [{ key: 'LR LED', value: 20 }, { key: 'Thiết bị chiếu sáng', value: 20 }, { key: 'DTTD', value: 15 }, { key: 'CNPT', value: 20 }, { key: 'SMART', value: 25 }] as unknown,
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.value,
            font:{
              size:20
            }
          },
          tension: 0.1,
          label: 'Tỉ lệ lỗi',
          barThickness: 30
        },
        {
          type: 'line',
          data: [{ key: 'LR LED', value: 30 }, { key: 'Thiết bị chiếu sáng', value: 25 }, { key: 'DTTD', value: 10 }, { key: 'CNPT', value: 25 }, { key: 'SMART', value: 10 }],
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.value,
            font:{
              size:20
            }
          },
          label: 'Tỉ lệ lỗi mục tiêu',

        }
        ],

      },
      options: {
        maintainAspectRatio:false,
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
          // zoom: {
          //   zoom: {
          //     enabled: true,
          //     mode: 'x', // Allow zooming in the x direction
          //     rangeMin: {
          //       x: 0 // Min value of the duration option
          //     },
          //     rangeMax: {
          //       x: 100 // Max value of the duration option
          //     },
          //     wheel: {
          //       enabled: true,
          //     },
          //     pinch: {
          //       enabled: true
          //     },
          //   }
          // },
          // title: {
          //   display: true,
          //   text: 'Tỉ lệ lỗi các bộ phận SX so với mục tiêu',
          //   font: {
          //     size: 30,
          //   }
          // },
          legend: {
            display: true,
            position: 'top',
            font: {
              size: 30,
            }
          }
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
            font:{
              size:20
            }
          },
        }],
        labels: ['Nhóm lỗi thao tác', 'Nhóm lỗi vật tư', 'Nhóm lỗi máy']
      },
      options: {
        maintainAspectRatio:false,
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
        datasets: [{
          data: [{ key: 'Buld 40W', value: 200 }, { key: 'Downlight AT đổi màu', value: 300 }, { key: 'Module AT 20', value: 30 }, { key: 'Driver downlight', value: 50 }, { key: 'Driver Led Dây', value: 30 }, { key: 'Đèn đường 200W', value: 20 }] as unknown,
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.value,
            font:{
              size:20
            }
          },
          label: 'Lỗi',
          barThickness: 30,
          tension: 0.1
        }]
      },
      options: {
        maintainAspectRatio:false,
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
          // zoom: {
          //   zoom: {
          //     enabled: true,
          //     mode: 'xy', // Allow zooming in the x direction
          //     rangeMin: {
          //       x: 0 // Min value of the duration option
          //     },
          //     rangeMax: {
          //       x: 100 // Max value of the duration option
          //     },
          //     wheel: {
          //       enabled: true,
          //     },
          //     pinch: {
          //       enabled: true
          //     },
          //   }
          // },
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
        }],
        labels: this.chart40labels
      },
      options: {
        maintainAspectRatio:false,
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
            font:{
              size:20
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
            font:{
              size:20
            }
          },
          label: 'Tổng số lượng rút nghiệm',
          barThickness: 30
        }
          , {
          type: 'bar',
          data: this.tongRutNghiemChart,
          datalabels: {
            align: 'end',
            anchor: 'end',
            formatter: (i: any) => i.checkingQuantity,
            font:{
              size:20
            }
          },
          label: 'Tổng lỗi',

        },

        ]
      },
      options: {
        maintainAspectRatio:false,
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
            font:{
              size:20
            },
            barThickness: 30
          },
          label: 'Số lượng đạt',
        }, {
          type: 'bar',
          data: this.chartSLKhongDat,
          datalabels: {
            formatter: (i: any) => i.soLuong,
            font:{
              size:20
            },
            barThickness: 30
          },
          label: 'Số lượng không đạt',
        },
        {
          type: 'bar',
          data: this.chartSLNhanNhuong,
          datalabels: {

            formatter: (i: any) => i.soLuong,
            font:{
              size:20
            },
            barThickness: 30
          },
          label: 'Số lượng nhân nhượng',
        },
        {
          type: 'line',
          data: this.chartTongSL,
          datalabels: {
            formatter: (i: any) => i.soLuong,
            font:{
              size:20
            }
          },
          label: 'Tổng số lượng nhập',
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio:false,
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
            ticks: {
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: (value:any, index:any, values:any):string => {
                // Hide every 2nd tick label
                
                return this.chartTongSL[value].name.substr(0,6) + '...';
              },

            },
            grid: {
              display: false,
            }
          }
        },
        plugins: {
          // zoom: {
          //   zoom: {
          //     wheel: {
          //       enabled: true,
          //     },
          //     pinch: {
          //       enabled: true
          //     },
          //     mode: 'xy',
          //   }
          // },
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
    this.http.post<any>('http://localhost:8449/dashboard/home-default', this.searchBody).subscribe(res => {
      this.listOfDataDashBoard = res;
      console.log('result dashboard', res);
      this.choPheDuyetLenhSX = res.countIqcWaitApproveStatus
      this.choPheDuyetBBKT = res.countWorkOrderWaitStatus
      // tính toán dữ liệu và lưu vào biến hiển thị
      for (let i = 0; i < this.listOfDataDashBoard.pqcStoreCheckList.length; i++) {
        if (this.listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Đạt' && this.listOfDataDashBoard.pqcStoreCheckList[i].productType === 1) {// Mục 9
          // console.log("19",this.tongSlSpNhapKho + Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
          this.tongSlSpNhapKho = this.tongSlSpNhapKho + Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
        }
        if (this.listOfDataDashBoard.pqcStoreCheckList[i].conclude === 'Không đạt' && this.listOfDataDashBoard.pqcStoreCheckList[i].productType === 1) {// Mục 10
          // console.log("19",this.tongSlSpKhongDat + Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore))
          this.tongSlSpKhongDat += Number(this.listOfDataDashBoard.pqcStoreCheckList[i].quantityStore)
        }
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
      calculated = calculated.filter((item: any) => item.origin !== null && item.origin !== '')
      this.chartSLDat = this.chartSLDat.filter((item: any) => item.name !== null && item.name !== '')
      this.chartSLKhongDat = this.chartSLKhongDat.filter((item: any) => item.name !== null && item.name !== '')
      this.chartSLNhanNhuong = this.chartSLNhanNhuong.filter((item: any) => item.name !== null && item.name !== '')
      this.chartTongSL = this.chartTongSL.filter((item: any) => item.name !== null && item.name !== '')
      this.tongSoNCC = calculated.length;
      //gán thông tin vào data chart 41
      for (let i = 0; i < calculated.length; i++) {
        this.chartSLDat[i].soLuong += Number(calculated[i].slDatNhapKho);
        this.chartSLKhongDat[i].soLuong += Number(calculated[i].slKhongDat);
        this.chartSLNhanNhuong[i].soLuong += Number(calculated[i].slNhanNhuong);
        this.chartTongSL[i].soLuong += Number(calculated[i].tongSoLuong);
      }
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
      // console.log('5',this.chartTongSL);
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
        }]
        const options = {
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
                const percenTageValue = (value.value / total * 100).toFixed(3)
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
          font:{
            size:20
           }
        },
        label: 'Số lượng đạt',
        barThickness: 30
      }, {
        type: 'bar',
        data: this.chartSLKhongDat,
        datalabels: {
          align: 'end',
          anchor: 'center',
          formatter: (i: any) => i.soLuong,
          font:{
            size:20
           }
        },
        label: 'Số lượng không đạt',
        barThickness: 30
      },
      {
        type: 'bar',
        data: this.chartSLNhanNhuong,
        datalabels: {
          align: 'end',
          anchor: 'center',
          formatter: (i: any) => i.soLuong,
          font:{
            size:20
           }
        },
        label: 'Số lượng nhân nhượng',
        barThickness: 30
      },
      {
        type: 'line',
        data: this.chartTongSL,
        datalabels: {
          align: 'end',
          anchor: 'center',
          formatter: (i: any) => i.soLuong,
          font:{
            size:20
           }
        },
        label: 'Tổng số lượng nhập',
        backgroundColor: '#36a2eb',
        borderColor: '#36a2eb',
      }
      ]
      //update chart muc 41
      // Biến xác định độ dài chart
      if(this.chartTongSL.length >= 10){
        document.getElementById("chartItemTwo")!.style.width = "1500px";
      }else if(this.chartTongSL.length >= 15){
        document.getElementById("chartItemTwo")!.style.width = "3000px";
      }else if(this.chartTongSL.length >= 5){
        document.getElementById("chartItemTwo")!.style.width = "1000px";
      }
      this.myChartTTVatTu.data.datasets = datasetsMuc41
      this.myChartTTVatTu.update();
      //Tạo data cho từng chart -> cần để các trường có tên giống nhau vì đang set trong 1 option
      let tongLoiChart: { errName: string, checkingQuantity: number }[] = []
      let tongRutNghiemChart: { errName: string, checkingQuantity: number }[] = []
      for (let i = 0; i < this.listOfDataDashBoard.iqcElectCompErrsList.length; i++) {
        const item: { errName: string, checkingQuantity: number } = { errName: this.listOfDataDashBoard.iqcElectCompErrsList[i].errName, checkingQuantity: this.listOfDataDashBoard.iqcElectCompErrsList[i].checkingQuantity };
        tongLoiChart.push(item);
        const item1: { errName: string, checkingQuantity: number } = { errName: this.listOfDataDashBoard.iqcElectCompErrsList[i].errName, checkingQuantity: this.listOfDataDashBoard.iqcElectCompErrsList[i].quantity };
        tongRutNghiemChart.push(item1);
      }
      // gán vào trong data chart
      const datasetsMuc42 = [{
        data: tongLoiChart as unknown,
        datalabels: {
          align: 'end',
          anchor: 'end',
          formatter: (i: any) => i.checkingQuantity,
          font:{
            size:20
           }
        },
        label: 'Tổng số lượng rút nghiệm',
        barThickness: 30
      },
      {
        data: tongRutNghiemChart as unknown,
        datalabels: {
          align: 'end',
          anchor: 'end',
          formatter: (i: any) => i.checkingQuantity,
          font:{
            size:20
           }
        },
        label: 'Tổng lỗi',
        barThickness: 30
      }]
      //update chart muc 42
      this.myCharthatLuongHang.data.datasets = datasetsMuc42
      this.myCharthatLuongHang.update();
      //Khởi tạo danh sách gợi ý phục vụ cho multiselect
      this.branchList = this.listOfDataDashBoard.workOrderWaitStatusResponseList.reduce((acc:any,item:any)=>{
      let accItem = acc.find((ai:any)=> ai.branchName === item.branchName)
      if(!accItem){
       item.checkBox = true;
       acc.push(item) 
      }
      return acc;
      },[])
      this.branchList = this.branchList.filter((item:any)=>item.groupName !== null);
      this._branchList = this.branchList
      // this.resetListGuideByBranch(this.listBranchNameSearch)
      console.log("list branch: ",this.branchList);
      this.groupList = this.listOfDataDashBoard.workOrderWaitStatusResponseList.reduce((acc:any,item:any)=>{
        let accItem = acc.find((ai:any)=> ai.groupName === item.groupName)
        if(!accItem){
         item.checkBox = true;
         acc.push(item) 
        }
        return acc;
        },[])
        console.log("list group: ",this.groupList);
        this.groupList = this.groupList.filter((item:any)=>item.groupName !== null);
        this._groupList = this.groupList
        this.productionCodeList = this.listOfDataDashBoard.workOrderWaitStatusResponseList.reduce((acc:any,item:any)=>{
          let accItem = acc.find((ai:any)=> ai.productionCode === item.productionCode)
          if(!accItem){
           item.checkBox = true;
           acc.push(item) 
          }
          return acc;
          },[])
          console.log("list production code: ",this.productionCodeList);
          this.productionCodeList = this.productionCodeList.filter((item:any)=>item.groupName !== null);
          this._productionCodeList = this.productionCodeList
          this.productionNameList = this.listOfDataDashBoard.workOrderWaitStatusResponseList.reduce((acc:any,item:any)=>{
            let accItem = acc.find((ai:any)=> ai.productionName === item.productionName)
            if(!accItem){
             item.checkBox = true;
             acc.push(item) 
            }
            return acc;
            },[])
            console.log("list production name: ",this.productionNameList);
            this.productionNameList = this.productionNameList.filter((item:any)=>item.groupName !== null)
            this._productionNameList = this.productionNameList
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
}
