import { Component, OnInit, Input, Output, EventEmitter, ContentChild, ElementRef, ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'base-picker',
  templateUrl: './base-picker.html',
})
export class BasePicker {
  @Input() items: any[] = [];
  @Input() item: any = null;
  @Input() disabled = false;
  @Input() label = 'Selector';
  @Input() isLoading = false;

  @Output() itemChanged = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();

  @ViewChild('search', { static: false }) public searchElement: ElementRef;

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;
  @ContentChild('ng-content') content: ElementRef;

  public query = '';

  ngAfterContentInit() {
    console.log('content', this.content);
    setTimeout(() => {
      this.setupDebouncedSearch(this.searchElement.nativeElement);
      this.search();
    });
  }

  public selectItem(item) {
    this.itemChanged.emit(item);
  }

  /* istanbul ignore next */
  public setupDebouncedSearch(element) {
    fromEvent(element, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(250),
        distinctUntilChanged(),
      )
      .subscribe((text: string) => {
        this.search(text);
      });
  }

  search(text: string = '') {
    this.onSearch.emit(text);
  }
}