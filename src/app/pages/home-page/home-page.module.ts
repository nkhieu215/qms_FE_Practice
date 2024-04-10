import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';


@NgModule({
  declarations: [
    WelcomeComponent,
    WelcomePageComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgChartsModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  exports:[MatButtonModule,
    MatSelectModule,
    MatIconModule],
    providers:[Document]
  
})
export class HomePageModule { }
