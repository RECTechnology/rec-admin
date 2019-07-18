export class BankData {

  public name: string = '';
  public beneficiary: string = '';
  // tslint:disable-next-line
  public bic_swift: string = '';
  public iban: string = '';
  public hasChanged: boolean = false;
  public type = 'sepa';
  public status = '';
  public currency: string;

  constructor(name) {
    this.name = name;
  }

  public setData(data: any) {
    this.beneficiary = data.beneficiary || '';
    this.bic_swift = data.bic_swift || '';
    this.iban = data.iban || '';
    this.hasChanged = data.hasChanged || false;
  }
}
