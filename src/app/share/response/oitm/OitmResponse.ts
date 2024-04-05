import { OitmObjResponse } from './OitmObjResponse';


import { BaseResponse } from '../BaseResponse';
export class OitmResponse extends BaseResponse{
  lstOitm?: OitmObjResponse[];
  lstOcrd?:any[];
}
