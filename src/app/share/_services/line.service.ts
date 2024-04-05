import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProductionLine } from '../response/line/production-line';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})

export class LineService {
  public webData?: ProductionLine[] = [];
  constructor(private http: HttpClient) {}
  getAll(
    page: number,
    size: number,
    name: string,
    code: string
  ): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/setting-line/index',
      {
        page: page,
        size: size,
        name: name,
        code: code,
      },
      httpOptions
    );
  }
  create(
    idScada: string,
    name: string,
    description: string,
    code: string,
    source: string
  ): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/setting-line/create-update',
      {
        dataRequest: {
          idScada: idScada,
          name: name,
          description: description,
          code: code,
          source: source,
        },
      },
      httpOptions
    );
  }
  update(
    id: number,
    idScada: string,
    name: string,
    description: string,
    code: string,
    source: string
  ): Observable<any> {
    return this.http.post(
       environment.api_end_point + '/setting-line/create-update',
      {
        dataRequest: {
          id: id,
          idScada: idScada,
          name: name,
          description: description,
          code: code,
          source: source,
        },
      },
      httpOptions
    );
  }
}
