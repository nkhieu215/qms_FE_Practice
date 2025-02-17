import { StoreCheckError } from './storeCheckError.model';
import { StoreCheckSafe } from './storeCheckSafe.model';
import { StoreCheckStructure } from './storeCheckStructure.model';
import { StoreCheckConfused } from './storeCheckConfused.model';
import { StoreCheckSize } from './storeCheckSize.model';
import { StoreExternalInspection } from './storeExternalInspection.model';
import { StoreElectronic } from './storeElectronic.model';
export class StoreCheck {
  checkDate: any;
  checkPerson: any;
  lot: any;
  quatity: any;
  quatityStore: any;
  totalErr: any;
  workOrderId: any;
  note: any;
  conclude: any;
  status: any;
  id: any;
  ids: any;
  statusApproveSap?: string;
  statusApproveSapStr?: string;
  quantityStoreSap?: string;
  dateApproveSap?: string;
  colorName?: string;
  colorCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  hisString?: any;

  lstElectronic: StoreElectronic[] = [];
  lstExternal: StoreExternalInspection[] = [];
  lstSize: StoreCheckSize[] = [];
  lstConfused: StoreCheckConfused[] = [];
  lstStructure: StoreCheckStructure[] = [];
  lstSafe: StoreCheckSafe[] = [];
  lstErrorCheck: StoreCheckError[] = [];
}
