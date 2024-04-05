export class ErrorElectronicComponent {
  constructor(
    public errName: null,
    public errGroup: null,
    public quantity: 0,
    public ratio?: string,
    public note?: string,
    public ids?: string,
    public id?: string,
    public serial?:string,
    public dttdCheckId?: string,
    public electCompId?:number
  ) {}
}
