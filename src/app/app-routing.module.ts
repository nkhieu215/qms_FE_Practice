import { HomePageRoutingModule } from './pages/home-page/home-page-routing.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Hệ thống quản lý chất lượng',
    },
    loadChildren: () => import('./pages/home-page/home-page-routing.module').then(m => m.HomePageRoutingModule)
  },
  {
    path: 'dashboard',
    data: {
      breadcrumb: 'Dashboard',
    },
    loadChildren: () => import('./pages/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule)
  },
  {
    path: 'iqc',
    data: {
      breadcrumb: 'IQC',
    },
    loadChildren: () => import('./pages/iqc/iqc-routing.module').then(m => m.IqcRoutingModule)
  },
  {
    path: 'pqc',
    data: {
      breadcrumb: 'PQC',
    },
    loadChildren: () => import('./pages/pqc/pqc-routing.module').then(m => m.PqcRoutingModule)
  },
  {
    path: 'setting',
    data: {
      breadcrumb: 'Cài đặt',
    }, loadChildren: () => import('./pages/setting/setting-routing.module').then(m => m.SettingRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
