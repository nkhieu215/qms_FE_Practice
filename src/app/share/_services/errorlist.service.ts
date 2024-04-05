import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" })
};

@Injectable({
  providedIn: 'root'
})
export class ErrorListService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/examination/add'
  }

  getAll(page: number, size: number, name: string, code: string): Observable<any> {
    return this.http.post( environment.api_end_point + "/categories/crud-error-code", {
      typeRequest: "BROWS",
      page: page,
      size: size,
      name: name,
      code: code
    }, httpOptions);
  }

  getAllCategories(): Observable<any> {
    return this.http.post( environment.api_end_point + "/categories/crud-error-code", {
      typeRequest: "BROWS_ALL",
    }, httpOptions);
  }


  getAllErrorGroup(): Observable<any> {
    return this.http.post( environment.api_end_point + "/common/error-list", {
      typeRequest: "BROWS_ALL",
    }, httpOptions);
  }

  updateParam(audit: AuditCriteriaNvl, type: string): Observable<any> {
    return this.http.post( environment.api_end_point + "/categories/crud-error-code", {
      typeRequest: "EDIT",
      audit: audit,
      type: type
    }, httpOptions);
  }

  detail(id: number): Observable<any> {
    return this.http.post( environment.api_end_point + "/categories/crud-error-code", {
      typeRequest: "SHOW",
      id: id
    }, httpOptions);
  }

  searchErrScada(search: string): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/common/search-error-scada',
      {
        search: search
      },
      httpOptions
    );
  }



  createOne(error: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/error/create-update', error, httpOptions);
  }


  getInfo(id: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/error/find-by-id', {id:id}, httpOptions);
  }

  delete(id: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/error/remove-by-id', {

      id: id
    }, httpOptions);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.path);
  }

  // findByTitle(title: any): Observable<Tutorial[]> {
  //   return this.http.get<Tutorial[]>(`${PATH_SERVICE}?title=${title}`);
  // }
}
