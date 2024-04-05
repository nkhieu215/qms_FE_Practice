import { Menu } from './Menu.model';
import { BaseResponse } from './../BaseResponse';
export class MenuResponse extends BaseResponse{
  lstmenu?: Menu[];
}
