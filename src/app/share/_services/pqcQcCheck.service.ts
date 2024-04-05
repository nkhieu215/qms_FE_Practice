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
export class PQCQcCheckService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point
  }

  createUpdate(data: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/qc-check/create', {
      data
    }, httpOptions);
  }


  delete(id: any): Observable<any> {
    return this.http.delete<any>( environment.api_end_point + '/qc-check/delete/'+ id, httpOptions);
  }


  detail(id: any): Observable<any> {
    return this.http.get<any>( environment.api_end_point + '/qc-check/detail/'+ id, httpOptions);
  }
}
