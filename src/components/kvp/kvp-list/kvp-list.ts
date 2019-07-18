import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
function array_move(arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing purposes
}

@Component({
  selector: 'kvp-list',
  styles: [
    `:host{display: block}`,
  ],
  templateUrl: './kvp-list.html',
})
export class KeyValuePair implements OnInit {
  @Input() public items: Array<{ key: string, value: string, active: boolean }> = [];
  @Input() public hidden: boolean = false;
  @Output('onChange') public onChange: EventEmitter<any> = new EventEmitter();
  @Output('hiddenChange') public hiddenChange: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {
    console.log('KeyValuePair', this.items);
  }

  public trackByFn(index, item) {
    return index; // or item.id
  }

  public moveItem(index, dir) {
    this.items = array_move(this.items, index, index + dir);
  }

  public newItem() {
    this.items.push({ key: '', value: '', active: true });
    this.onChange.emit(this.items);
  }

  public unhide() {
    this.hidden = false;
    this.hiddenChange.emit(this.hidden);
  }

  public hide() {
    this.hidden = true;
    this.hiddenChange.emit(this.hidden);
  }

  public changed(i, item) {
    this.items[i] = item;
    this.onChange.emit(this.items);
  }

  public removeItem(i) {
    this.items.splice(i, 1);
    this.onChange.emit(this.items);
  }
}
