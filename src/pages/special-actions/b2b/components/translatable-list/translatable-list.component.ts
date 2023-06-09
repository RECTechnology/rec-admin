import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'translatable-list',
  styleUrls: ['./translatable-list.component.scss'],
  templateUrl: './translatable-list.component.html',
})
export class TranslatableListComponent implements AfterViewInit {
  @Input() public displayedColumns: string[] = [];
  public dataSource: any = [];

  @Input() public data = [];
  @Input() public loading = true;
  @Input() public hasStatus = false;
  @Input() public showParent = false;
  @Input() public total = 0;
  @Input() public limit = 10;
  @Output() public dataChange: EventEmitter<any> = new EventEmitter();
  @Output('edit') public onEdit: EventEmitter<any> = new EventEmitter();
  @Output('aprove') public onAprove: EventEmitter<any> = new EventEmitter();
  @Output('delete') public onDelete: EventEmitter<any> = new EventEmitter();
  @Output('changedPage') public onChangePage: EventEmitter<any> = new EventEmitter();
  @Output('onSort') public onSortChange: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  ngOnInit() {
    this.displayedColumns = ['id', 'cat', 'esp', 'eng', 'actions'];
    if (this.showParent) this.displayedColumns = ['id', 'cat', 'esp', 'eng', 'parent', 'actions'];
  }

  public ngAfterViewInit() {
    this.updateData(this.data);
  }

  public updateData(data, total = 0) {
    this.paginator.length = total || this.total;
    this.paginator.pageSize = this.limit;
    this.dataSource = data;
  }

  public sortData(sort: MatSort) {
    this.onSortChange.emit(sort);
  }

  public changedPage($event) {
    this.onChangePage.emit($event);
  }
}
