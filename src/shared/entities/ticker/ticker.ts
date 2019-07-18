export class Ticker {

  public key: string = '';
  public value: any = '';
  public currIn: string = '';
  public currOut: string = '';
  public quantity: number = 0;

  constructor(key, value, currIn, currOut, quantity) {
    this.key = key;
    this.value = value;
    this.currIn = currIn;
    this.currOut = currOut;
    this.quantity = quantity;
  }

  public hasIncreased() {
    return this.tickerValueDifference(this.key, this.value) > 0;
  }

  public hasDecreased() {
    return this.tickerValueDifference(this.key, this.value) < 0;
  }

  private tickerValueDifference(key, tickerValueNow) {
    const tickerLSName = 'ticker_' + key;
    const tickerValuePrevious = +localStorage.getItem(tickerLSName) || 0;
    let difference = 0;

    if (tickerValuePrevious && tickerValuePrevious !== tickerValueNow) {
      difference = (Math.abs(tickerValueNow) - Math.abs(tickerValuePrevious));
    }
    localStorage.setItem(tickerLSName, tickerValueNow + '');
    return difference;
  }
}
