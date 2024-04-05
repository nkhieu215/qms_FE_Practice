
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AqlTemplateComponent } from './aql-template/aql-template.component';
import { SettingProcessComponent } from './setting-process/setting-process.component';
import { ExaminationBrowsComponent } from './examinationTemplate/brows/brows.component';
import { ExaminationAddComponent } from './examinationTemplate/examination-add/examination-add.component';
import { ExaminationEditComponent } from './examinationTemplate/edit/edit.component';
import { ErrorListComponent } from './error/error-list/error-list.component';
import { ErrorAddComponent } from './error/error-add-update/error-add.component';
import { MachineListComponent } from './machine/machine-list/machine-list.component';
import { MachineAddComponent } from './machine/machine-add/machine-add.component';
import { MachineEditComponent } from './machine/machine-edit/machine-edit.component';
import { MachineDetailComponent } from './machine/machine-detail/machine-detail.component';
import { ProductionLineListComponent } from './line/production-line-list/production-line-list.component';
import { ProductionLineAddComponent } from './line/production-line-add/production-line-add.component';
import { ProductionLineEditComponent } from './line/production-line-edit/production-line-edit.component';
import { ProductionLineDetailComponent } from './line/production-line-detail/production-line-detail.component';


const routes: Routes = [
  {
    path: 'aql-template',
    component: AqlTemplateComponent,
  },
  {
    path: 'process-step',
    component: SettingProcessComponent,
  },
  {
    path: 'examination',
    component: ExaminationBrowsComponent,
    // canActivate: [AppAuthGuard],
    // data: { roles: ['QMS_MANAGER_SETTING'] },
  },

  { path: 'examination-add', component: ExaminationAddComponent },
  { path: 'examination-edit/:id', component: ExaminationEditComponent },
  { path: 'error', component: ErrorListComponent },
  { path: 'error-add-edit/:id', component: ErrorAddComponent },
  { path: 'machine-list', component: MachineListComponent }, //Danh sach may
  { path: 'machine-add', component: MachineAddComponent }, //Them may
  { path: 'machine-edit/:id', component: MachineEditComponent }, //Sua may
  { path: 'machine-detail/:id', component: MachineDetailComponent }, //Thong tin may
  { path: 'production-line-list', component: ProductionLineListComponent }, //Danh sach day chuyen
  { path: 'production-line-add', component: ProductionLineAddComponent }, //Them day chuyen
  { path: 'production-line-edit/:id', component: ProductionLineEditComponent }, //Sua day chuyen
  { path: 'production-line-detail/:id', component: ProductionLineDetailComponent, }, //Thong tin day chuyen
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
