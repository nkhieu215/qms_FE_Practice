import { Component } from '@angular/core';
import { AuthService } from './share/_services/auth.service';
import { UserService } from './share/_services/user.service';
import { MenuResponse } from './share/response/menu/MenuResponse';
import { Menu } from './share/response/menu/Menu.model';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService , private userService: UserService,private tokenStorage:KeycloakService) {
  }

  isCollapsed = true;
  content?: string;
  menuResponse?: MenuResponse ;
  lstMenuRes?: Menu[];
  strName?:string;

  ngOnInit(): void {

    if(this.authService.isLoggedIn){
      this.userService.getMenu().toPromise().then(
        data => {
          this.menuResponse =  JSON.parse(data);
          this.lstMenuRes = this.menuResponse?.lstmenu;
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      );

      this.strName  = this.tokenStorage.getUsername();
    }

  }

  signOut(){
    this.tokenStorage.logout();
  }

}

