import { Component, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
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
  @Input() public subLabel: string;
  @Input() public placeholder: string;
  @Input() public name: string;
  @Input() public value: any = '';
  @Input() public disabled: boolean = false;
  @Input() public ngModel: boolean = false;
  @Input() public type: string = 'text';
  @Input() public debounced: boolean = false;
  @Input() public hasError: boolean = false;
  @Input() public error: string = '';
  @Input() public description: string = null;
  @Input('required') public isRequired: boolean = false;

  // Only used for 'select'
  @Input() public options: string[] = null;

  // Only used for 'text'
  @Input() public showMinMaxLabels: boolean = true;
  @Input() public minlength: number = null;
  @Input() public maxlength: number = null;

  @Output() public valueChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('input') public inputElement: ElementRef;

  public isNormalInput = true;

  public ngOnInit() {
    this.placeholder = this.placeholder || this.label;
    this.name = this.name || this.label;

    this.isNormalInput = [
      'text', 'number',
      'date', 'time',
      'email',
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

  public changed($event) {
    if($event!= ''){
      this.valueChange.emit(isNaN($event) ? $event : +$event);
    }
    

  }

  public setupDebouncedSearch(element) {
    fromEvent(element, 'keyup').pipe(
      map((event: any) => event.target.value || this.value),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(this.changed);
  }

  public getMinMaxLabel() {
    const hasMin = this.minlength != null;
    const hasMax = this.maxlength != null;
    const labels = [
      `${hasMin ? 'min: ' + this.minlength : ''}`,
      `${hasMax ? 'max: ' + this.maxlength : ''}`,
    ];
    return (hasMin || hasMax)
      ? `(${labels.join(' ').trim()})`
      : '';
  }
}
