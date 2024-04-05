import { SubPartnumber } from './subPartnumber';
import { Observable } from 'rxjs';
export class PartNumber {

  public code?:any;
  public description?:any;
  public id?:any;
  public name?:any;
  public subparts : SubPartnumber[] =[];
}
