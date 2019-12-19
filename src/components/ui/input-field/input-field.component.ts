import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
})
export class InputFieldComponent {
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public name: string;
  @Input() public value: any = '';
  @Input() public disabled: boolean = false;
  @Input() public type: string = 'text';
  @Input() public debounced: boolean = false;

  // Only used for 'select'
  @Input() public options: string[] = null;

  @Output() public valueChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('input', { static: false }) public inputElement: ElementRef;

  public isNormalInput = true;

  public ngOnInit() {
    this.placeholder = this.placeholder || this.label;
    this.name = this.name || this.label;

    this.isNormalInput = [
      'text', 'number',
      'date', 'email',
      'color', 'button',
      'file', 'password',
      'image', 'tel',
    ].includes(this.type);

    if (this.debounced) {
      setTimeout(() => {
        this.setupDebouncedSearch(this.inputElement.nativeElement);
        if (this.value) {
          this.inputElement.nativeElement.value = this.value;
        }
      }, 100);
    }
  }

  public setupDebouncedSearch(element) {
    fromEvent(element, 'keyup').pipe(
      map((event: any) => event.target.value || this.value),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((text: string) => {
      this.valueChange.emit(text);
    });
  }
}
