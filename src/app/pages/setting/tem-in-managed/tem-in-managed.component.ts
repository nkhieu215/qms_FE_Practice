import { Component, OnInit } from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-tem-in-managed',
  templateUrl: './tem-in-managed.component.html',
  styleUrls: ['./tem-in-managed.component.css'],
  standalone: true,
  imports: [CdkDrag],
})
export class TemInManagedComponent implements OnInit{
  ngOnInit(): void {
    document.getElementById('1')!.style.top = '421px'    
    document.getElementById('1')!.style.left = '322px'

  }
  checkEvent(event:any){
    console.log(event);
  }
}
