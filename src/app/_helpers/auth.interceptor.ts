import { KeycloakService } from 'keycloak-angular';
import { Inject, Injectable } from '@angular/core'; // imports the class that provides local storage for token
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, take, switchMap, timeout } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { DEFAULT_TIMEOUT } from './timeout.interceptor';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptorService implements HttpInterceptor {


  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number, private keycloak: KeycloakService) {
    // this.theToken();
  }


//   async theToken() {
//     const inst = await this.keycloak.getKeycloakInstance();
//     console.log(inst)

//     const token1 = await this.keycloak.getToken();
//     console.log('token1', token1)

//     const token2 = await inst.token
//     console.log('token2', token2)

//     const token3 = inst.idToken
//     console.log('token3', token3)

//     const token4 = await this.keycloak.getKeycloakInstance().token
//     console.log('token4', await token4)

//     const token5 = inst['token']
//     console.log('token5', token5)
// }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // const token = window.sessionStorage.getItem('auth-token');

    var token =  this.keycloak.getKeycloakInstance().token;

    req = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*') });
    req = req.clone({ headers: req.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept') });
    req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });// This clones HttpRequest and Authorization header with Bearer token added
    // req = req.clone({ headers: req.headers.set('Content-Type', 'application/json;') });

    req = req.clone({ headers: req.headers.set('Access-Control-Allow-Credentials', 'true') });
    req = req.clone({ headers: req.headers.set('Access-Control-Max-Age', '36000') });

    const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);

    return next.handle(req)
      .pipe(
        timeout(36000),
        catchError((error: HttpErrorResponse) => {
          // Catching Error Stage
          console.log(error) // in case of an error response the error message is displayed
          if (error && error.status === 401) {
            console.log("ERROR 401 UNAUTHORIZED") // in case of an error response the error message is displayed

          }
          else if (error.status == 0) { //or whatever condition you like to put

          }

          else {

          }
          const err = error.error.message || error.statusText;
          return throwError(error); // any further errors are returned to frontend
        },
        )
      );
  }
}
