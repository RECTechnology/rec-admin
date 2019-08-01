import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'translatable-list',
  styleUrls: ['./translatable-list.component.scss'],
  templateUrl: './translatable-list.component.html',
})
export class TranslatableListComponent {
  public displayedColumns: string[] = ['id', 'esp', 'cat', 'eng', 'actionss'];
  @Input() public dataSource = [];
  @Output('edit') public onEdit: EventEmitter<any> = new EventEmitter();
  @Output('delete') public onDelete: EventEmitter<any> = new EventEmitter();
}
