import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Log, LogType } from 'src/shared/entities/log.ent';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.scss'],
})
export class LogViewComponent implements OnInit {
  @Input() logs: Log[] = [];
  @Input() type: LogType = 'DEBUG';
  @Input() search: string = '';

  @Output() queryChanged = new EventEmitter<string>();
  @Output() typeChanged = new EventEmitter<LogType>();
  @Output() syncEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges){
    if(changes.log){
      this.logs = changes.logs.currentValue;
    }else if(changes.search){
      this.search = changes.search.currentValue;
    }
  }

  
  
}
