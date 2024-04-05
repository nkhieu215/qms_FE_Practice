import { environment } from 'src/environments/environment';
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
export class AqlTemplateService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/pqc-aql-template';
  }

  createUpdate(
    id: any,
    testLevel: any,
    acceptanceLevel: any,
    allowedError: any,
    note: any,
  ): Observable<any> {
    return this.http.post(
      this.path + '/add',
      {
        id: id,
        testLevel: testLevel,
        acceptanceLevel: acceptanceLevel,
        allowedError: allowedError,
        note: note
      },
      httpOptions
    );
  }

  getList(
    testLevel: any,
    acceptanceLevel: any,
    allowedError: any,
    page: any,
    size: any,
    ): Observable<any> {
    return this.http.post(
      this.path + '/get-list',
      {
        testLevel: testLevel,
        acceptanceLevel: acceptanceLevel,
        allowedError: allowedError,
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
