export class Crypto {

  public name: string = '';
  public method: string = '';
  public type: string = '';
  public status: string = '';
  public methods: any = [];

  constructor(name) {
    this.name = name;
  }

  public setMethod(method: string): void {
    this.method = method;
  }
  public setType(type: string): void {
    this.type = type;
  }

  public getType(type: string): string {
    return this.type;
  }
  public getMethod(): string {
    return this.method;
  }

  public getServiceName() {
    return `${this.name}-${this.type}`;
  }
}
