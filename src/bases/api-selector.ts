import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  template: '',
})
export abstract class BaseSelectorComponent {
  @Input() public items: any[] = [];
  @Input() public item: any = null;
  @Input() public disabled: boolean = false;
  @Input() public filters: any = {};
  @Output() public itemChange: EventEmitter<any> = new EventEmitter();

  public itemQuery: string;
  public isLoading = false;

  /* istanbul ignore next */
  selectItem(item) {
    this.item = item;
    this.itemChange.emit(item);
  }

  public abstract getSearchObservable(query: string): Observable<any>;

  /* istanbul ignore next */
  public setInitialValue() {
    const selectedItemId = (this.item && this.item.id) || this.item;

    if (selectedItemId !== null) {
      const item = this.items.find((el) => el.id === selectedItemId);
      if (item) {
        return this.setSelectedItem(item);
      }
    }
  }

  public setSelectedItem(item) {
    this.item = item;
  }

  /* istanbul ignore next */
  public search(query?: string) {
    this.isLoading = true;
    this.getSearchObservable(query).subscribe({
      next: (resp: any) => {
        this.isLoading = false;

        if (Array.isArray(resp)) {
          this.items = resp;
        } else if (Array.isArray(resp.data)) {
          this.items = resp.data;
        } else {
          this.items = [];
        }

        this.setInitialValue();
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }
}
