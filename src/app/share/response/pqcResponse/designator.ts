import { PartNumber } from './partNumber';
import { Observable } from 'rxjs';
export class Designator {

  public id?: string;
  public description?: string;

  public locationX?: string;
  public locationY?: string;
  public material?: string;
  public name?: string;
  public partNumber?:  PartNumber; 
  public rotation?: string;
}
