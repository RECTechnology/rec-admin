import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Log, LogType } from 'src/shared/entities/log.ent';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.scss'],
})
export class LogViewComponent implements OnInit {
  @Input() logs: Log[] = [];
  @Input() type: LogType = 'DEBUG';
  @Input() lines: number = 100;
  @Input() search: string = '';

  @Output() linesChanged = new EventEmitter<number>();
  @Output() typeChanged = new EventEmitter<LogType>();
  @Output() syncEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}
}
