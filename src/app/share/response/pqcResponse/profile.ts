import { Designator } from './designator';
export class Profile {
  public id?: string;
	public  designator?: Designator;
	public  side?: string;
	public  name?: string;
	public  description?: string;
	public  feederSlot?: string;
	public  profileCode?: string;
	public  feederGroup?: any;
	public  status?: string;
	public programming?:any;
	public details:[] =[];
}

