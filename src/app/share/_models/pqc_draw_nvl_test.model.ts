import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class PqcDrawNvlTest {

  public id?: string;
  public bomQuantity?: string;
  public quantity?: string;
  public version?: string;
  public workOrderQuantity?: string;
  public uitmTech?: string;
  public ualter?: string;
  public uremarks?: string;
  public uctrLevel?: string;
  public uotherNam?: string;
  public ulocation?: string;

  public po?:string;
  public date?:string;
  public reelID?:string;

  public color?:string;
  public feeder?:string;
  public statusScanFeeder:boolean = false;
  public stautsScanPart: boolean = false;
  public err?:string;


  public drawTestNvlId = null;
  public allowResult?:string;
  public checkDate?:string;
  public externalInspection = null;
  public itemCode = null;

  public itemName = null;
  public lot = null;
  public manufactureDate = null;
  public maxCosfi = null;
  public maxElectric = null;
  public maxPower = null;
  public minCosfi = null;
  public minElectric = null;
  public minPower = null;
  public partNumber = null;
  public poCode = null;
  public qty = null;
  public rankAp = null;
  public rankMau = null;
  public rankQuang = null;
  public realResult?:string;
  public regulationCheck = null;
  public sampleQuantity = null;
  public technicalPara = null;
  public vendor = null;
  public workOrderId = null;
  public pqcDrawNvlId = null;
  public ids ?:string;
  public ex_sampleQuantity = null
  public note = null
  public paramMin = null;
  public paramMax= null;
  public unit=null;
  public returnDay ?:string;
}
