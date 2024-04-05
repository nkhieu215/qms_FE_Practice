import { environment } from 'src/environments/environment';
import { ErrorList } from '../_models/errorList.model';
import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { AuditCriteria } from '../_models/auditCriteria.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ScadaRequestService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/pqc-scada';
  }

  getMachineName(): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/common/machine-list', {}, httpOptions);
  }

  getStep(): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/common/step-process-list', {}, httpOptions);
  }

  getLine(): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/common/line', {}, httpOptions);
  }

  getErrbyMachine(sapWo:any,type:any): Observable<any> {
    return this.http.get(this.path + '/get-error-lst-scada/'+ sapWo+'/' + type);
  }


  getMachineByWoScada(sapWo:any,type:any): Observable<any> {
    return this.http.get(this.path + '/get-machine-by-wo-scada/'+ sapWo+'/' + type);
  }

}
