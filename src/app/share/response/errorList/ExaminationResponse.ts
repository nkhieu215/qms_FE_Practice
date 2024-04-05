import { ErrorList } from './errorList';
import { BaseResponse } from '../BaseResponse';
export class ErrorListResponse extends BaseResponse{
  lstError?: ErrorList[];
  total?:number;
  examinationType?:ErrorList;

}
