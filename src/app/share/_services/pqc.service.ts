import { saveAs } from 'file-saver';
import { BaseService } from './base.service';
import { data } from 'jquery';
import { ErrorList } from '../_models/errorList.model';
import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { AuditCriteria } from '../_models/auditCriteria.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { spawn } from 'child_process';

const URL_REPORT_STORE_CHECK = "store-check/report-store";
const URL_EXPORT_EXCEL_STORE_CHECK = "store-check/report-store-excel";
const URL_REPORT_ERR_CHECK_SHOW = "report/report-error/SHOW";
const URL_REPORT_ERR_CHECK_EXPORT = "report/report-error/EXPORT";

const URL_DASHBOARD_HOME = "dashboard/home";
const URL_DASHBOARD_CHART = "dashboard/chart";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" })
};

@Injectable({
  providedIn: 'root'
})
export class PQCService {
  path: string;
  pathSap: string;

  constructor(private http: HttpClient, private baseService: BaseService) {
    this.path = environment.api_end_point + '/production'
    this.pathSap = environment.api_end_point + '/sap-db'
  }

  getOrderList(page: number, size: number, name: any, productCode: any, lot: any, woCode: any): Observable<any> {
    return this.http.post(this.path + "/get-order-planing-list",
      {
        typeRequest: "BROWS",
        page: page,
        size: size,
        name: name,
        productCode: productCode,
        lot: lot,
        woCode: woCode
      }
      , httpOptions);
  }

  getDetailOrder(id: string): Observable<any> {
    return this.http.post(this.path + "/get-order-planing-list", {
      typeRequest: "SHOW",
      idOrder: id
    }, httpOptions);
  }


  nextStep(form: any, profile: any, step: any): Observable<any> {
    return this.http.post(this.path + "/crud", {
      typeRequest: "ACTION_STEP",
      step: step,
      profile: profile,
      data: form
    }, httpOptions);
  }

  getDetailPqcWorkOrder(id: string): Observable<any> {
    return this.http.post(this.path + "/crud", {
      typeRequest: "SHOW",
      id: id
    }, httpOptions);
  }

  getAllProfile(): Observable<any> {
    return this.http.post(this.path + "/get-profile", {
      typeRequest: "BROWS",
    }, httpOptions);
  }


  addStep(lst: any, step: string, workOrderId: number, action: any): Observable<any> {

    let data: any = {
      typeRequest: "ACTION_STEP",
      step: step,
      workOrderId: workOrderId, action
    };

    switch (step) {
      case 'NVL':
        data.lstNvl = lst;
        break;
      case 'NVL100':
        data.lstNvl100 = lst;
        break;
      case 'TIN':
        data.lstTin = lst.lstTin;
        data.lstCheck = lst.lstCheck;
        break;
      case 'MOUNT_COMPONENTS':
        data.lstMountCheck = lst;
        break;
      case 'SOLDER':
        data.lstSolder = lst;
        break;
      case 'METAL':
        data.lstNvl = lst;
        break;
      case 'PLASTIC':
        data.lstNvl = lst;
        break;
      case 'PAINT':
        data.LstNvl = lst;
        break;
      case 'INTERCHANGEABILITY':
        data.lstInter = lst;
        break;
      case 'ASSEMBLES':
        data.lstAssembles = lst;
        break;
      case 'PHOTOELECTRIC_PRODUCT':
        data.lstPhotoelectricProducts = lst;
        break;
      case 'PHOTOELECTRIC':
        data.lstPhotoelectrics = lst;
        break;
      case 'FIX_ERR':
        data.lstFixError = lst;
        break;
      case 'STORE_CHECK':
        data.lstPqcStoreStructures = lst;
        break;
      case 'QC_CHECK':
        data.lstPqcQualities = lst;
        break;
      default:
        break;

    }

    data.action = action;

    return this.http.post(this.path + "/check-step", data, httpOptions);
  }

  getErrorListByStep(idCheck: any, step: any): Observable<any> {
    return this.http.post(this.path + "/check-step", {
      typeRequest: "ACTION_BROWS_ERROR_STEP",
      id: idCheck,
      step: step
    }, httpOptions);
  }

  /**
   * thêm mới yêu cầu kiểm tra
   * @param data
   * @returns
   */
  addNewProcuction(data: any, bomversion: any, lstUserDetail: any): Observable<any> {
    return this.http.post(this.path + "/crud", {
      typeRequest: "ADD",
      data: data,
      bomversion: bomversion,
      lstUserDetail: lstUserDetail
    }, httpOptions);
  }

  getListByStep(page: number, size: number, name: string, code: string, lot: string, step: string, startDate: string, endDate: string, sapcode: string, woCode: string, status: string, branchName: string, groupName: string, workOrderCode: string): Observable<any> {
    console.log("check api: ", this.path + "/check-step");
    return this.http.post(this.path + "/check-step", {
      typeRequest: "ACTION_BROWS_STEP",
      page: page,
      size: size,
      name: name,
      code: code,
      lot: lot,
      step: step,
      sap: sapcode,
      woCode: woCode,
      startDate: startDate,
      endDate: endDate,
      status: status,
      groupName: groupName,
      branchName: branchName,
      workOrderCode: workOrderCode
    }, httpOptions);
  }

