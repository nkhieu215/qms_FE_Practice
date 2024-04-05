import { PQCWorkOrder } from './pqcWorkOrder';
import { UserDetail } from './userDetail';
import { PQCPendingOrder } from './pqcPendingOrder';
import { BaseResponse } from '../BaseResponse';

export class PQCPEndingOrderResponse extends BaseResponse{
  lstProduct?: PQCPendingOrder[];
  total?:number;
  planning ?:any;
  lstUserDetail ?:UserDetail [];
  lstOrder?: PQCWorkOrder[]
}
