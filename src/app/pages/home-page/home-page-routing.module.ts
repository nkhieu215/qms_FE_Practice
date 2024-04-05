import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeycloakAuthGuard } from 'keycloak-angular';
import { AuthGuard } from 'src/app/_helpers/authGuard';
import { WelcomeComponent } from './welcome/welcome.component';


const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    data: {
      breadcrumb: 'Quản lý chất lượng sản xuất',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class HomePageRoutingModule { }
