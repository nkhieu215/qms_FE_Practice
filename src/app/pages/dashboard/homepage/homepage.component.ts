import { Component, ViewChild, OnInit } from '@angular/core';
import { auto } from '@popperjs/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexDataLabels,
  ApexPlotOptions,
  ApexGrid,
  ApexLegend,
  ApexTheme
} from "ng-apexcharts";
import { PQCService } from 'src/app/share/_services/pqc.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  grid: ApexGrid | any;
  colors: any;
  legend: ApexLegend | any;
  title: ApexTitleSubtitle | any;
};

export type ChartOptionsPie = {
  title: ApexTitleSubtitle | any;
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  colors: any;
};

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chartPie") chartPie?: ChartComponent;
  public chartOptionsPie: Partial<ChartOptionsPie> | any;


  @ViewChild("chartPieIqc") chartPieIqc?: ChartComponent;
  public chartOptionsPieIqc: Partial<ChartOptionsPie> | any;

  formSearch: any = {};
  dataReport: any = {};

  constructor(private pqcService: PQCService,) {
    this.chartOptions = {};
    this.chartOptionsPie = {};
    this.chartOptionsPieIqc ={};
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    let data = {
      startDate: this.formSearch.startDate,
      endDate: this.formSearch.endDate,
      groupName: this.formSearch.group,
      branchName: this.formSearch.branch,
    }
    this.dataReport = await this.pqcService.reportDashboard(data);

    var chartData = await this.pqcService.reportDashboardChart(data);

    this.chartErrorByProduct(chartData.lstChartError);
    this.chartPieErorGroup(chartData.lstChartErrorGroup);
    this.chartPieErorGroupIQC(chartData.lstIQCStatus);
  }

  async chartPieErorGroupIQC(chartPieErrorGr:any[]){
    var color:string[]= [];
    var chartErrorName: any[] = [];
    var chartErrorValue: any[] = [];
    chartPieErrorGr.forEach(async e => {
      if(e.type == 'null'){
        chartErrorName.push("Khác");
      }else{
        chartErrorName.push(e.type);
      }
      color.push(this.getRandomColor2());
      chartErrorValue.push(Number(e.value));
    });
    console.log(chartErrorValue);

    this.chartOptionsPieIqc = {
      title: {
        text: "Tổng hợp chất lượng hàng hóa",
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#263238'
        },
      },
      series: chartErrorValue,
      chart: {
        width: "100%",
        type: "pie"
      },
      colors: color,
      labels: chartErrorName,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  async chartPieErorGroup(chartPieErrorGr:any[]){
    var color:string[]= [];
    var chartErrorName: any[] = [];
    var chartErrorValue: any[] = [];
    chartPieErrorGr.forEach(async e => {
      if(e.type == 'null'){
        chartErrorName.push("Khác");
      }else{
        chartErrorName.push(e.type);
      }
      color.push(this.getRandomColor2());
      chartErrorValue.push(Number(e.value));
    });
    console.log(chartErrorValue);


    this.chartOptionsPie = {
      title: {
        text: "Phân tích nhóm lỗi trong sản xuất",
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#263238'
        },
      },

      series: chartErrorValue,
      chart: {
        width: "100%",
        type: "pie"
      },
      colors: color,
      labels: chartErrorName,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }


  async chartErrorByProduct(chartProdName: any[]) {
    var chartErrorName: any[] = [];
    var chartErrorValue: any[] = [];
    var color:string[]= [];
    chartProdName.forEach(async e => {
      chartErrorName.push(e.type);
      chartErrorValue.push(e.value);
      color.push(this.getRandomColor2());
    });

    this.chartOptions = {
      series: [
        {
          name: "Số lượng lỗi",
          data: chartErrorValue
        }
      ],
      chart: {
        height: 400,
        type: "bar",
      },
      colors: color,
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: chartErrorName,
      },
      title: {
        text: "Thống kê lỗi theo sản phẩm",
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#263238'
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
    };
  }

  getRandomColor2() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while(length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }
}
