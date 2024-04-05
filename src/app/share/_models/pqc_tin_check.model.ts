import { TinSerial } from './tin_serial.model';
import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class PqcTin {
  public batchId = null;
  public line = null;
  public checkPerson?: string;
  public checkTime?: string;

  public serial?: string;
  public startKhuay?: string;
  public endKhuay?: string;
  public startGia?: string;
  public endGia?: string;
  public note?: string;

  public lstSerial: TinSerial[] = [];
  public ids?: string;
  public id?: string;
  public operators?:string;
}
