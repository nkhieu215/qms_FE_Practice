import { saveAs } from 'file-saver';
import { async } from '@angular/core/testing';
import { BaseService } from './base.service';
import { ErrorList } from '../_models/errorList.model';
import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" })
};

const URL_ALL_IQC = "electronic-components/crud";
const URL_LIST_CHECK_NVL_BROWS = "electronic-components/find-list"
const URL_DETAIL = "electronic-components/detail/"
const URL_CHECK_NVL_CREATE = "electronic-components/create"
const URL_DELETE_CHECK = "electronic-components/remove/"
const URL_DELETE_ITEM_CHECK = "electronic-components/remove-check-result/"
const URL_IQC_REPORT = "report/iqc-report/"
const URL_CHECK_NVL_CREATE_PARAM = "electronic-components/create-param"
const URL_COPY_IQC = "electronic-components/copy/"
const URL_REPORT_NVL = "report/iqc-report-nvl/"
const URL_REPORT_BTP = "report/iqc-report-btp/"


@Injectable({
  providedIn: 'root'
})
export class IqcCheckService {

  constructor(private baseService: BaseService) {
  }

  async getAll(page: number, size: number, param: any, type: string, typeRequest:string) {
    let data = {
      typeRequest: typeRequest,
      page: page,
      size: size,
      param: param,
      type: type
    }
    let dataRes = await this.baseService.postService(data, URL_LIST_CHECK_NVL_BROWS, '');
    return dataRes;
  }

  async getAllWaitApprove(data: any) {
    return await this.baseService.postService(data, URL_ALL_IQC, '');
  }

  updateParam(audit: AuditCriteriaNvl, type: string) {
    let data = {
      typeRequest: "EDIT",
      audit: audit,
      type: type
    }
    return this.baseService.postService(data, URL_ALL_IQC, '');
  }

  async detail(id: number) {
    let dataRes = await this.baseService.getService(URL_DETAIL + id, '');
    return dataRes
  }


  async deleteItemCheck(id: any, checkId: any, type: any) {
    let dataRes = await this.baseService.deleteService(`${URL_DELETE_ITEM_CHECK}${id}/${checkId}/${type}`, '');
    return dataRes
  }

  async delete(id: any) {
    let data = await this.baseService.deleteService(URL_DELETE_CHECK + id, '');
    return data;
  }

  report(id: any) {
    return this.baseService.reportPostFile(`${URL_IQC_REPORT}/${id}`,{}, '');
  }

  // downloadfile(id: any): Observable<Blob>  {
  //   const formDataForExport: FormData = new FormData();
  //   formDataForExport.append('export', 'ALL');
  //   let data =  this.http.post(environment.api_end_point + "/report/iqc-report/" + id, {},
  //     {
  //       responseType: 'blob'
  //     }
  //   )
  //   return data ;
  // }

  downloadfileNVL(id: any, fileName: any) {
    let data = this.baseService.reportPostFile(`${URL_REPORT_NVL} ${id}`,{}, '').subscribe(
      blob => {
        saveAs(blob, fileName)
      }
    );
    return data;
  }

  downloadfileBtp(id: any, fileName: any) {
    let data = this.baseService.reportPostFile(`${URL_REPORT_BTP} ${id}`,{}, '').subscribe(
      blob => {
        saveAs(blob, fileName)
      }
    );
    return data;
  }


  async create(component: any, lstIqcNvl: any, lstIqcParam: any, lstIqcLkdt: any, lstError: any, type: any) {
    let data = {
      typeRequest: type,
      component: component,
      lstIqcNvl: lstIqcNvl,
      lstError: lstError,
      lstIqcParam: lstIqcParam,
      lstIqcLkdt: lstIqcLkdt
    };
    let dataRes = await this.baseService.postService(data, URL_CHECK_NVL_CREATE, '');
    return dataRes;
  }


  async copy(id: any) {
   let data={}
    let dataRes = await this.baseService.postService(data, URL_COPY_IQC+id, '');
    return dataRes;
  }

  async addCheckParam(data: any) {
    let dataRes = await this.baseService.postService(data, URL_CHECK_NVL_CREATE_PARAM, '');
    return dataRes;
  }

  approve(component: any) {
    let data = {
      typeRequest: "APPROVE",
      component: component
    };
    return this.baseService.postService(data, URL_ALL_IQC, '');
  }

  // update(id: any, data: any): Observable<any> {
  //   return this.http.put(`${this.path}/${id}`, data);
  // }



  // deleteAll(): Observable<any> {
  //   return this.http.delete(this.path);
  // }

  // findByTitle(title: any): Observable<Tutorial[]> {
  //   return this.http.get<Tutorial[]>(`${PATH_SERVICE}?title=${title}`);
  // }
}
