import { ErrorList } from '../_models/errorList.model';
import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { AuditCriteria } from '../_models/auditCriteria.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" })
};

@Injectable({
  providedIn: 'root'
})
export class InterchangeabilityService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point
  }

  createUpdate(data: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/pqc-interchangeability-check/create', {
      data
    }, httpOptions);
  }

  addError(data: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/pqc-interchangeability-check/add-error', {
      data
    }, httpOptions);
  }

  getDetail(id: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/pqc-interchangeability-check/detail-mount/'+ id, httpOptions);
  }

  remove(id: any): Observable<any> {
    return this.http.delete<any>( environment.api_end_point + '/pqc-interchangeability-check/remove/' + id, httpOptions);
  }

  deleteError(id: any): Observable<any> {
    return this.http.delete<any>( environment.api_end_point + '/pqc-interchangeability-check/remove-eror/' + id, httpOptions);
  }
}
