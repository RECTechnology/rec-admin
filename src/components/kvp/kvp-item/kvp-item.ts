import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kvp-item',
  styleUrls: ['./kvp-item.css'],
  templateUrl: './kvp-item.html',
})
export class KeyValueItem implements OnInit {
  @Input() public key: string;
  @Input() public value: string;
  @Input() public active: string;

  @Input() public canMoveDown: boolean = true;
  @Input() public canMoveUp: boolean = true;
  @Input() public canRemove: boolean = true;

  @Output() public valueChange: EventEmitter<any> = new EventEmitter();
  @Output() public keyChange: EventEmitter<any> = new EventEmitter();
  @Output() public activeChange: EventEmitter<any> = new EventEmitter();

  @Output('onChange') public onChange: EventEmitter<any> = new EventEmitter();
  @Output('onRemove') public onRemove: EventEmitter<any> = new EventEmitter();
  @Output('onNewLine') public onNewLine: EventEmitter<any> = new EventEmitter();
  @Output('onUp') public onUp: EventEmitter<any> = new EventEmitter();
  @Output('onDown') public onDown: EventEmitter<any> = new EventEmitter();

  public newLine() {
    this.onNewLine.emit();
  }

  public up() {
    this.onUp.emit();
  }

  public down() {
    this.onDown.emit();
  }

  public changedKey() {
    this.keyChange.emit(this.key);
    this.onChange.emit({ key: this.key, value: this.value, active: this.active });
  }

  public changedValue() {
    this.valueChange.emit(this.value);
    this.onChange.emit({ key: this.key, value: this.value, active: this.active });
  }

  public changedActive() {
    this.activeChange.emit(this.active);
    this.onChange.emit({ key: this.key, value: this.value, active: this.active });
  }

  public remove() {
    this.onRemove.emit();
  }

  public ngOnInit() {
    console.log('On init', this.key, this.value);
  }
}
