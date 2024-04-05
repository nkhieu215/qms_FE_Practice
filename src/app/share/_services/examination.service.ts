import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { AuditCriteria } from '../_models/auditCriteria.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ExaminationService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/examination/add';
  }

  getAll(
    page: number,
    size: number,
    name: string,
    type: number,
    code: string
  ): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/examination/crud',
      {
        typeRequest: 'BROWS',
        page: page,
        size: size,
        name: name,
        type: type,
        code: code
      },
      httpOptions
    );
  }

  /**
   * tim mau bien ban theo ma
   * @param code
   * @param type
   * @returns
   */
  searchBycode(code: string, type: number): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/examination/search',
      {
        typeRequest: 'SEARCH',
        code: code,
        type: type,
      },
      httpOptions
    );
  }

  updateParam(criteriaNvl:any,criteriaLkdt: any,parameter:any, type: string,criteriaQualities:any): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/examination/crud-param',
      {
        typeRequest: type,
        criteriaLkdt: criteriaLkdt,
        criteriaNvl:criteriaNvl,
        parameter:parameter,
        qualities: criteriaQualities
      },
      httpOptions
    );
  }

  detail(id: number): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/examination/crud',
      {
        typeRequest: 'SHOW',
        id: id,
      },
      httpOptions
    );
  }

  create(
    examination: AuditCriteria,
    lsCriteriaNvl: any,
    lstCriteriaLkdt: any,
    lstParameter: any,
    lstCriteriaQualities: any,
    type:string
  ): Observable<any> {
    return this.http.post<any>(
       environment.api_end_point + '/examination/crud',
      {
        typeRequest: type,
        examination,
        lsCriteriaNvl,
        lstCriteriaLkdt,
        lstParameter,
        lstCriteriaQualities
      },
      httpOptions
    );
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.path}/${id}`, data);
  }

  delete(id: any): Observable<any> {
   let path= environment.api_end_point + '/examination/delete'
    return this.http.delete(`${path}/${id}`);
  }

  copy(id: any): Observable<any> {
    let path= environment.api_end_point + '/examination/copy'
     return this.http.post(`${path}`,{id:id},httpOptions);
   }

  deleteAll(): Observable<any> {
    return this.http.delete(this.path);
  }

  // findByTitle(title: any): Observable<Tutorial[]> {
  //   return this.http.get<Tutorial[]>(`${PATH_SERVICE}?title=${title}`);
  // }
}
