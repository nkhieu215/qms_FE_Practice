import { IqcComponentNVL } from './iqcComponentNVL';
import { BaseResponse } from '../BaseResponse';

export class IqcComponentNVLResponse extends BaseResponse{
  lst?: IqcComponentNVL[];
  total?:number;
  examinationType?:IqcComponentNVL;

}
