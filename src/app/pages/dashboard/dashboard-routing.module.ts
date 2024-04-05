
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';


const routes: Routes = [
  {
    path: '', component: HomepageComponent,
    data: {
      breadcrumb: 'Dashboard',
  },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
