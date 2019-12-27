import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
})
export class MaskPipe implements PipeTransform {
  public transform(value: any, amount: number): any {
    const strVal = String(value);
    const start = strVal.substr(0, amount);
    const end = strVal.substr(strVal.length - 4, strVal.length);

    return start + ' ... ' + end;
  }
}
