
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
export class ProcessSettingsService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/settings-process';
  }

  createUpdate(
    id: any,
    name: any,
    code: any,
  ): Observable<any> {
    return this.http.post(
      this.path + '/add',
      {
        id: id,
        name: name,
        code: code
      },
      httpOptions
    );
  }

  getList(
    name: any,
    code: any,
    page: any,
    size: any,
    ): Observable<any> {
    return this.http.post(
      this.path + '/get-list',
      {
        name: name,
        code: code,
        page:page,
        size:size
      },
      httpOptions
    );
  }

  remove(id: any): Observable<any> {
    return this.http.delete(this.path + '/remove/' + id , {});
  }
}
