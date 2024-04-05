import { CheckLkdtComponent } from './check-lkdt/check-lkdt.component';
import { ApproveRequestComponent } from './approve-request/approve-request.component';
import { CheckNvlComponent } from './check-nvl/check-nvl.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeycloakAuthGuard } from 'keycloak-angular';
import { AuthGuard } from 'src/app/_helpers/authGuard';


const routes: Routes = [
  {
    path: 'iqc-nvl-check',
    data: {
      breadcrumb: 'Danh sách biên bản NVL',
      allowedRoles: ['qms_admin', 'qms_iqc']
    },
    children: [
      {
        path: '',
        component: CheckNvlComponent,
      },
      {
        path: ':id/:type',
        component: CheckNvlComponent,
        data: {
          breadcrumb: 'Kiểm tra NVL',
          allowedRoles: ['qms_admin', 'qms_iqc']
        }
      },
    ]
  },

  {
    path: 'check-approve',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Danh sách phê duyệt',
      allowedRoles: ['qms_admin', 'qms_approve_iqc']
    },
    children: [
      {
        path: '',
        component: ApproveRequestComponent,
      },
      {
        path: ':id/:type',
        component: ApproveRequestComponent,
        data: {
          breadcrumb: 'Phê duyệt',
          allowedRoles: ['qms_admin', 'qms_approve_iqc']
        }
      },
    ]
  },

  {
    path: 'iqc-lkdt-check',
    data: {
      breadcrumb: 'Danh sách kiểm tra LKĐT',
    },
    children: [
      {
        path: '',
        component: CheckLkdtComponent,
      },
      {
        path: ':id/:type',
        component: CheckLkdtComponent,
        data: {
          breadcrumb: 'Kiểm tra LKĐT'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class IqcRoutingModule { }
