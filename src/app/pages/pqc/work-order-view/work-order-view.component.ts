import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-order-view',
  templateUrl: './work-order-view.component.html',
  styleUrls: ['./work-order-view.component.css']
})
export class WorkOrderViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  form: any = {
    productionName: null,
    productionCode: null,
    bomVersion: null,
    noteVersion: null,
    specificationVersion: null,
    branchName: null, // ngành
    groupName: null, // tổ
    workOrderId: null,
    quantityPlan: null,
    startDate: null,
    endDate: null,
    planingWorkOrderCode: null, // ma don hang
    note: null,
    lotNumber: null,
    id: null,
    profileName: null,
  };
}
