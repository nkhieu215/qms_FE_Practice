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
export class PQCAssemblesCheckService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point
  }

  createUpdate(data: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/assembles/create', {
      data
    }, httpOptions);
  }

  addError(data: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/assembles/add-error', {
      data
    }, httpOptions);
  }

  getDetail(id: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/assembles/detail-assembles/'+ id, httpOptions);
  }


  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.path}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>( environment.api_end_point + '/assembles/remove/' + id, httpOptions);
  }

  deleteError(id: any): Observable<any> {
    return this.http.delete<any>( environment.api_end_point + '/assembles/remove-eror/' + id, httpOptions);
  }
}
