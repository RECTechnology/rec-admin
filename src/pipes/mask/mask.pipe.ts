import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
})
export class MaskPipe implements PipeTransform {
  public transform(value: any, amount: number): any {
    const strVal = String(value);
    const unmasked = strVal.substr(0, amount);
    const masked = strVal.substr(amount, 8).replace(/./g, '*');

    return unmasked + masked;
  }
}
