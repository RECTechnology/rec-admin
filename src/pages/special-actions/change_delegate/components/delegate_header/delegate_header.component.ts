import { AlertsService } from 'src/services/alerts/alerts.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { CreateDelegateChange, NewDelegateChange } from '../create_delegate_change/create_delegate_change.dia';


@Component({
  selector: 'delegate-header',
  styleUrls: ['./delegate_header.css'],
  templateUrl: './delegate_header.html',
})
export class DelegateHeaderComponent {
  public searchQuery: string = '';

  @Output('onNewChange') public onNewChange: EventEmitter<NewDelegateChange>;
  @Output('onImport') public onImport: EventEmitter<any>;

  constructor(public utils: UtilsService, private alerts: AlertsService) {
    this.onNewChange = new EventEmitter();
    this.onImport = new EventEmitter();
  }

  public showNewChange() {
    this.alerts.openModal(CreateDelegateChange).subscribe((data: NewDelegateChange) => {
      if (!data) return;
      this.onNewChange.emit(data);
    });
  }

  public newImport() {
    this.onImport.emit();
  }
}
