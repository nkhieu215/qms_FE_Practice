
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

const AUTH_API = '/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // path: string;
  constructor(private http: HttpClient,public router: Router, private tokenService:KeycloakService) {

    // this.path =  environment.api_end_point + '/api/auth'
  }

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post(this.path + '/signin', {
  //     username,
  //     password
  //   }, httpOptions);
  // }

  // register(username: string, email: string, password: string): Observable<any> {
  //   return this.http.post(AUTH_API + 'signup', {
  //     username,
  //     email,
  //     password
  //   }, httpOptions);
  // }


  getToken() {

    return this.tokenService.getKeycloakInstance().token;
  }

  get isLoggedIn(): boolean {
    let authToken = this.tokenService.getKeycloakInstance().token;
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    this.tokenService.logout();
  }


  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  refreshToken(token: string) {

  }
}
