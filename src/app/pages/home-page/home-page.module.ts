import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgChartsModule
  ]
})
export class HomePageModule { }
