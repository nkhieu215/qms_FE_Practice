import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" })
};

@Injectable({
  providedIn: 'root'
})

export class WelcomeChart {
  path: string;
  constructor(private http: HttpClient) {
    this.path = environment.api_end_point
  }

  // getLois(): Observable<any>{
  //   return this.http.get<any>(environment.api_end_point + '/dashboard/get-setting-process', httpOptions).subscribe(data => {
  //     this.getLois = res;
  //   })
  // }
}
