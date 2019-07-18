import { Component, Input } from '@angular/core';

@Component({
  selector: 'fee-resume',
  styles: [
    `:host{width: 100%}`,
  ],
  templateUrl: './fee-resume.html',
})

export class FeeResume {
  @Input('variableFee') public variableFee = 0;
  @Input('fixedFee') public fixedFee = 0;
  @Input('amount') public amount = 0;
  @Input('removeFromAmount') public removeFromAmount = true;
  @Input('currency') public curr: string;
}
