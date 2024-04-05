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
export class PQCPhotoelectricService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point
  }

  createUpdate(data: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/photoelectric/create', {
      data
    }, httpOptions);
  }

  createUpdateProd(data: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/photoelectric/create-prod', {
      data
    }, httpOptions);
  }


  delete(id: any): Observable<any> {
    return this.http.delete<any>( environment.api_end_point + '/photoelectric/delete/'+ id, httpOptions);
  }

  deleteProd(id: any): Observable<any> {
    return this.http.delete<any>( environment.api_end_point + '/photoelectric/delete-prod/'+ id, httpOptions);
  }

  detail(id: any): Observable<any> {
    return this.http.get<any>( environment.api_end_point + '/photoelectric/detail/'+ id, httpOptions);
  }
}
