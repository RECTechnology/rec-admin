import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'translatable-list',
  styleUrls: ['./translatable-list.component.scss'],
  templateUrl: './translatable-list.component.html',
})
export class TranslatableListComponent implements OnInit {
  @Input() public displayedColumns: string[] = ['id', 'cat', 'esp', 'eng', 'actions'];
  public dataSource: any;

  @Input() public data = [];
  @Output('edit') public onEdit: EventEmitter<any> = new EventEmitter();
  @Output('aprove') public onAprove: EventEmitter<any> = new EventEmitter();
  @Output('delete') public onDelete: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  public ngOnInit() {
    console.log('daklsdjkasdkljasd', this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
