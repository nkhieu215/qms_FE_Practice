import { NVLScan } from './nvlScan';
export class Bom {
  public id?: string;
  public bomQuantity?: string;
  public itemCode?: string;
  public itemName?: string;
  public partNumber?: string;
  public quantity?: string;
  public vendor?: string;
  public version?: string;
  public workOrderId?: string;
  public workOrderQuantity?: string;
  public uitmTech?: string;
  public ualter?: string;
  public uremarks?: string;
  public uctrLevel?: string;
  public uotherNam?: string;
  public ulocation?: string;

  public rankQuang?:string;
  public rankAp?:string;
  public rankMau?:string;
  public lot?:string;
  public po?:string;
  public date?:string;
  public reelID?:string;

  public color?:string;
  public feeder?:string;
  public statusScanFeeder:boolean = false;
  public stautsScanPart: boolean = false;
  public err?:string;

  public lstScanNVL:  NVLScan[] = [];

}