  getApproveStoreSap(page: number, size: number, name: string, code: string, lot: string, step: string, startDate: string, endDate: string, sapcode: string, woCode: string, status: string, branchName: string, groupName: string): Observable<any> {
    return this.http.post(this.pathSap + "/get-wait-approve-sap", {
      page: page,
      size: size,
      name: name,
      code: code,
      lot: lot,
      step: step,
      sap: sapcode,
      woCode: woCode,
      startDate: startDate,
      endDate: endDate,
      status: status,
      groupName: groupName,
      branchName: branchName
    }, httpOptions);
  }

  reportStoreCheck(data: any, type: string, fileName: string) {
    if (type == 'VIEW') {
      return this.baseService.postService(data, URL_REPORT_STORE_CHECK, '')
    }
    else if (type == 'REPORT') {
      let dataRest = this.baseService.reportPostFile(`${URL_EXPORT_EXCEL_STORE_CHECK}`, data, '').subscribe(
        blob => {
          saveAs(blob, fileName)
        }
      );
      return dataRest;
    }
    return null;

  }
  reportErrCheck(data: any, type: string, fileName: string) {
    if (type == 'VIEW') {
      return this.baseService.postService(data, URL_REPORT_ERR_CHECK_SHOW, '')
    }
    else if (type == 'REPORT') {
      let dataRest = this.baseService.reportPostFile(`${URL_REPORT_ERR_CHECK_EXPORT}`, data, '').subscribe(
        blob => {
          saveAs(blob, fileName)
        }
      );
      return dataRest;
    }
    return null;

  }

  /**
 * thêm mới yêu cầu kiểm tra
 * @param data
 * @returns
 */
  getUserDetailByWorkOrder(idOrder: any): Observable<any> {
    return this.http.post(this.path + "/get-order-planing-list", {
      typeRequest: "SHOW_STEP",
      idOrder: idOrder
    }, httpOptions);
  }


  getDetailVersionByProdCode(proCode: string, version: string): Observable<any> {
    return this.http.post(environment.api_end_point + "/sap-db/get-info-by-bom-product", {
      proCode: proCode,
      version: version
    }, httpOptions);
  }


  getAllWaitApprove(page: number, size: number, name: string, code: string): Observable<any> {
    return this.http.post(environment.api_end_point + "/electronic-components/crud", {
      typeRequest: "LST_APPROVE",
      page: page,
      size: size,
      name: name,
      code: code
    }, httpOptions);
  }

  updateParam(audit: AuditCriteriaNvl, type: string): Observable<any> {
    return this.http.post(environment.api_end_point + "/electronic-components/crud", {
      typeRequest: "EDIT",
      audit: audit,
      type: type
    }, httpOptions);
  }

  detail(id: number): Observable<any> {
    return this.http.post(environment.api_end_point + "/electronic-components/crud", {
      typeRequest: "SHOW",
      id: id
    }, httpOptions);
  }


  create(component: any, lstIqcNvl: any, lstIqcParam: any, lstIqcLkdt: any, lstError: any, type: any): Observable<any> {
    return this.http.post<any>(environment.api_end_point + '/electronic-components/crud', {
      typeRequest: type,
      component: component,
      lstIqcNvl: lstIqcNvl,
      lstError: lstError,
      lstIqcParam: lstIqcParam,
      lstIqcLkdt: lstIqcLkdt
    }, httpOptions);
  }

  approve(data: any): Observable<any> {
    return this.http.post<any>(environment.api_end_point + '/pqc/approve', { data }, httpOptions);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.path}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.post<any>(environment.api_end_point + '/electronic-components/crud', {
      typeRequest: "DELETE",
      id: id
    }, httpOptions);
  }

  cancelProcessCheckWo(id: any) {
    return this.http.post<any>(environment.api_end_point + '/production/cancel-process-check-wo', {
      id: id
    }, httpOptions);
  }

  getStatusByStepAndWoId(woId: any, step: any) {
    var data = {
      id: woId,
      step: step
    }
    return this.http.post<any>(environment.api_end_point + '/production/get-status-wo-step-user', data, httpOptions);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.path);
  }


  report(id: any): Observable<Blob> {
    const formDataForExport: FormData = new FormData();
    formDataForExport.append('export', 'ALL');
    let data = this.http.post(environment.api_end_point + "/report/pqc-report-by-wo/" + id, {},
      {
        responseType: 'blob'
      }
    )
    return data;
  }

  reportDashboard(data: any) {
    return this.baseService.postService(data, URL_DASHBOARD_HOME, '')
  }

  reportDashboardChart(data: any) {
    return this.baseService.postService(data, URL_DASHBOARD_CHART, '')
  }


  // findByTitle(title: any): Observable<Tutorial[]> {
  //   return this.http.get<Tutorial[]>(`${PATH_SERVICE}?title=${title}`);
  // }
}
