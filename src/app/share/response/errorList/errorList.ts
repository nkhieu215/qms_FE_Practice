export class ErrorList{
  public name?:number;
  public errorCode?:number;
  public description?:number;
  public errChild?:Array<ErrorList> = [];
  public lstErr?:Array<ErrorList> = [];
  public parentId?:string;
  public type?:number;
  public id?:string;

}
