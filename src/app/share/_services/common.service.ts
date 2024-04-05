import { async } from '@angular/core/testing';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ProductionLine } from '../response/line/production-line';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

const URL_APPROVE_CHECK = "common/approve";

@Injectable({
  providedIn: 'root',
})

export class CommonService {
  public webData?: ProductionLine[] = [];
  constructor(private http: HttpClient, private baseService:BaseService) {}

  successStep(id:any,step:any,action:any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/common/success-step', {
      typeRequest:action,
      step: step,
      id:id
    }, httpOptions);
  }

  statusStep(id:any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/common/status-user-step', {
      id:id
    }, httpOptions);
  }

  getSettingProcess(): Observable<any> {
    return this.http.get<any>( environment.api_end_point + '/common/get-setting-process', httpOptions);
  }

async  approveCheck(data:any){
    return await this.baseService.postService(data,URL_APPROVE_CHECK,'')
  }

}
