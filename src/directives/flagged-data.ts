/* tslint:disable */
import { Directive, TemplateRef, Input, ViewContainerRef } from '@angular/core';
import { Currency } from '../shared/entities/currency/currency';

@Directive({
  selector: '[flaggedData]',
  providers: []
})
export class FlaggedData {
  @Input('flaggedData') version: string = '';
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    if (this.version != 'pre') {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainer.clear();
    }
  }
}