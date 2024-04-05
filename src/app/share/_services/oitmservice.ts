import { ErrorList } from '../_models/errorList.model';
import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { AuditCriteria } from '../_models/auditCriteria.model';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',"Access-Control-Allow-Origin": "*" })
};

@Injectable({
  providedIn: 'root'
})
export class OitmService {
   path: string;

  constructor(private http: HttpClient) {
     this.path =  environment.api_end_point + '/examination/add'
  }

  searchBycode(code: string): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/rd-common/search-oitm',
      {
        typeRequest: 'SEARCH',
        code: code
      },
      httpOptions
    );
  }


}
